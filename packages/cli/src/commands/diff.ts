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
  isUntouchedSinceInstall,
  readConfig,
  reportRegistryFetchError,
  requireAngularProject,
  resolveComponentBasePath,
  resolveRegistrySource,
} from '../utils.js';
import { THEME_FILE_PATH } from './init.js';

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

export function registryRelativePath(file: string, prefix: string): string {
  const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
  return file.startsWith(normalizedPrefix) ? file.slice(normalizedPrefix.length) : file.split('/').pop()!;
}

export interface DiffFileJob {
  componentName: string;
  label: string;
  localPath: string;
  remotePath: string;
  recordedHash?: string;
}

/** Build the canonical file set consumed by diff, add --diff, and update. */
export function buildDiffJobs(
  components: RegistryComponent[],
  registryIndex: RegistryIndex,
  options: { componentBasePath: string; sharedDestDir: string; themeDest?: string; installedHashes?: Record<string, string> },
): DiffFileJob[] {
  const jobs: DiffFileJob[] = [];
  if (options.themeDest && existsSync(options.themeDest) && registryIndex.sharedByName.has('theme')) {
    const theme = registryIndex.sharedByName.get('theme')!;
    jobs.push({ componentName: '__theme__', label: THEME_FILE_PATH, localPath: options.themeDest, remotePath: theme.file, recordedHash: options.installedHashes?.[THEME_FILE_PATH] });
  }
  const sharedNames = new Set(components.flatMap((component) => component.sharedDeps ?? []));
  for (const name of sharedNames) {
    const shared = registryIndex.sharedByName.get(name);
    if (!shared) continue;
    const fileName = registryRelativePath(shared.file, 'shared');
    const label = `shared/${fileName}`;
    jobs.push({ componentName: '__shared__', label, localPath: join(options.sharedDestDir, fileName), remotePath: shared.file, recordedHash: options.installedHashes?.[label] });
  }
  for (const component of components) {
    const destDir = join(options.componentBasePath, component.name);
    for (const file of component.files) {
      const fileName = registryRelativePath(file, component.name);
      const label = `${component.name}/${fileName}`;
      jobs.push({ componentName: component.name, label, localPath: join(destDir, fileName), remotePath: `components/${file}`, recordedHash: options.installedHashes?.[label] });
    }
  }
  return jobs;
}

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
  .option('--summary', 'print counts only, without line-by-line diff output', false)
  .option('--json', 'output a machine-readable summary', false)
  .action(
    async (
      componentNames: string[],
      options: { path?: string; registry?: string; exitCode: boolean; summary: boolean; json: boolean },
    ) => {
      const cwd = process.cwd();

      requireAngularProject(cwd);

      const config = readConfig(cwd);
      const registrySource = resolveRegistrySource(undefined, config, options.registry);
      const componentBasePath = resolveComponentBasePath(cwd, options.path, config);
      const sharedDestDir = config?.sharedPath
        ? resolve(cwd, config.sharedPath)
        : join(componentBasePath, 'shared');

      let registry;
      try {
        registry = await fetchRegistry(registrySource);
      } catch (e) {
        reportRegistryFetchError(e, { json: options.json });
      }
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
        // Unknown targets are input errors. --exit-code only controls the
        // result of a valid comparison that found drift.
        process.exit(1);
        return;
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
      const themeDest = join(cwd, THEME_FILE_PATH);
      const jobs = buildDiffJobs(components, registryIndex, {
        componentBasePath,
        sharedDestDir,
        themeDest,
        installedHashes: config?.installedHashes,
      });

      const fileResults: Array<{ label: string; status: FileDiffStatus }> = [];
      let changed = 0,
        checked = 0,
        autoSafe = 0;

      function tally(status: ReturnType<typeof printFileDiff>) {
        if (status === 'unchanged') return;
        changed++;
        if (status === 'auto') autoSafe++;
      }

      const compareJobs = jobs.filter((job) => existsSync(job.localPath));
      const results = await fetchTextTargetsConcurrent(
        compareJobs,
        FILE_FETCH_CONCURRENCY,
        (remotePath) => fetchFile(remotePath, registrySource),
      );
      const resultByLabel = new Map(results.map((result) => [result.label, result]));

      for (const job of jobs) {
        if (!existsSync(job.localPath)) {
          if (!options.summary && !options.json) console.log(pc.cyan(`  + ${job.label} (new in registry — run \`sanring update\` to install)`));
          fileResults.push({ label: job.label, status: 'auto' });
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
        const status = local === result.content
          ? 'unchanged'
          : isUntouchedSinceInstall(local, job.recordedHash)
            ? 'auto'
            : 'conflict';
        fileResults.push({ label: job.label, status });
        if (options.summary || options.json) tally(status);
        else tally(printFileDiff(job.label, local, result.content, job.recordedHash));
      }

      if (checked === 0) {
        if (options.json) {
          console.log(JSON.stringify({ checked: 0, changed: 0, autoSafe: 0, conflicts: 0, files: [] }, null, 2));
          return;
        }
        console.log(pc.dim('\n  Nothing to compare — no installed files found.\n'));
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({
          checked,
          changed,
          autoSafe,
          conflicts: fileResults.filter((result) => result.status === 'conflict').length,
          files: fileResults,
        }, null, 2));
        if (options.exitCode && changed > 0) process.exit(1);
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

      if (options.summary) {
        const conflicts = fileResults.filter((result) => result.status === 'conflict').length;
        console.log(pc.dim(`Summary: ${checked} checked, ${changed} changed, ${autoSafe} safe, ${conflicts} conflicts.\n`));
      }

      if (options.exitCode && changed > 0) process.exit(1);
    },
  );
