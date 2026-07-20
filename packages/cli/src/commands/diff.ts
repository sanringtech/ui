import { Command } from 'commander';
import { diffLines } from 'diff';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pc from 'picocolors';
import {
  createRegistryIndex,
  fetchFile,
  fetchRegistry,
  type Registry,
  type RegistryComponent,
  type RegistryIndex,
} from '../registry.js';
import {
  fetchTextTargetsConcurrent,
  isAngularProject,
  isUntouchedSinceInstall,
  readConfig,
} from '../utils.js';
import { THEME_FILE_PATH } from './init.js';

const DEFAULT_PATH = 'src/app/components/ui';
const FILE_FETCH_CONCURRENCY = 6;

// Sanring UI has no version concept — components are copied source, not npm
// packages — so "up to date" only ever means "identical to what's in the
// registry right now." This command exists to make drift *visible* before
// `add --force` would otherwise silently clobber local customizations.

export function listInstalledComponentNames(
  componentBasePath: string,
  registry: Registry | RegistryIndex,
): string[] {
  if (!existsSync(componentBasePath)) return [];
  const known = new Set(
    'componentNames' in registry
      ? registry.componentNames
      : createRegistryIndex(registry).componentNames,
  );
  return readdirSync(componentBasePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && known.has(entry.name))
    .map((entry) => entry.name);
}

export function resolveDiffTargets(
  requestedNames: string[],
  componentBasePath: string,
  registry: Registry | RegistryIndex,
): { components: RegistryComponent[]; missing: string[]; notInstalled: string[] } {
  const registryIndex = 'componentsByName' in registry ? registry : createRegistryIndex(registry);
  const byName = registryIndex.componentsByName;
  const names =
    requestedNames.length > 0
      ? requestedNames
      : listInstalledComponentNames(componentBasePath, registryIndex);

  const components: RegistryComponent[] = [];
  const missing: string[] = [];
  const notInstalled: string[] = [];

  for (const name of names) {
    const component = byName.get(name);
    if (!component) {
      missing.push(name);
      continue;
    }
    if (!existsSync(join(componentBasePath, name))) {
      notInstalled.push(name);
      continue;
    }
    components.push(component);
  }

  return { components, missing, notInstalled };
}

export type FileDiffStatus = 'unchanged' | 'auto' | 'conflict';

// `recordedHash` — the baseline captured at the last add/update, if any —
// lets this tell "registry moved on, you never touched this file" (auto)
// apart from "you customized it" (conflict), same distinction `update` uses
// to decide what it can apply without asking.
export function printFileDiff(
  label: string,
  local: string,
  remote: string,
  recordedHash?: string,
): FileDiffStatus {
  if (local === remote) {
    console.log(pc.dim(`  ✔ ${label} (up to date)`));
    return 'unchanged';
  }

  const status: FileDiffStatus = isUntouchedSinceInstall(local, recordedHash) ? 'auto' : 'conflict';
  if (status === 'auto') {
    console.log(
      pc.cyan(`  ○ ${label} (registry updated, no local changes — safe to \`sanring update\`)`),
    );
  } else {
    console.log(pc.yellow(`  ● ${label}`));
  }

  for (const part of diffLines(local, remote)) {
    const color = part.added ? pc.green : part.removed ? pc.red : pc.dim;
    const prefix = part.added ? '+' : part.removed ? '-' : ' ';
    const text = part.value.endsWith('\n') ? part.value.slice(0, -1) : part.value;
    for (const line of text.split('\n')) {
      console.log(color(`    ${prefix} ${line}`));
    }
  }
  return status;
}

export const diffCommand = new Command('diff')
  .description(
    'Compare installed component/theme files against the current registry (no components = diff everything installed)',
  )
  .argument('[components...]', 'component name(s) to check; omit to check everything installed')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option('--exit-code', 'exit with code 1 if any files differ (useful for CI)', false)
  .action(
    async (
      componentNames: string[],
      options: { path?: string; registry?: string; exitCode: boolean },
    ) => {
      const cwd = process.cwd();
      const registrySource = options.registry;

      if (!isAngularProject(cwd)) {
        console.error(pc.red('✖ No angular.json found.'));
        console.error(pc.dim('  Run from the root of an Angular project.'));
        process.exit(1);
      }

      const config = readConfig(cwd);
      const componentBasePath = resolve(cwd, options.path ?? config?.componentPath ?? DEFAULT_PATH);
      const sharedDestDir = config?.sharedPath
        ? resolve(cwd, config.sharedPath)
        : join(componentBasePath, 'shared');

      const registry = await fetchRegistry(registrySource);
      const registryIndex = createRegistryIndex(registry);
      const { components, missing, notInstalled } = resolveDiffTargets(
        componentNames,
        componentBasePath,
        registryIndex,
      );

      if (missing.length > 0) {
        console.error(
          pc.red(`✖ Unknown component${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`),
        );
      }
      if (notInstalled.length > 0) {
        console.log(
          pc.dim(
            `  Not installed, skipping: ${notInstalled.join(', ')} (run ${pc.white('sanring add')} first)`,
          ),
        );
      }

      // Collect jobs upfront then fetch compare targets with bounded concurrency —
      // avoids sequential waterfall latency (and hammering a remote registry
      // unbounded) when many components are installed.
      type DiffJob =
        | { kind: 'new'; label: string }
        | {
            kind: 'compare';
            label: string;
            localPath: string;
            remotePath: string;
            recordedHash?: string;
          };

      const jobs: DiffJob[] = [];

      const themeDest = join(cwd, THEME_FILE_PATH);
      const themeShared = registryIndex.sharedByName.get('theme');
      if (themeShared && existsSync(themeDest)) {
        jobs.push({
          kind: 'compare',
          label: THEME_FILE_PATH,
          localPath: themeDest,
          remotePath: themeShared.file,
          recordedHash: config?.installedHashes?.[THEME_FILE_PATH],
        });
      }

      const sharedNamesNeeded = new Set<string>();
      for (const component of components) {
        for (const depName of component.sharedDeps ?? []) sharedNamesNeeded.add(depName);
      }
      for (const depName of sharedNamesNeeded) {
        const shared = registryIndex.sharedByName.get(depName);
        if (!shared) continue;
        const fileName = shared.file.split('/').pop()!;
        const dest = join(sharedDestDir, fileName);
        const label = `shared/${fileName}`;
        if (!existsSync(dest)) {
          jobs.push({ kind: 'new', label });
        } else {
          jobs.push({
            kind: 'compare',
            label,
            localPath: dest,
            remotePath: shared.file,
            recordedHash: config?.installedHashes?.[label],
          });
        }
      }

      for (const component of components) {
        const destDir = join(componentBasePath, component.name);
        for (const file of component.files) {
          const fileName = file.split('/').pop()!;
          const dest = join(destDir, fileName);
          const label = `${component.name}/${fileName}`;
          if (!existsSync(dest)) {
            jobs.push({ kind: 'new', label });
          } else {
            jobs.push({
              kind: 'compare',
              label,
              localPath: dest,
              remotePath: `components/${file}`,
              recordedHash: config?.installedHashes?.[label],
            });
          }
        }
      }

      let changed = 0,
        checked = 0,
        autoSafe = 0;

      function tally(status: ReturnType<typeof printFileDiff>) {
        if (status === 'unchanged') return;
        changed++;
        if (status === 'auto') autoSafe++;
      }

      const compareJobs = jobs.filter((job) => job.kind === 'compare');
      const results = await fetchTextTargetsConcurrent(
        compareJobs,
        FILE_FETCH_CONCURRENCY,
        (remotePath) => fetchFile(remotePath, registrySource),
      );
      const resultByLabel = new Map(results.map((result) => [result.label, result]));

      for (const job of jobs) {
        if (job.kind === 'new') {
          console.log(
            pc.cyan(`  + ${job.label} (new in registry — run \`sanring update\` to install)`),
          );
          checked++;
          changed++;
          autoSafe++;
          continue;
        }
        const result = resultByLabel.get(job.label)!;
        if (!result.ok) {
          console.warn(
            pc.yellow(
              `  ⚠ Could not fetch ${job.remotePath}: ${result.error instanceof Error ? result.error.message : result.error}`,
            ),
          );
          continue;
        }
        const local = readFileSync(job.localPath, 'utf-8');
        checked++;
        tally(printFileDiff(job.label, local, result.content, job.recordedHash));
      }

      if (checked === 0) {
        console.log(pc.dim('\n  Nothing to compare — no installed files found.\n'));
        return;
      }

      console.log('');
      if (changed === 0) {
        console.log(
          pc.green(`✔ All ${checked} file${checked > 1 ? 's' : ''} match the registry.\n`),
        );
      } else {
        const reviewCount = changed - autoSafe;
        const notes: string[] = [];
        if (autoSafe > 0) notes.push(`${autoSafe} safe to update`);
        if (reviewCount > 0)
          notes.push(`${reviewCount} need${reviewCount === 1 ? 's' : ''} review`);
        console.log(
          pc.yellow(
            `● ${changed} of ${checked} file${checked > 1 ? 's' : ''} differ from the registry`,
          ) + pc.dim(` (${notes.join(', ')}). Run \`sanring update\` to apply.\n`),
        );
      }

      if (options.exitCode && changed > 0) process.exit(1);
    },
  );
