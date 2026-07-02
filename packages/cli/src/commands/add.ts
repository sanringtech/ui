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

function collectPeerDeps(
  component: RegistryComponent,
  sharedItems: RegistryShared[],
): Record<string, string> {
  const deps: Record<string, string> = { ...component.peerDependencies };
  for (const depName of component.sharedDeps ?? []) {
    const shared = sharedItems.find((s) => s.name === depName);
    if (shared?.peerDependencies) Object.assign(deps, shared.peerDependencies);
  }
  return deps;
}

const DEFAULT_PATH = 'src/app/components/ui';

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('<component>', 'component name (e.g. accordion)')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('-s, --shared-path <path>', 'destination for shared utilities (default: <path>/shared)')
  .option('-f, --force', 'overwrite existing files', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option('--dry-run', 'preview changes without writing files', false)
  .action(
    async (
      componentName: string,
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

      console.log(pc.cyan(`\nAdding ${pc.bold(componentName)}...\n`));
      if (options.dryRun) {
        console.log(pc.dim('  Dry run — no files will be written.\n'));
      }

      // Fetch registry
      const registrySpinner = ora('Loading registry...').start();
      const registry = await fetchRegistry(registrySource);
      registrySpinner.stop();

      const component = registry.components.find((c) => c.name === componentName);

      if (!component) {
        const available = registry.components.map((c) => c.name).join(', ');
        console.error(pc.red(`✖ Component "${componentName}" not found.`));
        console.error(pc.dim(`  Available: ${available}`));
        process.exit(1);
        return;
      }

      const destDir = join(componentBasePath, componentName);
      const sharedDestDir = options.sharedPath
        ? resolve(cwd, options.sharedPath)
        : join(componentBasePath, 'shared');

      let written = 0, skipped = 0, failed = 0;

      // Shared utilities
      if (component.sharedDeps && component.sharedDeps.length > 0) {
        console.log(pc.dim('  Shared utilities:'));
        for (const depName of component.sharedDeps) {
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
      console.log(pc.dim('  Component files:'));
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

      // Peer dependencies
      const allPeerDeps = collectPeerDeps(component, registry.shared);
      if (Object.keys(allPeerDeps).length > 0) {
        const installed = getInstalledPackages(cwd);
        const missing = Object.entries(allPeerDeps).filter(([pkg]) => !installed.has(pkg));
        const already = Object.keys(allPeerDeps).filter((pkg) => installed.has(pkg));

        console.log('');
        if (already.length > 0) {
          console.log(pc.dim(`  Already installed: ${already.map((p) => pc.green(p)).join(', ')}`));
        }

        if (missing.length > 0) {
          const pm = detectPackageManager(cwd);
          const pkgs = missing.map(([pkg, ver]) => `${pkg}@${ver}`);
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
      }

      // Component dependencies notice
      if (component.componentDeps && component.componentDeps.length > 0) {
        console.log(pc.yellow(`\n  Also install: ${component.componentDeps.map(d => pc.white(`sanring add ${d}`)).join(', ')}`));
      }

      const parts: string[] = [];
      if (written > 0) parts.push(pc.green(`${written} ${options.dryRun ? 'to add' : 'added'}`));
      if (skipped > 0) parts.push(pc.dim(`${skipped} skipped`));
      if (failed > 0) parts.push(pc.yellow(`${failed} failed`));
      const suffix = options.dryRun ? pc.dim(' (dry run, no files written)') : '';
      console.log(`\n${pc.bold(componentName)} — ${parts.join(', ')}${suffix}\n`);

      if (skipped > 0 && !options.dryRun) {
        console.log(pc.dim(`  Run with ${pc.white('--force')} to overwrite existing files.\n`));
      }
    },
  );
