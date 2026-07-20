import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import pc from 'picocolors';
import { fetchFile, fetchRegistry } from '../registry.js';
import { hashContent, isAngularProject, isUntouchedSinceInstall, readConfig, writeConfig } from '../utils.js';
import { writeFile } from './add.js';
import { printFileDiff, resolveDiffTargets } from './diff.js';
import { THEME_FILE_PATH } from './init.js';

const DEFAULT_PATH = 'src/app/components/ui';

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

async function confirmFile(label: string, yes: boolean): Promise<boolean> {
  if (yes) return true;
  if (!process.stdin.isTTY) return false;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(pc.dim(`  Apply this change to ${label}?`) + ' [y/N]: ');
  rl.close();
  return answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes';
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
  .action(
    async (
      componentNames: string[],
      options: { path?: string; yes: boolean; dryRun: boolean; registry?: string },
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
      const sharedDestDir = join(componentBasePath, 'shared');

      const registry = await fetchRegistry(registrySource);
      const { components, missing, notInstalled } = resolveDiffTargets(
        componentNames,
        componentBasePath,
        registry,
      );

      if (missing.length > 0) {
        console.error(pc.red(`✖ Unknown component${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`));
      }
      if (notInstalled.length > 0) {
        console.log(pc.dim(`  Not installed, skipping: ${notInstalled.join(', ')}`));
      }

      // Gather every file that differs, same set diff.ts would compare, and
      // sort each into "safe to apply silently" vs. "needs a human to look".
      const installedHashes = { ...config?.installedHashes };
      const auto: AutoFile[] = [];
      const added: AutoFile[] = [];
      const pending: PendingFile[] = [];
      let backfilled = 0;

      function classify(label: string, dest: string, local: string, remote: string) {
        const classification = classifyUpdate(label, dest, local, remote, installedHashes[label]);
        if (classification.kind === 'unchanged') {
          if (installedHashes[label] === undefined) {
            installedHashes[label] = hashContent(local);
            backfilled++;
          }
          return;
        }
        if (classification.kind === 'auto') auto.push(classification);
        else pending.push(classification);
      }

      const themeDest = join(cwd, THEME_FILE_PATH);
      const themeShared = registry.shared.find((s) => s.name === 'theme');
      if (themeShared && existsSync(themeDest)) {
        const remote = await fetchFile(themeShared.file, registrySource);
        const local = readFileSync(themeDest, 'utf-8');
        classify(THEME_FILE_PATH, themeDest, local, remote);
      }

      const sharedNamesNeeded = new Set<string>();
      for (const component of components) {
        for (const depName of component.sharedDeps ?? []) sharedNamesNeeded.add(depName);
      }
      for (const depName of sharedNamesNeeded) {
        const shared = registry.shared.find((s) => s.name === depName);
        if (!shared) continue;
        const fileName = shared.file.split('/').pop()!;
        const dest = join(sharedDestDir, fileName);
        const label = `shared/${fileName}`;
        const remote = await fetchFile(shared.file, registrySource);
        if (!existsSync(dest)) {
          added.push({ label, dest, remote });
          continue;
        }
        const local = readFileSync(dest, 'utf-8');
        classify(label, dest, local, remote);
      }

      for (const component of components) {
        const destDir = join(componentBasePath, component.name);
        for (const file of component.files) {
          const fileName = file.split('/').pop()!;
          const dest = join(destDir, fileName);
          const label = `${component.name}/${fileName}`;
          const remote = await fetchFile(`components/${file}`, registrySource);
          if (!existsSync(dest)) {
            added.push({ label, dest, remote });
            continue;
          }
          const local = readFileSync(dest, 'utf-8');
          classify(label, dest, local, remote);
        }
      }

      if (added.length === 0 && auto.length === 0 && pending.length === 0) {
        if (!options.dryRun && backfilled > 0) writeConfig(cwd, { componentPath: config?.componentPath ?? DEFAULT_PATH, installedHashes });
        console.log(pc.green('\n✔ Everything already matches the registry. Nothing to update.\n'));
        return;
      }

      let applied = 0, skipped = 0;

      // Files present in registry but missing locally — added to the component
      // after the user's last install. No local version to conflict with.
      if (added.length > 0) {
        console.log(
          pc.cyan(`\n${added.length} new file${added.length > 1 ? 's' : ''} in registry (added since you last installed):\n`),
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
        console.log(
          pc.cyan(`\n${auto.length} file${auto.length > 1 ? 's' : ''} unchanged locally, applying registry update:\n`),
        );
        for (const file of auto) {
          if (options.dryRun) {
            console.log(pc.dim(`  – ${file.label} (dry run, would auto-update — no local changes)`));
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
          pc.cyan(`${pending.length} file${pending.length > 1 ? 's' : ''} differ and were locally modified:\n`),
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

      writeConfig(cwd, { componentPath: config?.componentPath ?? DEFAULT_PATH, installedHashes });

      const parts: string[] = [];
      if (applied > 0) parts.push(pc.green(`${applied} updated`));
      if (skipped > 0) parts.push(pc.dim(`${skipped} skipped`));
      console.log(`${parts.join(', ')}\n`);
    },
  );
