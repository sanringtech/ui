import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
});
