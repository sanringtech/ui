import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Registry } from '../registry.js';
import { writeConfig } from '../utils.js';
import { migrateCommand } from './migrate.js';

describe('migrateCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;
  let logs: string[];

  beforeEach(() => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-migrate-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-migrate-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeFileSync(
      join(registryDir, 'registry.json'),
      JSON.stringify(
        {
          name: 'test',
          shared: [],
          components: [
            {
              name: 'widget',
              description: 'Widget',
              files: ['widget/index.ts'],
              migrations: [
                {
                  fromVersion: '0.20.0',
                  breaking: true,
                  steps: ['Update the widget input name.'],
                },
              ],
            },
          ],
        } satisfies Registry,
        null,
        2,
      ),
      'utf-8',
    );
    writeConfig(projectDir, {
      componentPath: 'src/app/components/ui',
      installedVersions: { 'myteam:widget': '0.20.0' },
    });
    process.chdir(projectDir);
    logs = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('uses the bare component name for registry lookup while preserving aliased keys in output', async () => {
    await migrateCommand.parseAsync(['--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    expect(output).toContain('myteam:widget');
    expect(output).toContain('Update the widget input name.');
    expect(output).not.toContain('not found in registry');
  });
});
