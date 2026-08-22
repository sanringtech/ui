import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getCliVersion, readConfig, writeConfig } from '../utils.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { addCommand } from './add.js';
import { infoCommand } from './info.js';

describe('infoCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;
  let logs: string[];
  let errors: string[];
  let stdout: string[];

  beforeEach(() => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-info-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-info-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      utilsPeerDependencies: { clsx: '^2.0.0' },
      widget: 'export const widget = 1;\n',
    });
    process.chdir(projectDir);

    // Commander reuses this module-level Command instance across every
    // parseAsync() call in this file and never resets boolean flags back to
    // their default on its own (see doctor.test.ts for the same workaround)
    // — without this, a `--json` run earlier in the file would leak `true`
    // into a later human-readable-output test that never passes `--json`.
    infoCommand.setOptionValue('json', false);
    infoCommand.setOptionValue('registry', undefined);
    infoCommand.setOptionValue('path', undefined);

    logs = [];
    errors = [];
    stdout = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });
    // --json output goes through process.stdout.write, not console.log.
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk: unknown) => {
      stdout.push(String(chunk));
      return true;
    });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  describe('project info mode (no argument)', () => {
    it('reports --json project info with no components installed', async () => {
      await infoCommand.parseAsync(['--json', '--registry', registryDir], { from: 'user' });

      const report = JSON.parse(stdout.join('')) as {
        cli: string;
        angular: unknown;
        config: unknown;
        theme: { present: boolean };
        installed: string[];
      };
      expect(report.cli).toBe(getCliVersion());
      expect(report.angular).not.toBe(false);
      expect(report.config).toBeNull();
      expect(report.theme.present).toBe(false);
      expect(report.installed).toEqual([]);
    });

    it('reports human-readable project info reflecting installed components', async () => {
      await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });
      logs = [];

      await infoCommand.parseAsync(['--registry', registryDir], { from: 'user' });

      const output = logs.join('\n');
      expect(output).toMatch(/Sanring UI — project info/);
      expect(output).toMatch(/Angular.*✔/);
      expect(output).toMatch(/sanring\.config\.json/);
      expect(output).toMatch(/Installed \(1\).*widget/);
    });

    it('reports --json project info reflecting installed components and config', async () => {
      await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });
      logs = [];

      await infoCommand.parseAsync(['--json', '--registry', registryDir], { from: 'user' });

      const report = JSON.parse(stdout.join('')) as { installed: string[]; config: { componentPath: string } };
      expect(report.installed).toEqual(['widget']);
      expect(report.config.componentPath).toBeTruthy();
    });
  });

  describe('component info mode', () => {
    it('reports --json details for an available, not-yet-installed component', async () => {
      await infoCommand.parseAsync(['widget', '--json', '--registry', registryDir], { from: 'user' });

      const report = JSON.parse(stdout.join('')) as {
        name: string;
        installed: boolean;
        files: string[];
        sharedDeps: string[];
        peerDependencies: Record<string, string>;
      };
      expect(report.name).toBe('widget');
      expect(report.installed).toBe(false);
      expect(report.files).toEqual(['widget/index.ts']);
      expect(report.sharedDeps).toEqual(['utils']);
      // Peer deps roll up transitively from the shared dep.
      expect(report.peerDependencies).toEqual({ clsx: '^2.0.0' });
    });

    it('reports human-readable details and reflects already-installed status', async () => {
      await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });
      logs = [];

      await infoCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });

      const output = logs.join('\n');
      expect(output).toMatch(/widget/);
      expect(output).toMatch(/Already installed/);
    });

    it('exits 1 with the list of available components for an unknown component', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit');
      });

      await expect(
        infoCommand.parseAsync(['does-not-exist', '--registry', registryDir], { from: 'user' }),
      ).rejects.toThrow('process.exit');

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(errors.some((e) => e.includes('Component not found: does-not-exist'))).toBe(true);
      expect(errors.some((e) => e.includes('widget'))).toBe(true);

      exitSpy.mockRestore();
    });

    it('resolves an alias:component reference against the aliased registry, not the default', async () => {
      const otherRegistryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-info-registry-other-'));
      writeRegistryFixture(otherRegistryDir, { widget: 'export const widget = "other";\n' });

      // No --registry flag override here — resolution must come purely from
      // the alias prefix against sanring.config.json's `registries` map.
      writeConfig(projectDir, {
        componentPath: readConfig(projectDir)?.componentPath ?? 'src/app/components/ui',
        registries: { mine: registryDir, other: otherRegistryDir },
        defaultRegistry: 'mine',
      });

      await infoCommand.parseAsync(['other:widget', '--json'], { from: 'user' });

      const report = JSON.parse(stdout.join('')) as { name: string; sharedDeps: string[] };
      expect(report.name).toBe('widget');
      // The 'other' fixture has no `utils` shared file, unlike the default registry.
      expect(report.sharedDeps).toEqual([]);

      rmSync(otherRegistryDir, { recursive: true, force: true });
    });
  });
});
