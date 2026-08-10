import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ora from 'ora';
import pc from 'picocolors';
import {
  createRegistryGroups,
  createRegistryIndex,
  fetchFile,
  fetchRegistry,
  type RegistryComponent,
  type RegistryIndex,
} from '../registry.js';
import {
  fetchTextTargetsConcurrent,
  readConfig,
  requireAngularProject,
  resolveComponentBasePath,
  resolveRegistrySource,
} from '../utils.js';
import { listInstalledComponentNames } from './diff.js';
import { classifyUpdate } from './update.js';

const FILE_FETCH_CONCURRENCY = 6;

export type ComponentOutdatedStatus = 'up-to-date' | 'outdated' | 'has-conflicts';

export interface ComponentOutdatedSummary {
  name: string;
  status: ComponentOutdatedStatus;
  changedFiles: number;
  conflictFiles: number;
  missingFiles: number;
  failedFiles: number;
}

interface ComponentOutdatedJob {
  componentName: string;
  label: string;
  dest: string;
  remotePath: string;
  recordedHash?: string;
}

function printComponents(components: RegistryComponent[]): void {
  if (components.length === 0) return;
  const nameWidth = Math.max(...components.map((c) => c.name.length), 4);
  for (const c of components) {
    const name = pc.bold(c.name.padEnd(nameWidth));
    const deps = c.peerDependencies ? Object.keys(c.peerDependencies).join(', ') : '';
    const depsStr = deps ? pc.dim(`  [${deps}]`) : '';
    console.log(`  ${name}  ${c.description}${depsStr}`);
  }
}

export async function getComponentOutdatedSummaries(
  components: RegistryComponent[],
  registryIndex: RegistryIndex,
  options: {
    cwd: string;
    componentBasePath: string;
    sharedDestDir: string;
    registrySource?: string;
    installedHashes?: Record<string, string>;
  },
): Promise<ComponentOutdatedSummary[]> {
  const jobs: ComponentOutdatedJob[] = [];

  for (const component of components) {
    for (const depName of component.sharedDeps ?? []) {
      const shared = registryIndex.sharedByName.get(depName);
      if (!shared) continue;
      const fileName = shared.file.split('/').pop()!;
      const label = `shared/${fileName}`;
      jobs.push({
        componentName: component.name,
        label,
        dest: join(options.sharedDestDir, fileName),
        remotePath: shared.file,
        recordedHash: options.installedHashes?.[label],
      });
    }

    const destDir = join(options.componentBasePath, component.name);
    for (const file of component.files) {
      const fileName = file.split('/').pop()!;
      const label = `${component.name}/${fileName}`;
      jobs.push({
        componentName: component.name,
        label,
        dest: join(destDir, fileName),
        remotePath: `components/${file}`,
        recordedHash: options.installedHashes?.[label],
      });
    }
  }

  const summaries = new Map<string, ComponentOutdatedSummary>(
    components.map((component) => [
      component.name,
      {
        name: component.name,
        status: 'up-to-date',
        changedFiles: 0,
        conflictFiles: 0,
        missingFiles: 0,
        failedFiles: 0,
      },
    ]),
  );

  const fetchJobs = jobs.filter((job) => existsSync(job.dest));
  const fetchResults = await fetchTextTargetsConcurrent(
    fetchJobs,
    FILE_FETCH_CONCURRENCY,
    (remotePath) => fetchFile(remotePath, options.registrySource),
  );
  const resultByLabel = new Map(
    fetchResults.map((result) => [`${result.componentName}:${result.label}`, result]),
  );

  for (const job of jobs) {
    const summary = summaries.get(job.componentName);
    if (!summary) continue;

    if (!existsSync(job.dest)) {
      summary.status = summary.status === 'has-conflicts' ? 'has-conflicts' : 'outdated';
      summary.changedFiles++;
      summary.missingFiles++;
      continue;
    }

    const result = resultByLabel.get(`${job.componentName}:${job.label}`);
    if (!result || !result.ok) {
      summary.status = 'has-conflicts';
      summary.failedFiles++;
      continue;
    }

    const local = readFileSync(job.dest, 'utf-8');
    const classification = classifyUpdate(
      job.label,
      job.dest,
      local,
      result.content,
      job.recordedHash,
    );

    if (classification.kind === 'unchanged') continue;
    summary.changedFiles++;
    if (classification.kind === 'conflict') {
      summary.status = 'has-conflicts';
      summary.conflictFiles++;
    } else if (summary.status !== 'has-conflicts') {
      summary.status = 'outdated';
    }
  }

  return components.map((component) => summaries.get(component.name)!);
}

function printOutdatedSummaries(summaries: ComponentOutdatedSummary[]): void {
  const nameWidth = Math.max(...summaries.map((summary) => summary.name.length), 4);
  const statusWidth = 'has-conflicts'.length;

  for (const summary of summaries) {
    const status =
      summary.status === 'up-to-date'
        ? pc.green(summary.status.padEnd(statusWidth))
        : summary.status === 'outdated'
          ? pc.cyan(summary.status.padEnd(statusWidth))
          : pc.yellow(summary.status.padEnd(statusWidth));
    const detailParts: string[] = [];
    if (summary.changedFiles > 0) detailParts.push(`${summary.changedFiles} changed`);
    if (summary.conflictFiles > 0) detailParts.push(`${summary.conflictFiles} conflicts`);
    if (summary.missingFiles > 0) detailParts.push(`${summary.missingFiles} missing`);
    if (summary.failedFiles > 0) detailParts.push(`${summary.failedFiles} fetch failed`);
    const detail = detailParts.length > 0 ? pc.dim(`  (${detailParts.join(', ')})`) : '';

    console.log(`  ${pc.bold(summary.name.padEnd(nameWidth))}  ${status}${detail}`);
  }
}

export const listCommand = new Command('list')
  .alias('ls')
  .description('List available components')
  .option('-i, --installed', 'show only installed components', false)
  .option('--outdated', 'show installed component update status against the current registry', false)
  .option('-p, --path <path>', 'component path relative to cwd (used with --installed)')
  .option('--registry <url>', 'custom registry URL')
  .action(async (options: { installed: boolean; outdated: boolean; path?: string; registry?: string }) => {
    const config = readConfig(process.cwd());
    const registrySource = resolveRegistrySource(undefined, config, options.registry);
    const spinner = ora('Loading components...').start();
    const registry = await fetchRegistry(registrySource);
    const registryIndex = createRegistryIndex(registry);
    spinner.stop();

    let { components } = registry;

    if (options.installed || options.outdated) {
      requireAngularProject(process.cwd());
      const componentBasePath = resolveComponentBasePath(process.cwd(), options.path, config);
      const installedNames = new Set(listInstalledComponentNames(componentBasePath, registry));
      components = components.filter((c) => installedNames.has(c.name));

      if (options.outdated) {
        const sharedDestDir = config?.sharedPath
          ? resolve(process.cwd(), config.sharedPath)
          : join(componentBasePath, 'shared');

        console.log(pc.cyan(`\nInstalled component status`) + pc.dim(` (${components.length})\n`));

        if (components.length === 0) {
          console.log(pc.dim('  None installed yet. Run `sanring add <component>` to get started.\n'));
          return;
        }

        const summaries = await getComponentOutdatedSummaries(components, registryIndex, {
          cwd: process.cwd(),
          componentBasePath,
          sharedDestDir,
          registrySource,
          installedHashes: config?.installedHashes,
        });

        printOutdatedSummaries(summaries);

        const upToDate = summaries.filter((summary) => summary.status === 'up-to-date').length;
        const outdated = summaries.filter((summary) => summary.status === 'outdated').length;
        const conflicts = summaries.filter((summary) => summary.status === 'has-conflicts').length;
        console.log(
          pc.dim(
            `\n  ${upToDate} up-to-date, ${outdated} outdated, ${conflicts} with conflicts.`,
          ),
        );
        console.log(pc.dim(`  Run ${pc.white('sanring update')} to apply safe updates.\n`));
        return;
      }
    }

    const title = options.installed ? 'Installed components' : 'Available components';
    console.log(pc.cyan(`\n${title}`) + pc.dim(` (${components.length}${options.installed ? '' : ' total'})\n`));

    if (components.length === 0) {
      console.log(pc.dim('  None installed yet. Run `sanring add <component>` to get started.\n'));
      return;
    }

    const componentByName = new Map(components.map((component) => [component.name, component]));
    const printed = new Set<string>();

    for (const group of createRegistryGroups(registry)) {
      const groupComponents = group.components
        .map((name) => componentByName.get(name))
        .filter((component): component is RegistryComponent => Boolean(component));

      if (groupComponents.length === 0) continue;

      console.log(pc.bold(group.title));
      if (group.description) console.log(pc.dim(`  ${group.description}`));
      printComponents(groupComponents);
      console.log('');

      for (const component of groupComponents) printed.add(component.name);
    }

    const ungrouped = components.filter((component) => !printed.has(component.name));
    if (ungrouped.length > 0) {
      console.log(pc.bold('Other'));
      printComponents(ungrouped);
      console.log('');
    }

    if (options.installed) {
      console.log(pc.dim(`  Run ${pc.white('sanring diff')} to check for updates.\n`));
    } else {
      console.log(pc.dim(`  Run ${pc.white('sanring add <component>')} to install.\n`));
    }
  });
