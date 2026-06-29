import { Command } from 'commander';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import pc from 'picocolors';
import { detectPackageManager, installCommand } from '../registry.js';
import {
  CONFIG_FILE,
  getInstalledPackages,
  isAngularProject,
  readConfig,
  writeConfig,
} from '../utils.js';

const DEFAULT_COMPONENT_PATH = 'src/app/components/ui';
const BASE_DEPS: Record<string, string> = {
  clsx: '^2.0.0',
  'tailwind-merge': '^3.0.0',
};

export const initCommand = new Command('init')
  .description('Initialize Sanring UI in your Angular project')
  .option('-p, --path <path>', 'component destination path', DEFAULT_COMPONENT_PATH)
  .option('-y, --yes', 'accept all defaults without prompting', false)
  .action(async (options: { path: string; yes: boolean }) => {
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

    // 5. Install base deps if missing
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

    console.log(pc.cyan(`\nDone! Run ${pc.bold('sanring add <component>')} to add components.\n`));
  });
