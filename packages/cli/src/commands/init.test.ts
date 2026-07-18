import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { hashContent, readConfig } from '../utils.js';
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
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
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
});
