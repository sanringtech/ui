import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { hashContent, readConfig, writeConfig } from '../utils.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { initCommand } from './init.js';

describe('initCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-registry-'));
    writeFileSync(
      join(projectDir, 'angular.json'),
      JSON.stringify({
        projects: {
          app: {
            architect: {
              build: {
                options: {
                  styles: ['src/styles.css'],
                },
              },
            },
          },
        },
      }),
      'utf-8',
    );
    // Pre-declare the base deps as already installed so init's dependency
    // step takes the "already installed" branch instead of shelling out to
    // a real package manager install.
    writeFileSync(
      join(projectDir, 'package.json'),
      JSON.stringify({ dependencies: { clsx: '^2.0.0', 'tailwind-merge': '^3.0.0' } }),
      'utf-8',
    );
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
