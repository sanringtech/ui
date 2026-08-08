import { Command } from 'commander';
import ora from 'ora';
import pc from 'picocolors';
import { createRegistryGroups, fetchRegistry, type RegistryComponent } from '../registry.js';
import { readConfig, requireAngularProject, resolveComponentBasePath } from '../utils.js';
import { listInstalledComponentNames } from './diff.js';

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
      requireAngularProject(process.cwd());
      const config = readConfig(process.cwd());
      const componentBasePath = resolveComponentBasePath(process.cwd(), options.path, config);
      const installedNames = new Set(listInstalledComponentNames(componentBasePath, registry));
      components = components.filter((c) => installedNames.has(c.name));
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
