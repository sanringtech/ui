import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { addCommand } from './add.js';
import { doctorCommand } from './doctor.js';

describe('doctorCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;
  let logs: string[];
  let errors: string[];

  beforeEach(async () => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-doctor-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
    });
    process.chdir(projectDir);

    // Provide a theme file so the config section passes cleanly.
    const themeDir = join(projectDir, 'src');
    mkdirSync(themeDir, { recursive: true });
    writeFileSync(join(projectDir, 'src/sanring-theme.css'), ':root {}\n', 'utf-8');

    logs = [];
    errors = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });

    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });

    logs = [];
    errors = [];
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('passes all static checks for a valid project (--offline)', async () => {
    await doctorCommand.parseAsync(['--offline', '--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toMatch(/Angular project detected/);
    expect(output).toMatch(/sanring\.config\.json/);
    expect(output).toMatch(/untouched since install/);
    expect(output).toMatch(/All checks passed/);
  });

  it('reports customized when a file has been locally edited', async () => {
    const componentFile = join(projectDir, 'src/app/components/ui/widget/index.ts');
    writeFileSync(componentFile, 'export const widget = 99; // hand-edited\n', 'utf-8');

    await doctorCommand.parseAsync(['--offline', '--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toMatch(/customized/);
    expect(output).toMatch(/widget\/index\.ts/);
    // Customized is informational — not counted as error or warning.
    expect(output).not.toMatch(/error/i);
  });

  it('reports orphaned hash when a file was deleted outside of sanring remove', async () => {
    rmSync(join(projectDir, 'src/app/components/ui/widget/index.ts'));

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never);

    await doctorCommand.parseAsync(['--offline', '--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toMatch(/orphaned/);
    expect(output).toMatch(/widget\/index\.ts/);

    exitSpy.mockRestore();
  });

  it('reports an unreachable registry as a failed check instead of crashing (regression: registry.ts used to process.exit directly)', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never);
    const brokenRegistryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-doctor-broken-registry-'));

    doctorCommand.setOptionValue('offline', false);
    // Resolving does not throw/reject — this is the actual regression: before
    // registry.ts threw a typed error instead of calling process.exit(1)
    // itself, this awaited call never returned control to doctor.ts at all,
    // so the `catch { fail('Unreachable...') }` below could never run.
    await doctorCommand.parseAsync(['--registry', brokenRegistryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toMatch(/Unreachable/);
    expect(exitSpy).toHaveBeenCalledWith(1);

    rmSync(brokenRegistryDir, { recursive: true, force: true });
    exitSpy.mockRestore();
  });

  it('reports a dangling componentDep in the registry itself as a warning', async () => {
    const registryPath = join(registryDir, 'registry.json');
    const registry = JSON.parse(readFileSync(registryPath, 'utf-8')) as {
      components: Array<{ name: string; componentDeps?: string[] }>;
    };
    registry.components.find((c) => c.name === 'widget')!.componentDeps = ['does-not-exist'];
    writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');

    doctorCommand.setOptionValue('offline', false);
    doctorCommand.setOptionValue('json', false);
    await doctorCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toMatch(/Registry integrity/);
    expect(output).toMatch(/does-not-exist/);
  });

  it('reports JSON checks and backfills missing hashes with --fix', async () => {
    const configPath = join(projectDir, 'sanring.config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8')) as {
      installedHashes?: Record<string, string>;
    };
    delete config.installedHashes?.['widget/index.ts'];
    writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');

    doctorCommand.setOptionValue('offline', false);
    doctorCommand.setOptionValue('json', true);
    await doctorCommand.parseAsync(['--registry', registryDir, '--json'], { from: 'user' });
    const report = JSON.parse(logs.join('')) as { checks: Array<{ message: string }> };
    expect(report.checks.some((check) => check.message.includes('no baseline hash'))).toBe(true);

    logs = [];
    doctorCommand.setOptionValue('json', false);
    await doctorCommand.parseAsync(['--registry', registryDir, '--fix'], { from: 'user' });
    const repaired = JSON.parse(readFileSync(configPath, 'utf-8')) as {
      installedHashes?: Record<string, string>;
    };
    expect(repaired.installedHashes?.['widget/index.ts']).toBeTruthy();
  });
});
