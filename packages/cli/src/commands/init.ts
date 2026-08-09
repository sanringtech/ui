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
  DEFAULT_COMPONENT_PATH,
  MonorepoType,
  findAngularProjectsInWorkspace,
  findMonorepoAncestor,
  getInstalledPackages,
  hashContent,
  isAngularProject,
  readConfig,
  writeConfig,
} from '../utils.js';
import { writeFile } from './add.js';

const MONOREPO_TYPE_LABEL: Record<MonorepoType, string> = {
  pnpm: 'pnpm workspace',
  nx: 'Nx workspace',
  lerna: 'Lerna monorepo',
  turbo: 'Turborepo',
  'npm-workspaces': 'npm/yarn workspace',
};

export const THEME_FILE_PATH = 'src/sanring-theme.css';
export const THEME_PRESETS = ['default', 'slate', 'warm', 'high-contrast'] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

interface InitOptions {
  path: string;
  yes: boolean;
  force: boolean;
  theme: string;
  registry?: string;
}

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

// Presets are override-only partials (see registry/shared/theme-presets/*.css):
// they redeclare just the tokens that change and rely on the base file's
// var() references (e.g. --sanring-active: var(--sanring-primary-80)) to
// cascade the new values through, so appending after the base file is
// sufficient — no merge logic needed beyond string concatenation.
async function resolveThemeContent(theme: ThemePreset, registry?: string): Promise<string> {
  const base = await fetchFile('shared/theme.css', registry);
  if (theme === 'default') return base;

  const preset = await fetchFile(`shared/theme-presets/${theme}.css`, registry);
  return `${base}\n${preset}`;
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
  .option(
    '--theme <preset>',
    `named theme preset (${THEME_PRESETS.join(', ')})`,
    'default' satisfies ThemePreset,
  )
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(async (options: InitOptions) => {
    const cwd = process.cwd();

    console.log(pc.cyan(`\nSanring UI — init\n`));

    if (!THEME_PRESETS.includes(options.theme as ThemePreset)) {
      console.error(pc.red(`✖ Unknown theme preset: ${options.theme}`));
      console.error(pc.dim(`  Available presets: ${THEME_PRESETS.join(', ')}`));
      process.exit(1);
    }
    const theme = options.theme as ThemePreset;

    // 1. Resolve the Angular project root (may differ from cwd in a monorepo).
    let projectRoot = cwd;

    if (!isAngularProject(cwd)) {
      const monorepoInfo = findMonorepoAncestor(cwd);

      if (!monorepoInfo) {
        console.error(pc.red('✖ No angular.json found.'));
        console.error(pc.dim('  Run this command from the root of an Angular project.'));
        process.exit(1);
      }

      const label = MONOREPO_TYPE_LABEL[monorepoInfo.type];
      console.log(pc.dim(`  ${label} detected: ${monorepoInfo.root}`));

      const projects = findAngularProjectsInWorkspace(monorepoInfo.root);

      if (projects.length === 0) {
        console.error(pc.red('✖ No Angular projects found in this workspace.'));
        console.error(pc.dim('  Run sanring init from within an Angular project directory.'));
        process.exit(1);
      }

      if (projects.length === 1) {
        projectRoot = projects[0];
        console.log(
          pc.green('✔') +
            ` Angular project: ${pc.bold(relative(monorepoInfo.root, projectRoot))}`,
        );
      } else if (options.yes) {
        // --yes without a unique target is ambiguous; list options and exit.
        console.error(pc.red('✖ Multiple Angular projects found.'));
        console.error(pc.dim('  Run sanring init from one of these directories:'));
        for (const p of projects) {
          console.error(pc.dim(`    cd ${relative(cwd, p)} && sanring init`));
        }
        process.exit(1);
      } else {
        console.log(pc.dim('\n  Multiple Angular projects found:'));
        projects.forEach((p, i) =>
          console.log(pc.dim(`    ${i + 1}) ${relative(monorepoInfo.root, p)}`)),
        );

        const rl = createInterface({ input: process.stdin, output: process.stdout });
        const answer = await rl.question(pc.dim('\n  Select project [1]: '));
        rl.close();

        const idx = answer.trim() ? parseInt(answer.trim(), 10) - 1 : 0;
        if (isNaN(idx) || idx < 0 || idx >= projects.length) {
          console.error(pc.red('✖ Invalid selection.'));
          process.exit(1);
        }
        projectRoot = projects[idx];
        console.log(
          pc.green('✔') +
            ` Angular project: ${pc.bold(relative(monorepoInfo.root, projectRoot))}`,
        );
      }
    }

    console.log(pc.green('✔') + pc.dim(' Angular project detected'));

    // 2. Warn if already initialised
    const existing = readConfig(projectRoot);
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
    writeConfig(projectRoot, nextConfig);
    console.log(
      pc.green('\n✔') + ` ${CONFIG_FILE} written` + pc.dim(` (componentPath: ${componentPath})`),
    );
    console.log(pc.dim(`  Components will be installed to: ./${componentPath}`));
    console.log(
      pc.dim('  Paths are resolved from your project root, not appended to the default path.'),
    );

    // 5. Write the design-token stylesheet every component reads (--sanring-*).
    // Skipped if it already exists (protects any brand-color edits) unless --force.
    const themeDest = join(projectRoot, THEME_FILE_PATH);
    try {
      const themeContent = await resolveThemeContent(theme, options.registry);
      const themeResult = writeFile(themeDest, themeContent, options.force);
      if (themeResult === 'written') {
        writeConfig(projectRoot, {
          componentPath,
          sharedPath: existing?.sharedPath,
          installedHashes: {
            ...existing?.installedHashes,
            [THEME_FILE_PATH]: hashContent(themeContent),
          },
        });
        console.log(
          pc.green('✔') +
            ` ${THEME_FILE_PATH} written` +
            (theme !== 'default' ? pc.dim(` (theme: ${theme})`) : ''),
        );
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
    const installed = getInstalledPackages(projectRoot);
    const missing = Object.entries(BASE_DEPS).filter(([pkg]) => !installed.has(pkg));

    if (missing.length === 0) {
      console.log(pc.green('✔') + pc.dim(' Base dependencies already installed'));
    } else {
      const pm = detectPackageManager(projectRoot);
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

    const globalStylesheet = findGlobalStylesheet(projectRoot) ?? DEFAULT_GLOBAL_STYLESHEET_PATH;
    const themeImport = importPathForStylesheet(globalStylesheet);
    const importResult = ensureThemeImport(projectRoot, globalStylesheet, themeImport);

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
