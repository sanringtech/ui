import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pc from 'picocolors';
import { createRegistryIndex, fetchFile, fetchRegistry } from '../registry.js';
import {
  confirmPrompt,
  getCliVersion,
  hashContent,
  isUntouchedSinceInstall,
  fetchTextTargetsConcurrent,
  readConfig,
  requireAngularProject,
  resolveComponentPath,
  resolveRegistrySource,
  writeConfig,
} from '../utils.js';
import { writeFile } from './add.js';
import { buildDiffJobs, printFileDiff, resolveDiffTargets } from './diff.js';
import { THEME_FILE_PATH } from './init.js';

const FILE_FETCH_CONCURRENCY = 6;

interface PendingFile {
  label: string;
  dest: string;
  local: string;
  remote: string;
}

interface AutoFile {
  label: string;
  dest: string;
  remote: string;
}

export type UpdateClassification =
  | { kind: 'unchanged' }
  | { kind: 'auto'; label: string; dest: string; remote: string }
  | { kind: 'conflict'; label: string; dest: string; local: string; remote: string };

// Tells "registry moved on but the user never touched this file" apart from
// "the user customized it" without keeping a full copy of the original file
// around — just the hash of its content as of the last `add`/`update`. Only
// the first case can be applied silently; the second still needs a human to
// look at the diff, since we'd otherwise clobber a real customization.
export function classifyUpdate(
  label: string,
  dest: string,
  local: string,
  remote: string,
  recordedHash: string | undefined,
): UpdateClassification {
  if (local === remote) return { kind: 'unchanged' };
  if (isUntouchedSinceInstall(local, recordedHash)) {
    return { kind: 'auto', label, dest, remote };
  }
  return { kind: 'conflict', label, dest, local, remote };
}

function confirmFile(label: string, yes: boolean): Promise<boolean> {
  return confirmPrompt({ yes, question: pc.dim(`  Apply this change to ${label}?`) + ' [y/N]: ' });
}

export const updateCommand = new Command('update')
  .description(
    'Pull registry changes into installed components (no components = check everything installed)',
  )
  .argument('[components...]', 'component name(s) to update; omit to check everything installed')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('-y, --yes', 'apply every change without prompting', false)
  .option('--dry-run', 'show what would change without writing anything', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option(
    '--trust',
    'treat files with no recorded baseline as untouched — use this for installs predating v0.9.0 hash tracking',
    false,
  )
  .action(
    async (
      componentNames: string[],
      options: { path?: string; yes: boolean; dryRun: boolean; registry?: string; trust: boolean },
    ) => {
      const cwd = process.cwd();

      requireAngularProject(cwd);

      const config = readConfig(cwd);
      const registrySource = resolveRegistrySource(undefined, config, options.registry);
      const resolvedComponentPath = resolveComponentPath(options.path, config);
      const componentBasePath = resolve(cwd, resolvedComponentPath);
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
        process.exit(1);
        return;
      }
      if (notInstalled.length > 0) {
        console.log(pc.yellow(`  Not installed, skipping: ${notInstalled.join(', ')}`));
        console.log(pc.dim(`  Run ${pc.white(`sanring add ${notInstalled.join(' ')}`)} first.`));
      }

      // Gather every file that differs, same set diff.ts would compare, and
      // sort each into "safe to apply silently" vs. "needs a human to look".
      const installedHashes = { ...config?.installedHashes };
      const installedVersions = { ...config?.installedVersions };
      const auto: AutoFile[] = [];
      const added: AutoFile[] = [];
      const pending: PendingFile[] = [];
      let backfilled = 0;
      let trusted = 0;

      function classify(label: string, dest: string, local: string, remote: string) {
        const classification = classifyUpdate(label, dest, local, remote, installedHashes[label]);
        if (classification.kind === 'unchanged') {
          if (installedHashes[label] === undefined) {
            installedHashes[label] = hashContent(local);
            backfilled++;
          }
          return;
        }
        // --trust: no baseline recorded (pre-0.9.0 install) → the user asserts
        // they haven't customized this file, so promote conflict → auto.
        if (
          options.trust &&
          classification.kind === 'conflict' &&
          installedHashes[label] === undefined
        ) {
          auto.push({
            label: classification.label,
            dest: classification.dest,
            remote: classification.remote,
          });
          trusted++;
          return;
        }
        if (classification.kind === 'auto') auto.push(classification);
        else pending.push(classification);
      }

      const themeDest = join(cwd, THEME_FILE_PATH);
      const jobs = buildDiffJobs(components, registryIndex, {
        componentBasePath,
        sharedDestDir,
        themeDest,
        installedHashes: config?.installedHashes,
      });

      const remoteResults = await fetchTextTargetsConcurrent(
        jobs,
        FILE_FETCH_CONCURRENCY,
        (remotePath) => fetchFile(remotePath, registrySource),
      );

      for (const result of remoteResults) {
        if (!result.ok) {
          console.warn(
            pc.yellow(
              `  ⚠ Could not fetch ${result.remotePath}: ${result.error instanceof Error ? result.error.message : result.error}`,
            ),
          );
          continue;
        }
        const { label, localPath: dest, content: remote } = result;
        if (!existsSync(dest)) {
          added.push({ label, dest, remote });
          continue;
        }
        const local = readFileSync(dest, 'utf-8');
        classify(label, dest, local, remote);
      }

      if (added.length === 0 && auto.length === 0 && pending.length === 0) {
        if (!options.dryRun && backfilled > 0) {
          writeConfig(cwd, {
            ...config,
            componentPath: resolvedComponentPath,
            sharedPath: config?.sharedPath,
            installedHashes,
          });
        }
        console.log(pc.green('\n✔ Everything already matches the registry. Nothing to update.\n'));
        return;
      }

      let applied = 0,
        skipped = 0;

      // Files present in registry but missing locally — added to the component
      // after the user's last install. No local version to conflict with.
      if (added.length > 0) {
        console.log(
          pc.cyan(
            `\n${added.length} new file${added.length > 1 ? 's' : ''} in registry (added since you last installed):\n`,
          ),
        );
        for (const file of added) {
          if (options.dryRun) {
            console.log(pc.dim(`  + ${file.label} (dry run, would install)`));
            continue;
          }
          writeFile(file.dest, file.remote, true);
          installedHashes[file.label] = hashContent(file.remote);
          console.log(pc.green(`  ✔ ${file.label} (new)`));
          applied++;
        }
        console.log('');
      }

      // Untouched since install — the registry moved on but the user never
      // edited their copy, so there's nothing to lose by applying directly.
      if (auto.length > 0) {
        const trustNote =
          options.trust && trusted > 0
            ? pc.dim(` (${trusted} via --trust — no baseline recorded, assumed untouched)`)
            : '';
        console.log(
          pc.cyan(
            `\n${auto.length} file${auto.length > 1 ? 's' : ''} unchanged locally, applying registry update:`,
          ) +
            trustNote +
            '\n',
        );
        for (const file of auto) {
          if (options.dryRun) {
            console.log(
              pc.dim(`  – ${file.label} (dry run, would auto-update — no local changes)`),
            );
            continue;
          }
          writeFile(file.dest, file.remote, true);
          installedHashes[file.label] = hashContent(file.remote);
          console.log(pc.green(`  ✔ ${file.label} (auto-updated — no local changes)`));
          applied++;
        }
        console.log('');
      }

      // Locally modified — show the diff and ask before overwriting.
      if (pending.length > 0) {
        console.log(
          pc.cyan(
            `${pending.length} file${pending.length > 1 ? 's' : ''} differ and were locally modified:\n`,
          ),
        );
        for (const file of pending) {
          printFileDiff(file.label, file.local, file.remote);

          if (options.dryRun) {
            console.log(pc.dim(`  – ${file.label} (dry run, would prompt to apply)\n`));
            continue;
          }

          const confirmed = await confirmFile(file.label, options.yes);
          if (confirmed) {
            writeFile(file.dest, file.remote, true);
            installedHashes[file.label] = hashContent(file.remote);
            console.log(pc.green(`  ✔ Updated ${file.label}\n`));
            applied++;
          } else {
            console.log(pc.dim(`  – Skipped ${file.label}\n`));
            skipped++;
          }
        }
      }

      if (options.dryRun) {
        console.log(pc.dim(`  Dry run — no files were written.\n`));
        return;
      }

      if (applied > 0) {
        const cliVersion = getCliVersion();
        // Lazy migration: a component touched by `update` gets the current
        // key format. Legacy bare keys are only left alone until next touched.
        const effectiveAlias = config?.defaultRegistry;
        for (const component of components) {
          if (effectiveAlias) delete installedVersions[component.name];
          const key = effectiveAlias ? `${effectiveAlias}:${component.name}` : component.name;
          installedVersions[key] = cliVersion;
        }
      }
      writeConfig(cwd, {
        ...config,
        componentPath: resolvedComponentPath,
        sharedPath: config?.sharedPath,
        installedHashes,
        installedVersions,
      });

      const parts: string[] = [];
      if (applied > 0) parts.push(pc.green(`${applied} updated`));
      if (skipped > 0) parts.push(pc.dim(`${skipped} skipped`));
      console.log(`${parts.join(', ')}\n`);
    },
  );
