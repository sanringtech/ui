import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Registry } from '../registry.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { addCommand } from './add.js';
import { searchCommand } from './search.js';

describe('searchCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;
  let logs: string[];

  beforeEach(() => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-search-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-search-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
    });

    // Extend the fixture with more components so ranking/group/tag filters
    // have something real to differentiate — the base fixture only has one.
    for (const name of ['button', 'buttons-group', 'tooltip']) {
      mkdirSync(join(registryDir, 'components', name), { recursive: true });
      writeFileSync(join(registryDir, 'components', name, 'index.ts'), `export const ${name.replace(/-/g, '_')} = 1;\n`, 'utf-8');
    }
    const registryPath = join(registryDir, 'registry.json');
    const registry: Registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
    registry.components.push(
      { name: 'button', description: 'A clickable button', files: ['button/index.ts'], tags: ['form'] },
      { name: 'buttons-group', description: 'Groups multiple buttons', files: ['buttons-group/index.ts'], tags: ['form', 'layout'] },
      { name: 'tooltip', description: 'Shows a hint on hover', files: ['tooltip/index.ts'], tags: ['overlay'] },
    );
    registry.groups = [{ id: 'forms', title: 'Forms', components: ['button', 'buttons-group'] }];
    writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');

    process.chdir(projectDir);

    // Commander reuses this module-level Command instance across every
    // parseAsync() call in this file and doesn't reset option state back to
    // its default between calls (see doctor.test.ts for the same pattern).
    searchCommand.setOptionValue('json', false);
    searchCommand.setOptionValue('registry', undefined);
    searchCommand.setOptionValue('group', undefined);
    searchCommand.setOptionValue('tag', undefined);
    searchCommand.setOptionValue('path', undefined);

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

  it('ranks an exact name match above a substring match', async () => {
    await searchCommand.parseAsync(['button', '--registry', registryDir], { from: 'user' });

    const output = logs.join('\n');
    const buttonIdx = output.indexOf('button');
    const groupIdx = output.indexOf('buttons-group');
    expect(buttonIdx).toBeGreaterThanOrEqual(0);
    expect(groupIdx).toBeGreaterThan(buttonIdx);
  });

  it('reports no matches for a query with no hits', async () => {
    await searchCommand.parseAsync(['zzz-nonexistent', '--registry', registryDir], { from: 'user' });

    expect(logs.some((line) => line.includes('No components matching'))).toBe(true);
  });

  it('--json reports no matches as an empty results array', async () => {
    await searchCommand.parseAsync(['zzz-nonexistent', '--json', '--registry', registryDir], {
      from: 'user',
    });

    const report = JSON.parse(logs.join('')) as { query: string; results: unknown[] };
    expect(report.query).toBe('zzz-nonexistent');
    expect(report.results).toEqual([]);
  });

  it('--json includes an `installed` flag reflecting the current project state (regression: TDZ crash on installedNames)', async () => {
    await addCommand.parseAsync(['button', '--registry', registryDir], { from: 'user' });
    logs = [];

    await searchCommand.parseAsync(['button', '--json', '--registry', registryDir], { from: 'user' });

    const report = JSON.parse(logs.join('')) as {
      results: Array<{ name: string; installed: boolean }>;
    };
    const button = report.results.find((r) => r.name === 'button');
    const tooltip = report.results.find((r) => r.name === 'buttons-group');
    expect(button?.installed).toBe(true);
    expect(tooltip?.installed).toBe(false);
  });

  it('--group filters results to only the components listed in that group', async () => {
    await searchCommand.parseAsync(['e', '--group', 'forms', '--json', '--registry', registryDir], {
      from: 'user',
    });

    const report = JSON.parse(logs.join('')) as { results: Array<{ name: string }> };
    const names = report.results.map((r) => r.name).sort();
    expect(names).toEqual(['button', 'buttons-group']);
  });

  it('--tag filters results to components carrying that tag', async () => {
    await searchCommand.parseAsync(['e', '--tag', 'overlay', '--json', '--registry', registryDir], {
      from: 'user',
    });

    const report = JSON.parse(logs.join('')) as { results: Array<{ name: string }> };
    expect(report.results.map((r) => r.name)).toEqual(['tooltip']);
  });
});
