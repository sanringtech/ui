import { Command } from 'commander';
import { resolve } from 'node:path';
import ora from 'ora';
import pc from 'picocolors';
import { fetchRegistry } from '../registry.js';
import { isAngularProject, readConfig } from '../utils.js';
import { listInstalledComponentNames } from './diff.js';

const DEFAULT_PATH = 'src/app/components/ui';

export const listCommand = new Command('list')
  .alias('ls')
  .description('List available components')
  .option('-i, --installed', 'show only installed components', false)
  .option('-p, --path <path>', 'component path relative to cwd (used with --installed)')
  .option('--registry <url>', 'custom registry URL')
  .action(async (options: { installed: boolean; path?: string; registry?: string }) => {
    const spinner = ora('Loading components...').start();
    const registry = await fetchRegistry(options.registry);
    spinner.stop();

    let { components } = registry;

    if (options.installed) {
      if (!isAngularProject(process.cwd())) {
        console.error(pc.red('✖ No angular.json found.'));
        console.error(pc.dim('  Run from the root of an Angular project.'));
        process.exit(1);
      }
      const config = readConfig(process.cwd());
      const componentBasePath = resolve(process.cwd(), options.path ?? config?.componentPath ?? DEFAULT_PATH);
      const installedNames = new Set(listInstalledComponentNames(componentBasePath, registry));
      components = components.filter((c) => installedNames.has(c.name));
    }

    const title = options.installed ? 'Installed components' : 'Available components';
    console.log(pc.cyan(`\n${title}`) + pc.dim(` (${components.length}${options.installed ? '' : ' total'})\n`));

    if (components.length === 0) {
      console.log(pc.dim('  None installed yet. Run `sanring add <component>` to get started.\n'));
      return;
    }

    const nameWidth = Math.max(...components.map((c) => c.name.length), 4);
    for (const c of components) {
      const name = pc.bold(c.name.padEnd(nameWidth));
      const deps = c.peerDependencies ? Object.keys(c.peerDependencies).join(', ') : '';
      const depsStr = deps ? pc.dim(`  [${deps}]`) : '';
      console.log(`  ${name}  ${c.description}${depsStr}`);
    }

    if (options.installed) {
      console.log(pc.dim(`\n  Run ${pc.white('sanring diff')} to check for updates.\n`));
    } else {
      console.log(pc.dim(`\n  Run ${pc.white('sanring add <component>')} to install.\n`));
    }
  });
