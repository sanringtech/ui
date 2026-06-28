import { Command } from 'commander';
import { resolve } from 'node:path';
import pc from 'picocolors';
import { getDefaultRegistryPath, loadRegistry } from '../registry.js';

export const listCommand = new Command('list')
  .alias('ls')
  .description('List all available components')
  .option('--registry <path>', 'path to local registry.json (for development)')
  .action((options: { registry?: string }) => {
    const registryPath = options.registry
      ? resolve(process.cwd(), options.registry)
      : getDefaultRegistryPath(import.meta.url);

    const registry = loadRegistry(registryPath);
    const { components } = registry;

    console.log(pc.cyan(`\nAvailable components`) + pc.dim(` (${components.length} total)\n`));

    const nameWidth = Math.max(...components.map((c) => c.name.length), 4);

    for (const c of components) {
      const name = pc.bold(c.name.padEnd(nameWidth));
      const deps = c.peerDependencies ? Object.keys(c.peerDependencies).join(', ') : '';
      const depsStr = deps ? pc.dim(`  [${deps}]`) : '';
      console.log(`  ${name}  ${c.description}${depsStr}`);
    }

    console.log(pc.dim(`\n  Run ${pc.white('sanring add <component>')} to install.\n`));
  });
