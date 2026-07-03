import { Command } from 'commander';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import ora from 'ora';
import pc from 'picocolors';
import {
  detectPackageManager,
  fetchFile,
  fetchRegistry,
  installCommand,
  type Registry,
  type RegistryComponent,
  type RegistryShared,
} from '../registry.js';
import { getInstalledPackages, isAngularProject, readConfig } from '../utils.js';

function writeFile(dest: string, content: string, force: boolean): 'written' | 'skipped' {
  if (existsSync(dest) && !force) return 'skipped';
  const dir = dirname(dest);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(dest, content, 'utf-8');
  return 'written';
}

export function collectPeerDeps(
  components: RegistryComponent[],
  sharedItems: RegistryShared[],
): Record<string, string> {
  const deps: Record<string, string> = {};
  for (const component of components) {
    Object.assign(deps, component.peerDependencies);
    for (const depName of component.sharedDeps ?? []) {
      const shared = sharedItems.find((s) => s.name === depName);
      if (shared?.peerDependencies) Object.assign(deps, shared.peerDependencies);
    }
  }
  return deps;
}

// Resolves the requested component names plus their transitive `componentDeps`
// into one ordered install list, so e.g. `sanring add select` also pulls in
// `listbox` instead of just printing a notice telling the user to run it again.
export function resolveInstallSet(
  requestedNames: string[],
  registry: Registry,
): { toInstall: RegistryComponent[]; autoAdded: string[]; missing: string[] } {
  const byName = new Map(registry.components.map((c) => [c.name, c]));
  const requestedSet = new Set(requestedNames);
  const seen = new Set<string>();
  const toInstall: RegistryComponent[] = [];
  const autoAdded: string[] = [];
  const missing: string[] = [];
  const queue = [...requestedNames];

  while (queue.length > 0) {
    const name = queue.shift()!;
    if (seen.has(name)) continue;
    seen.add(name);

    const component = byName.get(name);
    if (!component) {
      if (requestedSet.has(name)) missing.push(name);
      continue;
    }

    toInstall.push(component);
    if (!requestedSet.has(name)) autoAdded.push(name);
    for (const dep of component.componentDeps ?? []) {
      if (!seen.has(dep)) queue.push(dep);
    }
  }

  return { toInstall, autoAdded, missing };
}

const DEFAULT_PATH = 'src/app/components/ui';

export const addCommand = new Command('add')
  .description('Add one or more components to your project')
  .argument('<components...>', 'component name(s) (e.g. accordion button)')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('-s, --shared-path <path>', 'destination for shared utilities (default: <path>/shared)')
  .option('-f, --force', 'overwrite existing files', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option('--dry-run', 'preview changes without writing files', false)
  .action(
    async (
      componentNames: string[],
      options: { path?: string; sharedPath?: string; force: boolean; registry?: string; dryRun: boolean },
    ) => {
      const cwd = process.cwd();
      const registrySource = options.registry;

      // Angular project guard
      if (!isAngularProject(cwd)) {
        console.error(pc.red('✖ No angular.json found.'));
        console.error(pc.dim('  Run from the root of an Angular project, or run `sanring init` first.'));
        process.exit(1);
      }

      // Resolve component path: CLI option > sanring.config.json > default
      const config = readConfig(cwd);
      const componentBasePath = resolve(cwd, options.path ?? config?.componentPath ?? DEFAULT_PATH);

      // Fetch registry
      const registrySpinner = ora('Loading registry...').start();
      const registry = await fetchRegistry(registrySource);
      registrySpinner.stop();

      const { toInstall, autoAdded, missing } = resolveInstallSet(componentNames, registry);

      if (missing.length > 0) {
        const available = registry.components.map((c) => c.name).join(', ');
        console.error(
          pc.red(`✖ Component${missing.length > 1 ? 's' : ''} not found: ${missing.join(', ')}`),
        );
        console.error(pc.dim(`  Available: ${available}`));
        process.exit(1);
        return;
      }

      const requestedLabel = componentNames.join(', ');
      const autoLabel =
        autoAdded.length > 0
          ? pc.dim(` (+ ${autoAdded.length} dependency: ${autoAdded.join(', ')})`)
          : '';
      console.log(pc.cyan(`\nAdding ${pc.bold(requestedLabel)}${autoLabel}...\n`));
      if (options.dryRun) {
        console.log(pc.dim('  Dry run — no files will be written.\n'));
      }

      const sharedDestDir = options.sharedPath
        ? resolve(cwd, options.sharedPath)
        : join(componentBasePath, 'shared');

      let written = 0, skipped = 0, failed = 0;

      // Shared utilities — deduped across the whole install set so a dep used
      // by multiple requested components is only fetched/written once.
      const sharedNamesNeeded = new Set<string>();
      for (const component of toInstall) {
        for (const depName of component.sharedDeps ?? []) sharedNamesNeeded.add(depName);
      }

      if (sharedNamesNeeded.size > 0) {
        console.log(pc.dim('  Shared utilities:'));
        for (const depName of sharedNamesNeeded) {
          const shared = registry.shared.find((s) => s.name === depName);
          if (!shared) { console.warn(pc.yellow(`  ⚠ Unknown shared dep "${depName}"`)); continue; }
          const fileName = shared.file.split('/').pop()!;
          const dest = join(sharedDestDir, fileName);

          if (options.dryRun) {
            const exists = existsSync(dest);
            if (exists && !options.force) {
              console.log(pc.dim(`  – shared/${fileName} (exists, would skip)`));
              skipped++;
            } else {
              console.log(pc.cyan(`  + shared/${fileName}${exists ? pc.dim(' (would overwrite)') : ''}`));
              written++;
            }
            continue;
          }

          const spinner = ora({ text: pc.dim(`shared/${fileName}`), prefixText: ' ' }).start();
          try {
            const content = await fetchFile(shared.file, registrySource);
            const result = writeFile(dest, content, options.force);
            if (result === 'written') {
              spinner.stopAndPersist({ symbol: pc.green('✔'), text: `shared/${fileName}` });
              written++;
            } else {
              spinner.stopAndPersist({ symbol: pc.dim('–'), text: pc.dim(`shared/${fileName} (exists, use --force to overwrite)`) });
              skipped++;
            }
          } catch {
            spinner.fail(pc.yellow(`shared/${fileName} (fetch failed)`));
            failed++;
          }
        }
        console.log('');
      }

      // Component files
      for (const component of toInstall) {
        const destDir = join(componentBasePath, component.name);
        const label = autoAdded.includes(component.name)
          ? `${component.name} ${pc.dim('(dependency)')}`
          : component.name;
        console.log(pc.dim(`  ${label}:`));

        for (const file of component.files) {
          const fileName = file.split('/').pop()!;
          const dest = join(destDir, fileName);

          if (options.dryRun) {
            const exists = existsSync(dest);
            if (exists && !options.force) {
              console.log(pc.dim(`  – ${fileName} (exists, would skip)`));
              skipped++;
            } else {
              console.log(pc.cyan(`  + ${fileName}${exists ? pc.dim(' (would overwrite)') : ''}`));
              written++;
            }
            continue;
          }

          const spinner = ora({ text: pc.dim(fileName), prefixText: ' ' }).start();
          try {
            const content = await fetchFile(`components/${file}`, registrySource);
            const result = writeFile(dest, content, options.force);
            if (result === 'written') {
              spinner.stopAndPersist({ symbol: pc.green('✔'), text: fileName });
              written++;
            } else {
              spinner.stopAndPersist({ symbol: pc.dim('–'), text: pc.dim(`${fileName} (exists, use --force to overwrite)`) });
              skipped++;
            }
          } catch {
            spinner.fail(pc.yellow(`${fileName} (fetch failed)`));
            failed++;
          }
        }
        console.log('');
      }

      // Peer dependencies — collected once across the whole install set.
      const allPeerDeps = collectPeerDeps(toInstall, registry.shared);
      if (Object.keys(allPeerDeps).length > 0) {
        const installed = getInstalledPackages(cwd);
        const missingDeps = Object.entries(allPeerDeps).filter(([pkg]) => !installed.has(pkg));
        const already = Object.keys(allPeerDeps).filter((pkg) => installed.has(pkg));

        if (already.length > 0) {
          console.log(pc.dim(`  Already installed: ${already.map((p) => pc.green(p)).join(', ')}`));
        }

        if (missingDeps.length > 0) {
          const pm = detectPackageManager(cwd);
          const pkgs = missingDeps.map(([pkg, ver]) => `${pkg}@${ver}`);
          const cmd = installCommand(pm, pkgs);

          if (options.dryRun) {
            console.log(pc.dim(`  Would install: ${pc.cyan(cmd)}`));
          } else {
            console.log(pc.dim(`  Installing: ${pc.cyan(cmd)}\n`));
            const [bin, ...args] = cmd.split(' ');
            const result = spawnSync(bin, args, { stdio: 'inherit', shell: true });
            if (result.status !== 0) {
              console.warn(pc.yellow(`  ⚠ Install failed. Run manually:\n  ${pc.white(cmd)}`));
            }
          }
        }
        console.log('');
      }

      const parts: string[] = [];
      if (written > 0) parts.push(pc.green(`${written} ${options.dryRun ? 'to add' : 'added'}`));
      if (skipped > 0) parts.push(pc.dim(`${skipped} skipped`));
      if (failed > 0) parts.push(pc.yellow(`${failed} failed`));
      const suffix = options.dryRun ? pc.dim(' (dry run, no files written)') : '';
      console.log(`${pc.bold(requestedLabel)} — ${parts.join(', ')}${suffix}\n`);

      if (skipped > 0 && !options.dryRun) {
        console.log(pc.dim(`  Run with ${pc.white('--force')} to overwrite existing files.\n`));
      }
    },
  );
