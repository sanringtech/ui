import { Command } from 'commander';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import pc from 'picocolors';

interface RegistryShared {
  name: string;
  description: string;
  file: string;
  peerDependencies?: Record<string, string>;
}

interface RegistryComponent {
  name: string;
  description: string;
  sharedDeps?: string[];
  peerDependencies?: Record<string, string>;
  files: string[];
}

interface Registry {
  name: string;
  shared: RegistryShared[];
  components: RegistryComponent[];
}

function loadRegistry(registryPath: string): Registry {
  try {
    return JSON.parse(readFileSync(registryPath, 'utf-8')) as Registry;
  } catch (e) {
    console.error(pc.red(`✖ Cannot read registry: ${registryPath}`));
    process.exit(1);
  }
}

function copyFile(src: string, dest: string, force: boolean): 'copied' | 'skipped' | 'missing' {
  if (!existsSync(src)) return 'missing';
  if (existsSync(dest) && !force) return 'skipped';
  const dir = dirname(dest);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(dest, readFileSync(src));
  return 'copied';
}

function collectPeerDeps(
  component: RegistryComponent,
  sharedItems: RegistryShared[],
): Record<string, string> {
  const deps: Record<string, string> = { ...component.peerDependencies };
  for (const depName of component.sharedDeps ?? []) {
    const shared = sharedItems.find((s) => s.name === depName);
    if (shared?.peerDependencies) {
      Object.assign(deps, shared.peerDependencies);
    }
  }
  return deps;
}

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('<component>', 'component name (e.g. accordion)')
  .option('-p, --path <path>', 'destination path relative to cwd', 'src/app/components/ui')
  .option('-s, --shared-path <path>', 'destination for shared utilities (default: <path>/shared)')
  .option('-f, --force', 'overwrite existing files', false)
  .option('--registry <path>', 'path to local registry.json (for development)')
  .action(
    async (
      componentName: string,
      options: { path: string; sharedPath?: string; force: boolean; registry?: string },
    ) => {
      console.log(pc.cyan(`\nAdding ${pc.bold(componentName)}...\n`));

      const selfDir = new URL('.', import.meta.url).pathname;
      // dist/commands/ → ../../registry/registry.json (works in both dev and published installs)
      const registryPath = options.registry
        ? resolve(process.cwd(), options.registry)
        : join(selfDir, '../../registry/registry.json');

      const registry = loadRegistry(registryPath);
      const registryDir = dirname(registryPath);

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
      // shared-path: explicit override OR sibling `shared/` next to the component base
      const sharedDestDir = options.sharedPath
        ? resolve(process.cwd(), options.sharedPath)
        : join(componentBasePath, 'shared');

      let copied = 0, skipped = 0, missing = 0;

      // Install shared dependencies first
      if (component.sharedDeps && component.sharedDeps.length > 0) {
        console.log(pc.dim('  Shared utilities:'));
        for (const depName of component.sharedDeps) {
          const shared = registry.shared.find((s) => s.name === depName);
          if (!shared) {
            console.warn(pc.yellow(`  ⚠ Unknown shared dep "${depName}", skipping`));
            continue;
          }
          const srcFile = join(registryDir, shared.file);
          const fileName = shared.file.split('/').pop()!;
          const destFile = join(sharedDestDir, fileName);
          const result = copyFile(srcFile, destFile, options.force);

          if (result === 'copied') {
            console.log(pc.green(`  ✔ shared/${fileName}`));
            copied++;
          } else if (result === 'skipped') {
            console.log(pc.dim(`  – shared/${fileName} (exists, use --force to overwrite)`));
            skipped++;
          } else {
            console.warn(pc.yellow(`  ⚠ shared/${fileName} (source not found)`));
            missing++;
          }
        }
        console.log('');
      }

      // Install component files
      console.log(pc.dim('  Component files:'));
      for (const file of component.files) {
        const fileName = file.split('/').pop()!;
        const srcFile = join(registryDir, 'components', file);
        const destFile = join(destDir, fileName);
        const result = copyFile(srcFile, destFile, options.force);

        if (result === 'copied') {
          console.log(pc.green(`  ✔ ${fileName}`));
          copied++;
        } else if (result === 'skipped') {
          console.log(pc.dim(`  – ${fileName} (exists, use --force to overwrite)`));
          skipped++;
        } else {
          console.warn(pc.yellow(`  ⚠ ${fileName} (source not found)`));
          missing++;
        }
      }

      // Peer dependency summary
      const allPeerDeps = collectPeerDeps(component, registry.shared);
      if (Object.keys(allPeerDeps).length > 0) {
        const deps = Object.entries(allPeerDeps)
          .map(([pkg, ver]) => `${pkg}@"${ver}"`)
          .join(' ');
        console.log(pc.dim(`\n  Peer dependencies:\n  ${pc.cyan(`npm install ${deps}`)}`));
      }

      // Summary line
      const parts: string[] = [];
      if (copied > 0) parts.push(pc.green(`${copied} added`));
      if (skipped > 0) parts.push(pc.dim(`${skipped} skipped`));
      if (missing > 0) parts.push(pc.yellow(`${missing} missing`));

      console.log(`\n${pc.bold(componentName)} — ${parts.join(', ')}\n`);

      if (skipped > 0) {
        console.log(pc.dim(`  Run with ${pc.white('--force')} to overwrite existing files.\n`));
      }
    },
  );
