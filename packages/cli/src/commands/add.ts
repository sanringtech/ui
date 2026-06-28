import { Command } from 'commander';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import pc from 'picocolors';
import {
  REGISTRY_URL,
  fetchFile,
  fetchRegistry,
  type RegistryComponent,
  type RegistryShared,
} from '../registry.js';

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

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('<component>', 'component name (e.g. accordion)')
  .option('-p, --path <path>', 'destination path relative to cwd', 'src/app/components/ui')
  .option('-s, --shared-path <path>', 'destination for shared utilities (default: <path>/shared)')
  .option('-f, --force', 'overwrite existing files', false)
  .option('--registry <url>', 'custom registry URL')
  .action(
    async (
      componentName: string,
      options: { path: string; sharedPath?: string; force: boolean; registry?: string },
    ) => {
      const registryUrl = options.registry ?? REGISTRY_URL;

      console.log(pc.cyan(`\nAdding ${pc.bold(componentName)}...\n`));

      const registry = await fetchRegistry(registryUrl);
      const component = registry.components.find((c) => c.name === componentName);

      if (!component) {
        const available = registry.components.map((c) => c.name).join(', ');
        console.error(pc.red(`✖ Component "${componentName}" not found.`));
        console.error(pc.dim(`  Available: ${available}`));
        process.exit(1);
        return;
      }

      const componentBasePath = resolve(process.cwd(), options.path);
      const destDir = join(componentBasePath, componentName);
      const sharedDestDir = options.sharedPath
        ? resolve(process.cwd(), options.sharedPath)
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
          try {
            const content = await fetchFile(shared.file, registryUrl);
            const result = writeFile(dest, content, options.force);
            if (result === 'written') { console.log(pc.green(`  ✔ shared/${fileName}`)); written++; }
            else { console.log(pc.dim(`  – shared/${fileName} (exists, use --force to overwrite)`)); skipped++; }
          } catch (e) {
            console.warn(pc.yellow(`  ⚠ shared/${fileName} (fetch failed)`));
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
        try {
          const content = await fetchFile(`components/${file}`, registryUrl);
          const result = writeFile(dest, content, options.force);
          if (result === 'written') { console.log(pc.green(`  ✔ ${fileName}`)); written++; }
          else { console.log(pc.dim(`  – ${fileName} (exists, use --force to overwrite)`)); skipped++; }
        } catch (e) {
          console.warn(pc.yellow(`  ⚠ ${fileName} (fetch failed)`));
          failed++;
        }
      }

      // Peer dependencies
      const allPeerDeps = collectPeerDeps(component, registry.shared);
      if (Object.keys(allPeerDeps).length > 0) {
        const deps = Object.entries(allPeerDeps)
          .map(([pkg, ver]) => `${pkg}@"${ver}"`)
          .join(' ');
        console.log(pc.dim(`\n  Peer dependencies:\n  ${pc.cyan(`npm install ${deps}`)}`));
      }

      // Component dependencies notice
      if (component.componentDeps && component.componentDeps.length > 0) {
        console.log(pc.yellow(`\n  Also install: ${component.componentDeps.map(d => pc.white(`sanring add ${d}`)).join(', ')}`));
      }

      const parts: string[] = [];
      if (written > 0) parts.push(pc.green(`${written} added`));
      if (skipped > 0) parts.push(pc.dim(`${skipped} skipped`));
      if (failed > 0) parts.push(pc.yellow(`${failed} failed`));
      console.log(`\n${pc.bold(componentName)} — ${parts.join(', ')}\n`);

      if (skipped > 0) {
        console.log(pc.dim(`  Run with ${pc.white('--force')} to overwrite existing files.\n`));
      }
    },
  );
