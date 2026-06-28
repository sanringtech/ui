import { Command } from 'commander';
import pc from 'picocolors';
import { REGISTRY_URL, fetchRegistry } from '../registry.js';

export const listCommand = new Command('list')
  .alias('ls')
  .description('List all available components')
  .option('--registry <url>', 'custom registry URL')
  .action(async (options: { registry?: string }) => {
    const registryUrl = options.registry ?? REGISTRY_URL;
    const registry = await fetchRegistry(registryUrl);
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
