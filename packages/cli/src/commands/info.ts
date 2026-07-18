import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ora from 'ora';
import pc from 'picocolors';
import { collectPeerDeps, resolveInstallSet } from './add.js';
import { fetchRegistry } from '../registry.js';
import { isAngularProject, readConfig } from '../utils.js';

const DEFAULT_PATH = 'src/app/components/ui';

export const infoCommand = new Command('info')
  .description('Show what a component installs without actually installing it')
  .argument('<component>', 'component name')
  .option('-p, --path <path>', 'destination path relative to cwd (used to check if already installed)')
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(async (componentName: string, options: { path?: string; registry?: string }) => {
    const cwd = process.cwd();
    const registrySource = options.registry;

    const registrySpinner = ora('Loading registry...').start();
    const registry = await fetchRegistry(registrySource);
    registrySpinner.stop();

    const { toInstall, autoAdded, missing } = resolveInstallSet([componentName], registry);

    if (missing.length > 0) {
      const available = registry.components.map((c) => c.name).join(', ');
      console.error(pc.red(`✖ Component not found: ${componentName}`));
      console.error(pc.dim(`  Available: ${available}`));
      process.exit(1);
      return;
    }

    const component = toInstall.find((c) => c.name === componentName)!;
    console.log(`\n${pc.bold(component.name)} ${pc.dim('—')} ${component.description}\n`);

    if (isAngularProject(cwd)) {
      const config = readConfig(cwd);
      const componentBasePath = resolve(cwd, options.path ?? config?.componentPath ?? DEFAULT_PATH);
      const installed = existsSync(join(componentBasePath, component.name));
      console.log(installed ? pc.green('✔ Already installed') : pc.dim('Not installed'));
      console.log('');
    }

    if (autoAdded.length > 0) {
      console.log(pc.dim(`Also installs (dependency): ${pc.white(autoAdded.join(', '))}\n`));
    }

    console.log(pc.dim('Files:'));
    for (const c of toInstall) {
      const label = autoAdded.includes(c.name) ? `${c.name} ${pc.dim('(dependency)')}` : c.name;
      console.log(`  ${label}`);
      for (const file of c.files) {
        console.log(pc.dim(`    ${file.split('/').pop()}`));
      }
    }

    const peerDeps = collectPeerDeps(toInstall, registry.shared);
    if (Object.keys(peerDeps).length > 0) {
      console.log(pc.dim('\nPeer dependencies:'));
      for (const [pkg, ver] of Object.entries(peerDeps)) {
        console.log(`  ${pkg}@${ver}`);
      }
    }

    console.log(pc.dim(`\nRun ${pc.white(`sanring add ${componentName}`)} to install.\n`));
  });
