import { Command } from 'commander';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { createInterface } from 'node:readline/promises';
import pc from 'picocolors';
import {
  detectPackageManager,
  fetchFile,
  installCommand,
  installCommandParts,
} from '../registry.js';
import {
  CONFIG_FILE,
  getInstalledPackages,
  hashContent,
  isAngularProject,
  readConfig,
  writeConfig,
} from '../utils.js';
import { writeFile } from './add.js';

const DEFAULT_COMPONENT_PATH = 'src/app/components/ui';
export const THEME_FILE_PATH = 'src/sanring-theme.css';
const DEFAULT_GLOBAL_STYLESHEET_PATH = 'src/styles.css';
const BASE_DEPS: Record<string, string> = {
  clsx: '^2.0.0',
  'tailwind-merge': '^3.0.0',
};
const CLI_RUNNER = 'npx @sanring/cli@latest';

function findGlobalStylesheet(cwd: string): string | null {
  try {
    const angularJson = JSON.parse(readFileSync(join(cwd, 'angular.json'), 'utf-8')) as {
      projects?: Record<
        string,
        {
          architect?: {
            build?: {
              options?: {
                styles?: Array<string | { input?: string }>;
              };
            };
          };
        }
      >;
    };

    for (const project of Object.values(angularJson.projects ?? {})) {
      for (const entry of project.architect?.build?.options?.styles ?? []) {
        const stylePath = typeof entry === 'string' ? entry : entry.input;
        if (stylePath?.endsWith('.css')) return stylePath;
      }
    }
  } catch {
    // Best-effort hint only.
  }

  return existsSync(join(cwd, 'src/styles.css')) ? 'src/styles.css' : null;
}

function importPathForStylesheet(stylesheetPath: string): string {
  const importPath = relative(dirname(stylesheetPath), THEME_FILE_PATH).split(sep).join('/');
  return importPath.startsWith('.') ? importPath : `./${importPath}`;
}

function ensureThemeImport(cwd: string, stylesheetPath: string, importPath: string) {
  const absoluteStylesheetPath = join(cwd, stylesheetPath);
  if (!existsSync(absoluteStylesheetPath)) return 'missing-stylesheet' as const;

  const current = readFileSync(absoluteStylesheetPath, 'utf-8');
  if (current.includes('sanring-theme.css')) return 'already-present' as const;

  const importLine = `@import '${importPath}';`;
  const next = current.trim().length > 0 ? `${importLine}\n\n${current}` : `${importLine}\n`;
  writeFileSync(absoluteStylesheetPath, next, 'utf-8');
  return 'added' as const;
}

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
      console.log(
        pc.yellow('⚠') +
          pc.dim(` ${CONFIG_FILE} already exists (componentPath: ${existing.componentPath})`),
      );
      console.log(pc.dim('  Re-running init will overwrite it.\n'));
    }

    // 3. Resolve component path
    const defaultComponentPath =
      options.path === DEFAULT_COMPONENT_PATH
        ? (existing?.componentPath ?? DEFAULT_COMPONENT_PATH)
        : options.path;
    let componentPath = defaultComponentPath;
    if (!options.yes && options.path === DEFAULT_COMPONENT_PATH) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      const answer = await rl.question(
        pc.dim(`\n  Component path relative to project root`) + ` [${defaultComponentPath}]: `,
      );
      rl.close();
      if (answer.trim()) componentPath = answer.trim();
    }

    // 4. Write config
    const nextConfig = {
      componentPath,
      sharedPath: existing?.sharedPath,
      installedHashes: existing?.installedHashes,
    };
    writeConfig(cwd, nextConfig);
    console.log(
      pc.green('\n✔') + ` ${CONFIG_FILE} written` + pc.dim(` (componentPath: ${componentPath})`),
    );
    console.log(pc.dim(`  Components will be installed to: ./${componentPath}`));
    console.log(
      pc.dim('  Paths are resolved from your project root, not appended to the default path.'),
    );

    // 5. Write the design-token stylesheet every component reads (--sanring-*).
    // Skipped if it already exists (protects any brand-color edits) unless --force.
    const themeDest = join(cwd, THEME_FILE_PATH);
    try {
      const themeContent = await fetchFile('shared/theme.css', options.registry);
      const themeResult = writeFile(themeDest, themeContent, options.force);
      if (themeResult === 'written') {
        writeConfig(cwd, {
          componentPath,
          sharedPath: existing?.sharedPath,
          installedHashes: {
            ...existing?.installedHashes,
            [THEME_FILE_PATH]: hashContent(themeContent),
          },
        });
        console.log(pc.green('✔') + ` ${THEME_FILE_PATH} written`);
      } else {
        console.log(
          pc.dim(`–  ${THEME_FILE_PATH} already exists, use --force to reset it to defaults`),
        );
      }
    } catch (e) {
      console.warn(
        pc.yellow(`⚠ Could not fetch shared/theme.css: ${e instanceof Error ? e.message : e}`),
      );
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
      const { bin, args } = installCommandParts(pm, pkgs);
      const result = spawnSync(bin, args, { stdio: 'inherit', shell: false });
      if (result.status !== 0) {
        console.warn(pc.yellow(`\n  ⚠ Install failed. Run manually:\n  ${pc.white(cmd)}`));
      } else {
        console.log(pc.green('\n✔') + ' Base dependencies installed');
      }
    }

    const globalStylesheet = findGlobalStylesheet(cwd) ?? DEFAULT_GLOBAL_STYLESHEET_PATH;
    const themeImport = importPathForStylesheet(globalStylesheet);
    const importResult = ensureThemeImport(cwd, globalStylesheet, themeImport);

    if (importResult === 'added') {
      console.log(pc.green('✔') + ` ${globalStylesheet} now imports ${THEME_FILE_PATH}`);
    } else if (importResult === 'already-present') {
      console.log(pc.green('✔') + ` ${globalStylesheet} already imports ${THEME_FILE_PATH}`);
    } else {
      console.log(
        pc.yellow(`⚠ ${globalStylesheet} not found. Add this line to your global stylesheet:`),
      );
      console.log(pc.white(`  @import '${themeImport}';`));
    }
    console.log(pc.dim(`  ${THEME_FILE_PATH} contains Sanring color and radius tokens.`));
    console.log(pc.dim(`  Edit it later if you want to customize the theme.\n`));
    console.log(
      pc.cyan(`Done! Run ${pc.bold(`${CLI_RUNNER} add <component>`)} to add components.\n`),
    );
  });
