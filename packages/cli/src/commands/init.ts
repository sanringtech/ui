import { Command } from 'commander';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import pc from 'picocolors';
import { detectPackageManager, fetchFile, installCommand } from '../registry.js';
import {
  CONFIG_FILE,
  getInstalledPackages,
  isAngularProject,
  readConfig,
  writeConfig,
} from '../utils.js';
import { writeFile } from './add.js';

const DEFAULT_COMPONENT_PATH = 'src/app/components/ui';
export const THEME_FILE_PATH = 'src/sanring-theme.css';
const BASE_DEPS: Record<string, string> = {
  clsx: '^2.0.0',
  'tailwind-merge': '^3.0.0',
};

export const initCommand = new Command('init')
  .description('Initialize Sanring UI in your Angular project')
  .option('-p, --path <path>', 'component destination path', DEFAULT_COMPONENT_PATH)
  .option('-y, --yes', 'accept all defaults without prompting', false)
  .option('-f, --force', 'overwrite an existing theme file', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(async (options: { path: string; yes: boolean; force: boolean; registry?: string }) => {
    const cwd = process.cwd();

    console.log(pc.cyan(`\nSanring UI — init\n`));

    // 1. Verify Angular project
    if (!isAngularProject(cwd)) {
      console.error(pc.red('✖ No angular.json found.'));
      console.error(pc.dim('  Run this command from the root of an Angular project.'));
      process.exit(1);
    }
    console.log(pc.green('✔') + pc.dim(' Angular project detected'));

    // 2. Warn if already initialised
    const existing = readConfig(cwd);
    if (existing) {
      console.log(pc.yellow('⚠') + pc.dim(` ${CONFIG_FILE} already exists (componentPath: ${existing.componentPath})`));
      console.log(pc.dim('  Re-running init will overwrite it.\n'));
    }

    // 3. Resolve component path
    let componentPath = options.path;
    if (!options.yes && options.path === DEFAULT_COMPONENT_PATH) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      const answer = await rl.question(
        pc.dim(`\n  Component path`) + ` [${DEFAULT_COMPONENT_PATH}]: `,
      );
      rl.close();
      if (answer.trim()) componentPath = answer.trim();
    }

    // 4. Write config
    writeConfig(cwd, { componentPath });
    console.log(pc.green('\n✔') + ` ${CONFIG_FILE} written` + pc.dim(` (componentPath: ${componentPath})`));

    // 5. Write the design-token stylesheet every component reads (--sanring-*).
    // Skipped if it already exists (protects any brand-color edits) unless --force.
    const themeDest = join(cwd, THEME_FILE_PATH);
    try {
      const themeContent = await fetchFile('shared/theme.css', options.registry);
      const themeResult = writeFile(themeDest, themeContent, options.force);
      if (themeResult === 'written') {
        console.log(pc.green('✔') + ` ${THEME_FILE_PATH} written`);
      } else {
        console.log(
          pc.dim(`–  ${THEME_FILE_PATH} already exists, use --force to reset it to defaults`),
        );
      }
    } catch (e) {
      console.warn(pc.yellow(`⚠ Could not fetch shared/theme.css: ${e instanceof Error ? e.message : e}`));
    }

    // 6. Install base deps if missing
    const installed = getInstalledPackages(cwd);
    const missing = Object.entries(BASE_DEPS).filter(([pkg]) => !installed.has(pkg));

    if (missing.length === 0) {
      console.log(pc.green('✔') + pc.dim(' Base dependencies already installed'));
    } else {
      const pm = detectPackageManager(cwd);
      const pkgs = missing.map(([pkg, ver]) => `${pkg}@${ver}`);
      const cmd = installCommand(pm, pkgs);
      console.log(pc.dim(`\n  Installing base dependencies: ${pc.cyan(cmd)}\n`));
      const [bin, ...args] = cmd.split(' ');
      const result = spawnSync(bin, args, { stdio: 'inherit', shell: true });
      if (result.status !== 0) {
        console.warn(pc.yellow(`\n  ⚠ Install failed. Run manually:\n  ${pc.white(cmd)}`));
      } else {
        console.log(pc.green('\n✔') + ' Base dependencies installed');
      }
    }

    console.log(
      pc.cyan(`\nAdd this to your global stylesheet (e.g. src/styles.css):\n`) +
        pc.white(`  @import './sanring-theme.css';\n`),
    );
    console.log(pc.dim(`  Customizing colors? See https://ui.sanring.dev/theming\n`));
    console.log(pc.cyan(`Done! Run ${pc.bold('sanring add <component>')} to add components.\n`));
  });
