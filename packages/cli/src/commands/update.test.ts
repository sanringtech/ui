import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { hashContent, readConfig, writeConfig } from '../utils.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { addCommand } from './add.js';
import { classifyUpdate, updateCommand } from './update.js';

describe('classifyUpdate', () => {
  it('is unchanged when local already matches remote', () => {
    expect(classifyUpdate('button/index.ts', '/dest', 'same', 'same', undefined)).toEqual({
      kind: 'unchanged',
    });
  });

  it('auto-applies when local matches the recorded baseline hash', () => {
    const baseline = hashContent('old registry content');
    expect(
      classifyUpdate(
        'button/index.ts',
        '/dest',
        'old registry content',
        'new registry content',
        baseline,
      ),
    ).toEqual({
      kind: 'auto',
      label: 'button/index.ts',
      dest: '/dest',
      remote: 'new registry content',
    });
  });

  it('flags a conflict when local no longer matches the recorded baseline', () => {
    const baseline = hashContent('old registry content');
    expect(
      classifyUpdate(
        'button/index.ts',
        '/dest',
        'hand-edited content',
        'new registry content',
        baseline,
      ),
    ).toEqual({
      kind: 'conflict',
      label: 'button/index.ts',
      dest: '/dest',
      local: 'hand-edited content',
      remote: 'new registry content',
    });
  });

  it('flags a conflict when there is no recorded baseline at all', () => {
    expect(
      classifyUpdate('button/index.ts', '/dest', 'local content', 'remote content', undefined),
    ).toEqual({
      kind: 'conflict',
      label: 'button/index.ts',
      dest: '/dest',
      local: 'local content',
      remote: 'remote content',
    });
  });
});

describe('updateCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;
  let logs: string[];

  beforeEach(async () => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
    });
    process.chdir(projectDir);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // Seed an installed project the same way a real user would: `add`.
    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  const componentFile = () => join(projectDir, 'src/app/components/ui/widget/index.ts');
  const sharedFile = () => join(projectDir, 'src/app/components/ui/shared/utils.ts');

  it('auto-applies a file the user never touched, and diffs+confirms one they edited', async () => {
    // Registry moves on for both files...
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() { return "v2"; }\n',
      widget: 'export const widget = 2;\n',
    });
    // ...but the user hand-edited shared/utils.ts locally in the meantime.
    writeFileSync(sharedFile(), 'export function cn() { /* my tweak */ }\n', 'utf-8');

    logs = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    await updateCommand.parseAsync(['--registry', registryDir, '--yes'], { from: 'user' });

    // Untouched file: silently brought up to date.
    expect(readFileSync(componentFile(), 'utf-8')).toBe('export const widget = 2;\n');
    expect(logs.some((l) => l.includes('widget/index.ts') && l.includes('auto-updated'))).toBe(
      true,
    );

    // Edited file: still applied (because --yes auto-confirms), but through
    // the diff/conflict path, not the silent one.
    expect(readFileSync(sharedFile(), 'utf-8')).toBe('export function cn() { return "v2"; }\n');
    expect(logs.some((l) => l.includes('shared/utils.ts') && l.includes('auto-updated'))).toBe(
      false,
    );

    const config = readConfig(projectDir);
    expect(config?.installedHashes?.['widget/index.ts']).toBe(
      hashContent('export const widget = 2;\n'),
    );
    expect(config?.installedHashes?.['shared/utils.ts']).toBe(
      hashContent('export function cn() { return "v2"; }\n'),
    );
  });

  it('installs new files added to the registry after initial install', async () => {
    // Registry gains a second file for widget after the user already installed it.
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
      widgetExtra: 'export const extra = 1;\n',
    });

    logs = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    await updateCommand.parseAsync(['--registry', registryDir, '--yes'], { from: 'user' });

    // New file should be installed.
    const extraFile = join(projectDir, 'src/app/components/ui/widget/extra.ts');
    expect(existsSync(extraFile)).toBe(true);
    expect(readFileSync(extraFile, 'utf-8')).toBe('export const extra = 1;\n');
    expect(logs.some((l) => l.includes('widget/extra.ts') && l.includes('new'))).toBe(true);

    // Hash should be recorded so future updates track it correctly.
    const config = readConfig(projectDir);
    expect(config?.installedHashes?.['widget/extra.ts']).toBe(hashContent('export const extra = 1;\n'));
  });

  it('--trust promotes no-baseline conflicts to auto-update (pre-0.9.0 installs)', async () => {
    // Simulate a pre-0.9.0 install: strip all recorded hashes so the config
    // looks like what users had before hash tracking was introduced.
    const configBefore = readConfig(projectDir)!;
    writeConfig(projectDir, { componentPath: configBefore.componentPath, installedHashes: {} });

    // Registry moves on after the stripped install.
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() { return "v2"; }\n',
      widget: 'export const widget = 2;\n',
    });

    logs = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    // Without --trust, the missing baseline would classify both as conflict.
    // With --trust, they should be promoted to auto without any prompts.
    await updateCommand.parseAsync(['--registry', registryDir, '--trust'], { from: 'user' });

    expect(readFileSync(componentFile(), 'utf-8')).toBe('export const widget = 2;\n');
    expect(readFileSync(sharedFile(), 'utf-8')).toBe('export function cn() { return "v2"; }\n');
    // Both files went through the auto (not conflict) path.
    expect(logs.some((l) => l.includes('auto-updated'))).toBe(true);
    // trust note should appear in the header
    expect(logs.some((l) => l.includes('--trust'))).toBe(true);
  });

  it('reports nothing to do when local files already match the registry', async () => {
    logs = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    await updateCommand.parseAsync(['--registry', registryDir, '--yes'], { from: 'user' });

    expect(logs.some((l) => l.includes('Nothing to update'))).toBe(true);
  });

  it('updates shared files from the configured sharedPath', async () => {
    const customProjectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-project-'));
    const customRegistryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-registry-'));

    try {
      writeFileSync(join(customProjectDir, 'angular.json'), '{}', 'utf-8');
      writeRegistryFixture(customRegistryDir, {
        utils: 'export function cn() {}\n',
        widget: 'export const widget = 1;\n',
      });
      process.chdir(customProjectDir);

      await addCommand.parseAsync(
        ['widget', '--registry', customRegistryDir, '--shared-path', 'src/app/shared/sanring'],
        { from: 'user' },
      );

      writeRegistryFixture(customRegistryDir, {
        utils: 'export function cn() { return "v2"; }\n',
        widget: 'export const widget = 1;\n',
      });

      await updateCommand.parseAsync(['--registry', customRegistryDir, '--yes'], { from: 'user' });

      const sharedFile = join(customProjectDir, 'src/app/shared/sanring/utils.ts');
      expect(readFileSync(sharedFile, 'utf-8')).toBe('export function cn() { return "v2"; }\n');
      expect(readConfig(customProjectDir)?.sharedPath).toBe('src/app/shared/sanring');
    } finally {
      rmSync(customProjectDir, { recursive: true, force: true });
      rmSync(customRegistryDir, { recursive: true, force: true });
      process.chdir(projectDir);
    }
  });
});
