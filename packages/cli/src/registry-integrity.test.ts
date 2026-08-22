import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Registry } from './registry.js';
import {
  checkRegistryFilesFetchable,
  checkRegistryIntegrity,
  findRegistryReferenceIssues,
  isParseableVersionRange,
} from './registry-integrity.js';

function baseRegistry(overrides: Partial<Registry> = {}): Registry {
  return {
    name: 'test',
    shared: [{ name: 'utils', description: '', file: 'shared/utils.ts' }],
    components: [
      { name: 'badge', description: '', files: ['badge/index.ts'], sharedDeps: ['utils'] },
      { name: 'tag', description: '', files: ['tag/index.ts'], componentDeps: ['badge'] },
    ],
    ...overrides,
  };
}

describe('isParseableVersionRange', () => {
  it.each([
    '1.2.3',
    '^1.2.3',
    '~2.0.0',
    '>=1.0.0',
    '>=1.0.0 <2.0.0',
    '1.0.0 - 2.0.0',
    '1.2.3-beta.1',
    '1.x',
    '*',
    'latest',
    'workspace:*',
    'workspace:^1.0.0',
    '1.2.3 || 2.0.0',
  ])('accepts %s', (spec) => {
    expect(isParseableVersionRange(spec)).toBe(true);
  });

  it.each(['', '   ', 'not-a-version', '1.2.3.4.5', 'abc.def.ghi'])('rejects %s', (spec) => {
    expect(isParseableVersionRange(spec)).toBe(false);
  });
});

describe('findRegistryReferenceIssues', () => {
  it('reports no issues for an internally-consistent registry', () => {
    expect(findRegistryReferenceIssues(baseRegistry())).toEqual([]);
  });

  it('flags a componentDep referencing an unknown component', () => {
    const registry = baseRegistry({
      components: [{ name: 'tag', description: '', files: ['tag/index.ts'], componentDeps: ['does-not-exist'] }],
    });
    const issues = findRegistryReferenceIssues(registry);
    expect(issues).toEqual([
      expect.objectContaining({ kind: 'dangling-component-dep', message: expect.stringContaining('does-not-exist') }),
    ]);
  });

  it('flags a sharedDep referencing an unknown shared file', () => {
    const registry = baseRegistry({
      shared: [],
      components: [{ name: 'badge', description: '', files: ['badge/index.ts'], sharedDeps: ['ghost-util'] }],
    });
    const issues = findRegistryReferenceIssues(registry);
    expect(issues).toEqual([
      expect.objectContaining({ kind: 'dangling-shared-dep', message: expect.stringContaining('ghost-util') }),
    ]);
  });

  it('flags a group referencing an unknown component', () => {
    const registry = baseRegistry({
      groups: [{ id: 'forms', title: 'Forms', components: ['badge', 'not-real'] }],
    });
    const issues = findRegistryReferenceIssues(registry);
    expect(issues).toEqual([
      expect.objectContaining({ kind: 'dangling-group-component', message: expect.stringContaining('not-real') }),
    ]);
  });

  it('flags an unparseable peer dependency version on a component', () => {
    const registry = baseRegistry({
      components: [
        {
          name: 'badge',
          description: '',
          files: ['badge/index.ts'],
          peerDependencies: { clsx: 'not-a-version' },
        },
      ],
    });
    const issues = findRegistryReferenceIssues(registry);
    expect(issues).toEqual([
      expect.objectContaining({ kind: 'unparseable-peer-version', message: expect.stringContaining('clsx') }),
    ]);
  });

  it('flags an unparseable peer dependency version on a shared file', () => {
    const registry = baseRegistry({
      shared: [{ name: 'utils', description: '', file: 'shared/utils.ts', peerDependencies: { clsx: 'garbage' } }],
    });
    const issues = findRegistryReferenceIssues(registry);
    expect(issues).toEqual([
      expect.objectContaining({ kind: 'unparseable-peer-version', message: expect.stringContaining('utils') }),
    ]);
  });
});

describe('checkRegistryFilesFetchable', () => {
  let registryDir: string;

  function setup() {
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-integrity-'));
    mkdirSync(join(registryDir, 'components', 'badge'), { recursive: true });
    mkdirSync(join(registryDir, 'components', 'tag'), { recursive: true });
    mkdirSync(join(registryDir, 'shared'), { recursive: true });
    writeFileSync(join(registryDir, 'components', 'badge', 'index.ts'), 'export const badge = 1;\n', 'utf-8');
    writeFileSync(join(registryDir, 'components', 'tag', 'index.ts'), 'export const tag = 1;\n', 'utf-8');
    writeFileSync(join(registryDir, 'shared', 'utils.ts'), 'export function cn() {}\n', 'utf-8');
  }

  it('reports no issues when every declared file exists at the source', async () => {
    setup();
    const issues = await checkRegistryFilesFetchable(baseRegistry(), registryDir);
    expect(issues).toEqual([]);
    rmSync(registryDir, { recursive: true, force: true });
  });

  it('flags a component file that is declared but missing from the source', async () => {
    setup();
    const registry = baseRegistry({
      components: [{ name: 'badge', description: '', files: ['badge/index.ts', 'badge/missing.ts'] }],
    });
    const issues = await checkRegistryFilesFetchable(registry, registryDir);
    expect(issues).toEqual([
      expect.objectContaining({ kind: 'unfetchable-file', message: expect.stringContaining('badge/missing.ts') }),
    ]);
    rmSync(registryDir, { recursive: true, force: true });
  });

  it('flags a shared file that is declared but missing from the source', async () => {
    setup();
    const registry = baseRegistry({
      shared: [{ name: 'ghost', description: '', file: 'shared/ghost.ts' }],
      components: [{ name: 'badge', description: '', files: ['badge/index.ts'] }],
    });
    const issues = await checkRegistryFilesFetchable(registry, registryDir);
    expect(issues).toEqual([
      expect.objectContaining({ kind: 'unfetchable-file', message: expect.stringContaining('shared/ghost') }),
    ]);
    rmSync(registryDir, { recursive: true, force: true });
  });
});

describe('checkRegistryIntegrity', () => {
  it('runs only the sync reference checks when checkFiles is not set', async () => {
    const registry = baseRegistry({
      components: [{ name: 'tag', description: '', files: ['tag/nonexistent.ts'], componentDeps: ['ghost'] }],
    });
    const issues = await checkRegistryIntegrity(registry);
    expect(issues).toEqual([expect.objectContaining({ kind: 'dangling-component-dep' })]);
  });

  it('combines sync reference checks with file-fetchability when checkFiles is set', async () => {
    const registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-integrity-combined-'));
    mkdirSync(join(registryDir, 'components', 'badge'), { recursive: true });
    writeFileSync(join(registryDir, 'components', 'badge', 'index.ts'), 'export const badge = 1;\n', 'utf-8');

    const registry = baseRegistry({
      shared: [],
      components: [
        { name: 'badge', description: '', files: ['badge/index.ts'] },
        { name: 'tag', description: '', files: ['tag/missing.ts'], componentDeps: ['ghost'] },
      ],
    });

    const issues = await checkRegistryIntegrity(registry, { source: registryDir, checkFiles: true });
    const kinds = issues.map((issue) => issue.kind).sort();
    expect(kinds).toEqual(['dangling-component-dep', 'unfetchable-file']);

    rmSync(registryDir, { recursive: true, force: true });
  });
});
