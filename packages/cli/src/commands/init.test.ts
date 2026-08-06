import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { hashContent, readConfig, writeConfig } from '../utils.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { initCommand } from './init.js';

// Shared helper to write a minimal Angular project under a given directory.
function writeAngularProject(dir: string) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'angular.json'),
    JSON.stringify({
      projects: { app: { architect: { build: { options: { styles: ['src/styles.css'] } } } } },
    }),
    'utf-8',
  );
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ dependencies: { clsx: '^2.0.0', 'tailwind-merge': '^3.0.0' } }),
    'utf-8',
  );
}

describe('initCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-registry-'));
    writeAngularProject(projectDir);
    writeRegistryFixture(registryDir, { theme: ':root { --sanring-radius: 8px; }\n' });
    process.chdir(projectDir);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('writes the theme file and records its baseline hash', async () => {
    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    const themeFile = join(projectDir, 'src/sanring-theme.css');
    expect(existsSync(themeFile)).toBe(true);
    expect(readFileSync(themeFile, 'utf-8')).toBe(':root { --sanring-radius: 8px; }\n');

    const config = readConfig(projectDir);
    expect(config?.componentPath).toBe('src/app/components/ui');
    expect(config?.installedHashes?.['src/sanring-theme.css']).toBe(
      hashContent(':root { --sanring-radius: 8px; }\n'),
    );
  });

  it('does not overwrite an existing theme file without --force', async () => {
    mkdirSync(join(projectDir, 'src'), { recursive: true });
    const themeFile = join(projectDir, 'src/sanring-theme.css');
    writeFileSync(themeFile, '/* hand customized */\n', 'utf-8');

    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    expect(readFileSync(themeFile, 'utf-8')).toBe('/* hand customized */\n');
  });

  it('keeps existing config details when re-running init with defaults', async () => {
    writeConfig(projectDir, {
      componentPath: 'src/app/components',
      sharedPath: 'src/app/shared/sanring',
      installedHashes: { 'widget/index.ts': 'previous-hash' },
    });

    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    expect(readConfig(projectDir)).toEqual({
      componentPath: 'src/app/components',
      sharedPath: 'src/app/shared/sanring',
      installedHashes: {
        'widget/index.ts': 'previous-hash',
        'src/sanring-theme.css': hashContent(':root { --sanring-radius: 8px; }\n'),
      },
    });
  });

  it('prints root-relative path guidance and an npx add command', async () => {
    const logs: string[] = [];
    vi.mocked(console.log).mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    await initCommand.parseAsync(['--yes', '--path', 'components', '--registry', registryDir], {
      from: 'user',
    });

    expect(
      logs.some((line) => line.includes('Components will be installed to: ./components')),
    ).toBe(true);
    expect(logs.some((line) => line.includes('Paths are resolved from your project root'))).toBe(
      true,
    );
    expect(logs.some((line) => line.includes('npx @sanring/cli@latest add <component>'))).toBe(
      true,
    );
    expect(logs.some((line) => line.includes('Run sanring add <component>'))).toBe(false);
  });

  it('prints a concrete stylesheet next step for theme tokens', async () => {
    const logs: string[] = [];
    vi.mocked(console.log).mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('src/styles.css not found'))).toBe(true);
    expect(logs.some((line) => line.includes('Add this line to your global stylesheet'))).toBe(
      true,
    );
    expect(logs.some((line) => line.includes("@import './sanring-theme.css';"))).toBe(true);
    expect(logs.some((line) => line.includes('src/sanring-theme.css contains Sanring'))).toBe(true);
  });

  it('adds the theme import to the Angular global stylesheet', async () => {
    mkdirSync(join(projectDir, 'src'), { recursive: true });
    const stylesFile = join(projectDir, 'src/styles.css');
    writeFileSync(stylesFile, 'body { margin: 0; }\n', 'utf-8');

    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    expect(readFileSync(stylesFile, 'utf-8')).toBe(
      "@import './sanring-theme.css';\n\nbody { margin: 0; }\n",
    );
  });

  it('does not duplicate an existing theme import', async () => {
    mkdirSync(join(projectDir, 'src'), { recursive: true });
    const stylesFile = join(projectDir, 'src/styles.css');
    writeFileSync(stylesFile, "@import './sanring-theme.css';\n\nbody { margin: 0; }\n", 'utf-8');

    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    expect(readFileSync(stylesFile, 'utf-8').match(/sanring-theme\.css/g)).toHaveLength(1);
  });
});

describe('initCommand — monorepo detection', () => {
  let workspaceRoot: string;
  let registryDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    workspaceRoot = mkdtempSync(join(tmpdir(), 'sanring-cli-workspace-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-registry-'));
    writeRegistryFixture(registryDir, { theme: ':root { --sanring-radius: 8px; }\n' });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(workspaceRoot, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('auto-selects the only Angular project in a pnpm workspace', async () => {
    // Monorepo root: pnpm-workspace.yaml, no angular.json
    writeFileSync(join(workspaceRoot, 'pnpm-workspace.yaml'), 'packages:\n  - apps/*\n', 'utf-8');
    writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({}), 'utf-8');

    const appDir = join(workspaceRoot, 'apps', 'web');
    writeAngularProject(appDir);

    process.chdir(workspaceRoot);

    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    // Config and theme should be written to the Angular project, not the workspace root.
    expect(existsSync(join(appDir, 'sanring.config.json'))).toBe(true);
    expect(existsSync(join(appDir, 'src', 'sanring-theme.css'))).toBe(true);
    expect(existsSync(join(workspaceRoot, 'sanring.config.json'))).toBe(false);
  });

  it('errors with project list when multiple Angular projects exist and --yes is passed', async () => {
    writeFileSync(join(workspaceRoot, 'pnpm-workspace.yaml'), 'packages:\n  - apps/*\n', 'utf-8');
    writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({}), 'utf-8');

    writeAngularProject(join(workspaceRoot, 'apps', 'web'));
    writeAngularProject(join(workspaceRoot, 'apps', 'admin'));

    process.chdir(workspaceRoot);

    const errors: string[] = [];
    vi.mocked(console.error).mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });

    let exitCode: number | undefined;
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(
      ((code?: number) => {
        exitCode = code as number;
        throw new Error('process.exit');
      }) as typeof process.exit,
    );

    await expect(
      initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' }),
    ).rejects.toThrow('process.exit');

    expect(exitCode).toBe(1);
    expect(errors.some((e) => e.includes('Multiple Angular projects'))).toBe(true);
    expect(errors.some((e) => e.includes('apps/web') || e.includes('apps\\web'))).toBe(true);

    exitSpy.mockRestore();
  });

  it('errors when no Angular project is found in the workspace', async () => {
    writeFileSync(join(workspaceRoot, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n', 'utf-8');
    writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({}), 'utf-8');
    mkdirSync(join(workspaceRoot, 'packages', 'lib'), { recursive: true });
    writeFileSync(join(workspaceRoot, 'packages', 'lib', 'package.json'), '{}', 'utf-8');

    process.chdir(workspaceRoot);

    const errors: string[] = [];
    vi.mocked(console.error).mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });

    await expect(
      initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' }),
    ).rejects.toThrow('process.exit');

    expect(errors.some((e) => e.includes('No Angular projects found'))).toBe(true);

    exitSpy.mockRestore();
  });

  it('errors with clear message when run from a non-Angular, non-monorepo directory', async () => {
    // Just an empty temp directory
    process.chdir(workspaceRoot);

    const errors: string[] = [];
    vi.mocked(console.error).mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });

    await expect(
      initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' }),
    ).rejects.toThrow('process.exit');

    expect(errors.some((e) => e.includes('No angular.json found'))).toBe(true);

    exitSpy.mockRestore();
  });

  it('finds Angular project nested two levels deep in workspace', async () => {
    writeFileSync(join(workspaceRoot, 'lerna.json'), JSON.stringify({ version: '0.0.0' }), 'utf-8');
    writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({}), 'utf-8');

    // Two levels deep: workspace/apps/feature/angular-app/
    const appDir = join(workspaceRoot, 'apps', 'feature', 'web');
    writeAngularProject(appDir);

    process.chdir(workspaceRoot);

    await initCommand.parseAsync(['--yes', '--registry', registryDir], { from: 'user' });

    expect(existsSync(join(appDir, 'sanring.config.json'))).toBe(true);
  });
});
