import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Registry } from '../registry.js';
import { readConfig, writeConfig } from '../utils.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { addCommand } from './add.js';
import { migrateCommand } from './migrate.js';

describe('migrateCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;
  let logs: string[];
  let errors: string[];

  beforeEach(async () => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-migrate-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-migrate-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
    });
    process.chdir(projectDir);

    logs = [];
    errors = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });

    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });

    // Commander reuses this module-level Command instance across every
    // parseAsync() call in this file and doesn't reset boolean flags back to
    // their default between calls (see doctor.test.ts for the same pattern).
    migrateCommand.setOptionValue('check', false);
    migrateCommand.setOptionValue('registry', undefined);

    logs = [];
    errors = [];
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  function addMigration(fromVersion: string, breaking: boolean, steps: string[]) {
    const registryPath = join(registryDir, 'registry.json');
    const registry: Registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
    const widget = registry.components.find((c) => c.name === 'widget')!;
    widget.migrations = [...(widget.migrations ?? []), { fromVersion, breaking, steps }];
    writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
  }

  it('reports up to date when the installed component has no migrations ahead of it', async () => {
    await migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('up to date'))).toBe(true);
  });

  it('prints migration steps for an installed component behind a breaking migration', async () => {
    addMigration('0.1.0', true, ['Rename `foo` input to `bar`.']);
    // installedVersions records the CLI version at install time; the fixture
    // registry has no version info, so this asserts against whatever the
    // real add command recorded, read back from disk.
    const config = readConfig(projectDir)!;
    writeConfig(projectDir, {
      ...config,
      installedVersions: { ...config.installedVersions, widget: '0.1.0' },
    });

    await migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toMatch(/BREAKING/);
    expect(output).toMatch(/Rename `foo` input to `bar`\./);
    expect(output).toMatch(/sanring update widget/);
  });

  it('does not surface a migration whose fromVersion is behind the installed version', async () => {
    addMigration('0.1.0', true, ['Rename `foo` input to `bar`.']);
    const config = readConfig(projectDir)!;
    writeConfig(projectDir, {
      ...config,
      installedVersions: { ...config.installedVersions, widget: '0.2.0' },
    });

    await migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('up to date'))).toBe(true);
    expect(logs.some((line) => line.includes('BREAKING'))).toBe(false);
  });

  it('--check exits 1 without printing steps when a migration is needed', async () => {
    addMigration('0.1.0', true, ['Rename `foo` input to `bar`.']);
    const config = readConfig(projectDir)!;
    writeConfig(projectDir, {
      ...config,
      installedVersions: { ...config.installedVersions, widget: '0.1.0' },
    });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });

    await expect(
      migrateCommand.parseAsync(['--check', '--registry', registryDir], { from: 'user' }),
    ).rejects.toThrow('process.exit');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(logs.some((line) => line.includes('Rename `foo`'))).toBe(false);

    exitSpy.mockRestore();
  });

  it('--check exits cleanly (no process.exit call) when nothing needs migration', async () => {
    const exitSpy = vi.spyOn(process, 'exit');

    await migrateCommand.parseAsync(['--check', '--registry', registryDir], { from: 'user' });

    expect(exitSpy).not.toHaveBeenCalled();
    expect(logs.some((line) => line.includes('up to date'))).toBe(true);

    exitSpy.mockRestore();
  });

  it('reports a component no longer present in the registry as not-found and skips it', async () => {
    const config = readConfig(projectDir)!;
    writeConfig(projectDir, {
      ...config,
      installedVersions: { ...config.installedVersions, 'removed-component': '0.1.0' },
    });

    await migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('removed-component') && line.includes('not found in registry'))).toBe(
      true,
    );
  });

  it('resolves an alias:component installedVersions key against the bare registry component name', async () => {
    const config = readConfig(projectDir)!;
    // Simulate a multi-registry config where installedVersions keys carry an
    // alias prefix — migrate must strip it before looking the name up in the
    // registry, not treat the whole "alias:name" string as the component name.
    writeConfig(projectDir, {
      ...config,
      registries: { mine: registryDir },
      defaultRegistry: 'mine',
      installedVersions: { 'mine:widget': '0.0.0' },
    });
    addMigration('0.1.0', false, ['Some non-breaking cleanup.']);

    await migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toMatch(/widget/);
    expect(output).toMatch(/Some non-breaking cleanup\./);
  });

  it('reports a no-baseline component distinctly from a needs-migration one', async () => {
    const config = readConfig(projectDir)!;
    const restVersions = { ...config.installedVersions };
    delete restVersions.widget;
    writeConfig(projectDir, { ...config, installedVersions: restVersions });

    await migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('widget') && line.includes('no installed version baseline'))).toBe(
      true,
    );
  });

  it('errors out when sanring.config.json does not exist', async () => {
    rmSync(join(projectDir, 'sanring.config.json'));
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });

    await expect(
      migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' }),
    ).rejects.toThrow('process.exit');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errors.some((e) => e.includes('sanring.config.json not found'))).toBe(true);

    exitSpy.mockRestore();
  });
});
