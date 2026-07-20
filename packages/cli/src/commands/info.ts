import { Command } from 'commander';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import pc from 'picocolors';
import { collectPeerDeps, resolveInstallSet } from './add.js';
import { fetchRegistry } from '../registry.js';
import { isAngularProject, readConfig } from '../utils.js';
import { THEME_FILE_PATH } from './init.js';

const DEFAULT_PATH = 'src/app/components/ui';
const __dirname = dirname(fileURLToPath(import.meta.url));

function getCliVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8')) as { version: string };
    return pkg.version;
  } catch {
    return 'unknown';
  }
}

function getAngularVersion(cwd: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return pkg.dependencies?.['@angular/core'] ?? pkg.devDependencies?.['@angular/core'] ?? null;
  } catch {
    return null;
  }
}

function scanInstalledComponents(componentBasePath: string): string[] {
  if (!existsSync(componentBasePath)) return [];
  return readdirSync(componentBasePath, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'shared')
    .map((e) => e.name)
    .sort();
}

export const infoCommand = new Command('info')
  .description('Show project info, or details for a specific component')
  .argument('[component]', 'component name — omit to show project info')
  .option('-p, --path <path>', 'component path relative to cwd')
  .option('--json', 'output as JSON (useful for CI and coding agents)', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(async (componentName: string | undefined, options: { path?: string; json: boolean; registry?: string }) => {
    const cwd = process.cwd();

    // ── Project info mode (no component argument) ─────────────────────────
    if (!componentName) {
      const isAngular = isAngularProject(cwd);
      const config = readConfig(cwd);
      const componentBasePath = resolve(cwd, options.path ?? config?.componentPath ?? DEFAULT_PATH);
      const themePresent = existsSync(join(cwd, THEME_FILE_PATH));
      const installed = scanInstalledComponents(componentBasePath);
      const angularVersion = getAngularVersion(cwd);
      const cliVersion = getCliVersion();

      if (options.json) {
        process.stdout.write(JSON.stringify({
          cli: cliVersion,
          angular: isAngular ? (angularVersion ?? true) : false,
          config: config ? { path: 'sanring.config.json', componentPath: config.componentPath } : null,
          theme: { path: THEME_FILE_PATH, present: themePresent },
          installed,
        }, null, 2) + '\n');
        return;
      }

      console.log(pc.cyan('\nSanring UI — project info\n'));
      console.log(`  CLI        ${pc.bold(cliVersion)}`);

      const angularLine = isAngular
        ? `${pc.green('✔')}${angularVersion ? pc.dim(` (${angularVersion})`) : ''}`
        : pc.red('✖ no angular.json found');
      console.log(`  Angular    ${angularLine}`);

      if (config) {
        console.log(`  Config     ${pc.dim('sanring.config.json')}`);
        console.log(`               componentPath  ${pc.bold(config.componentPath)}`);
      } else {
        console.log(`  Config     ${pc.yellow('⚠ not initialized — run `sanring init`')}`);
      }

      console.log(`  Theme      ${pc.dim(THEME_FILE_PATH)} ${themePresent ? pc.green('(present)') : pc.yellow('(not found)')}`);

      if (installed.length > 0) {
        console.log(`\n  Installed ${pc.dim(`(${installed.length}):`)}  ${installed.map((n) => pc.bold(n)).join('  ')}\n`);
        console.log(pc.dim(`  Run ${pc.white('sanring diff')} to check for updates.`));
        console.log(pc.dim(`  Run ${pc.white('sanring add <component>')} to add more.\n`));
      } else {
        console.log(pc.dim(`\n  No components installed yet. Run ${pc.white('sanring add <component>')} to get started.\n`));
      }
      return;
    }

    // ── Component info mode ───────────────────────────────────────────────
    const registrySpinner = ora('Loading registry...').start();
    const registry = await fetchRegistry(options.registry);
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
    const config = readConfig(cwd);
    const componentBasePath = resolve(cwd, options.path ?? config?.componentPath ?? DEFAULT_PATH);
    const alreadyInstalled = isAngularProject(cwd) && existsSync(join(componentBasePath, component.name));
    const peerDeps = collectPeerDeps(toInstall, registry.shared);

    if (options.json) {
      process.stdout.write(JSON.stringify({
        name: component.name,
        description: component.description,
        installed: alreadyInstalled,
        files: component.files,
        componentDeps: component.componentDeps ?? [],
        sharedDeps: component.sharedDeps ?? [],
        peerDependencies: peerDeps,
        autoAdded,
      }, null, 2) + '\n');
      return;
    }

    console.log(`\n${pc.bold(component.name)} ${pc.dim('—')} ${component.description}\n`);

    if (isAngularProject(cwd)) {
      console.log(alreadyInstalled ? pc.green('✔ Already installed') : pc.dim('Not installed'));
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

    if (Object.keys(peerDeps).length > 0) {
      console.log(pc.dim('\nPeer dependencies:'));
      for (const [pkg, ver] of Object.entries(peerDeps)) {
        console.log(`  ${pkg}@${ver}`);
      }
    }

    console.log(pc.dim(`\nRun ${pc.white(`sanring add ${componentName}`)} to install.\n`));
  });
