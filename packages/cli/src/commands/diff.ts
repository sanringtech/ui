import { Command } from 'commander';
import { diffLines } from 'diff';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pc from 'picocolors';
import { fetchFile, fetchRegistry, type Registry, type RegistryComponent } from '../registry.js';
import { isAngularProject, readConfig } from '../utils.js';
import { THEME_FILE_PATH } from './init.js';

const DEFAULT_PATH = 'src/app/components/ui';

// Sanring UI has no version concept — components are copied source, not npm
// packages — so "up to date" only ever means "identical to what's in the
// registry right now." This command exists to make drift *visible* before
// `add --force` would otherwise silently clobber local customizations.

export function listInstalledComponentNames(
  componentBasePath: string,
  registry: Registry,
): string[] {
  if (!existsSync(componentBasePath)) return [];
  const known = new Set(registry.components.map((c) => c.name));
  return readdirSync(componentBasePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && known.has(entry.name))
    .map((entry) => entry.name);
}

export function resolveDiffTargets(
  requestedNames: string[],
  componentBasePath: string,
  registry: Registry,
): { components: RegistryComponent[]; missing: string[]; notInstalled: string[] } {
  const byName = new Map(registry.components.map((c) => [c.name, c]));
  const names = requestedNames.length > 0
    ? requestedNames
    : listInstalledComponentNames(componentBasePath, registry);

  const components: RegistryComponent[] = [];
  const missing: string[] = [];
  const notInstalled: string[] = [];

  for (const name of names) {
    const component = byName.get(name);
    if (!component) {
      missing.push(name);
      continue;
    }
    if (!existsSync(join(componentBasePath, name))) {
      notInstalled.push(name);
      continue;
    }
    components.push(component);
  }

  return { components, missing, notInstalled };
}

export function printFileDiff(label: string, local: string, remote: string): boolean {
  if (local === remote) {
    console.log(pc.dim(`  ✔ ${label} (up to date)`));
    return false;
  }

  console.log(pc.yellow(`  ● ${label}`));
  for (const part of diffLines(local, remote)) {
    const color = part.added ? pc.green : part.removed ? pc.red : pc.dim;
    const prefix = part.added ? '+' : part.removed ? '-' : ' ';
    const text = part.value.endsWith('\n') ? part.value.slice(0, -1) : part.value;
    for (const line of text.split('\n')) {
      console.log(color(`    ${prefix} ${line}`));
    }
  }
  return true;
}

export const diffCommand = new Command('diff')
  .description(
    'Compare installed component/theme files against the current registry (no components = diff everything installed)',
  )
  .argument('[components...]', 'component name(s) to check; omit to check everything installed')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(async (componentNames: string[], options: { path?: string; registry?: string }) => {
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
      console.log(
        pc.dim(`  Not installed, skipping: ${notInstalled.join(', ')} (run ${pc.white('sanring add')} first)`),
      );
    }

    let changed = 0, checked = 0;

    // Theme file — written by `init`, not tied to any component's sharedDeps,
    // but the thing most likely to have been hand-edited for a brand.
    const themeDest = join(cwd, THEME_FILE_PATH);
    const themeShared = registry.shared.find((s) => s.name === 'theme');
    if (themeShared && existsSync(themeDest)) {
      try {
        const remote = await fetchFile(themeShared.file, registrySource);
        const local = readFileSync(themeDest, 'utf-8');
        checked++;
        if (printFileDiff(THEME_FILE_PATH, local, remote)) changed++;
      } catch (e) {
        console.warn(pc.yellow(`  ⚠ Could not fetch ${themeShared.file}: ${e instanceof Error ? e.message : e}`));
      }
    }

    // Shared utility deps referenced by the components being diffed.
    const sharedNamesNeeded = new Set<string>();
    for (const component of components) {
      for (const depName of component.sharedDeps ?? []) sharedNamesNeeded.add(depName);
    }
    for (const depName of sharedNamesNeeded) {
      const shared = registry.shared.find((s) => s.name === depName);
      if (!shared) continue;
      const fileName = shared.file.split('/').pop()!;
      const dest = join(sharedDestDir, fileName);
      if (!existsSync(dest)) continue;
      try {
        const remote = await fetchFile(shared.file, registrySource);
        const local = readFileSync(dest, 'utf-8');
        checked++;
        if (printFileDiff(`shared/${fileName}`, local, remote)) changed++;
      } catch (e) {
        console.warn(pc.yellow(`  ⚠ Could not fetch ${shared.file}: ${e instanceof Error ? e.message : e}`));
      }
    }

    for (const component of components) {
      const destDir = join(componentBasePath, component.name);
      for (const file of component.files) {
        const fileName = file.split('/').pop()!;
        const dest = join(destDir, fileName);
        if (!existsSync(dest)) continue;
        try {
          const remote = await fetchFile(`components/${file}`, registrySource);
          const local = readFileSync(dest, 'utf-8');
          checked++;
          if (printFileDiff(`${component.name}/${fileName}`, local, remote)) changed++;
        } catch (e) {
          console.warn(pc.yellow(`  ⚠ Could not fetch ${file}: ${e instanceof Error ? e.message : e}`));
        }
      }
    }

    if (checked === 0) {
      console.log(pc.dim('\n  Nothing to compare — no installed files found.\n'));
      return;
    }

    console.log('');
    if (changed === 0) {
      console.log(pc.green(`✔ All ${checked} file${checked > 1 ? 's' : ''} match the registry.\n`));
    } else {
      console.log(
        pc.yellow(`● ${changed} of ${checked} file${checked > 1 ? 's' : ''} differ from the registry.`) +
          pc.dim(' Review before running `sanring add --force`.\n'),
      );
    }
  });
