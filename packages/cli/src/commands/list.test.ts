import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { addCommand } from './add.js';
import { listCommand } from './list.js';

describe('listCommand --outdated', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;
  let logs: string[];

  beforeEach(async () => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-list-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-list-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
    });
    process.chdir(projectDir);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });

    // Commander reuses this module-level Command instance across every
    // parseAsync() call in this file and never resets boolean/string option
    // state back to its default between calls (see doctor.test.ts for the
    // same pattern) — without this, e.g. a prior test's `--outdated` or
    // `--json` would leak into a later call that doesn't pass those flags.
    listCommand.setOptionValue('installed', false);
    listCommand.setOptionValue('outdated', false);
    listCommand.setOptionValue('json', false);
    listCommand.setOptionValue('path', undefined);

    logs = [];
    vi.mocked(console.log).mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  const componentFile = () => join(projectDir, 'src/app/components/ui/widget/index.ts');

  it('reports installed components that already match the registry', async () => {
    await listCommand.parseAsync(['--outdated', '--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('Installed component status'))).toBe(true);
    expect(logs.some((line) => line.includes('widget') && line.includes('up-to-date'))).toBe(true);
    expect(logs.some((line) => line.includes('1 up-to-date, 0 outdated, 0 with conflicts'))).toBe(
      true,
    );
  });

  it('reports untouched installed components as outdated when the registry changed', async () => {
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 2;\n',
    });

    await listCommand.parseAsync(['--outdated', '--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('widget') && line.includes('outdated'))).toBe(true);
    expect(logs.some((line) => line.includes('1 changed'))).toBe(true);
    expect(logs.some((line) => line.includes('0 up-to-date, 1 outdated, 0 with conflicts'))).toBe(
      true,
    );
  });

  it('reports locally edited installed components as having conflicts', async () => {
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 2;\n',
    });
    writeFileSync(componentFile(), 'export const widget = "custom";\n', 'utf-8');

    await listCommand.parseAsync(['--outdated', '--registry', registryDir], { from: 'user' });

    expect(readFileSync(componentFile(), 'utf-8')).toBe('export const widget = "custom";\n');
    expect(logs.some((line) => line.includes('widget') && line.includes('has-conflicts'))).toBe(
      true,
    );
    expect(logs.some((line) => line.includes('1 changed') && line.includes('1 conflicts'))).toBe(
      true,
    );
    expect(logs.some((line) => line.includes('0 up-to-date, 0 outdated, 1 with conflicts'))).toBe(
      true,
    );
  });

  it('--outdated --json reports the same status as structured output', async () => {
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 2;\n',
    });

    await listCommand.parseAsync(['--outdated', '--json', '--registry', registryDir], { from: 'user' });

    const report = JSON.parse(logs.join('')) as {
      components: Array<{ name: string; status: string }>;
      upToDate: number;
      outdated: number;
      conflicts: number;
    };
    expect(report.components).toEqual([expect.objectContaining({ name: 'widget', status: 'outdated' })]);
    expect(report).toMatchObject({ upToDate: 0, outdated: 1, conflicts: 0 });
  });

  it('plain --json listing (no --outdated) reports the available components', async () => {
    await listCommand.parseAsync(['--json', '--registry', registryDir], { from: 'user' });

    const report = JSON.parse(logs.join('')) as { components: Array<{ name: string }> };
    expect(report.components.map((c) => c.name)).toEqual(['widget']);
  });
});
