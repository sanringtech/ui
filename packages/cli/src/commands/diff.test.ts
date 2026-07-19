import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Registry, RegistryComponent } from '../registry.js';
import { hashContent } from '../utils.js';
import { listInstalledComponentNames, printFileDiff, resolveDiffTargets } from './diff.js';

function component(overrides: Partial<RegistryComponent> & { name: string }): RegistryComponent {
  return { description: '', files: [`${overrides.name}/index.ts`], ...overrides };
}

const registry: Registry = {
  name: 'test',
  shared: [],
  components: [component({ name: 'badge' }), component({ name: 'button' }), component({ name: 'tag' })],
};

describe('listInstalledComponentNames', () => {
  it('returns registry component names that have a matching directory on disk', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-diff-'));
    try {
      mkdirSync(join(dir, 'badge'), { recursive: true });
      mkdirSync(join(dir, 'button'), { recursive: true });
      mkdirSync(join(dir, 'not-a-component'), { recursive: true });

      expect(listInstalledComponentNames(dir, registry).sort()).toEqual(['badge', 'button']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns an empty list when the component base path does not exist', () => {
    expect(listInstalledComponentNames(join(tmpdir(), 'sanring-cli-diff-missing'), registry)).toEqual([]);
  });
});

describe('resolveDiffTargets', () => {
  it('diffs everything installed when no component names are requested', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-diff-'));
    try {
      mkdirSync(join(dir, 'badge'), { recursive: true });

      const { components, missing, notInstalled } = resolveDiffTargets([], dir, registry);
      expect(components.map((c) => c.name)).toEqual(['badge']);
      expect(missing).toEqual([]);
      expect(notInstalled).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reports a requested component that is not in the registry as missing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-diff-'));
    try {
      const { components, missing } = resolveDiffTargets(['nope'], dir, registry);
      expect(components).toEqual([]);
      expect(missing).toEqual(['nope']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reports a known component with no local directory as not installed', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-diff-'));
    try {
      const { components, notInstalled } = resolveDiffTargets(['button'], dir, registry);
      expect(components).toEqual([]);
      expect(notInstalled).toEqual(['button']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('only includes explicitly requested components that are actually installed', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-diff-'));
    try {
      mkdirSync(join(dir, 'badge'), { recursive: true });
      mkdirSync(join(dir, 'tag'), { recursive: true });

      const { components } = resolveDiffTargets(['badge'], dir, registry);
      expect(components.map((c) => c.name)).toEqual(['badge']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('printFileDiff', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports unchanged when local already matches remote', () => {
    expect(printFileDiff('button/index.ts', 'same', 'same')).toBe('unchanged');
  });

  it('reports auto when local matches the recorded baseline hash', () => {
    const baseline = hashContent('old content');
    expect(printFileDiff('button/index.ts', 'old content', 'new content', baseline)).toBe('auto');
  });

  it('reports conflict when local no longer matches the recorded baseline', () => {
    const baseline = hashContent('old content');
    expect(printFileDiff('button/index.ts', 'hand-edited', 'new content', baseline)).toBe('conflict');
  });

  it('reports conflict when there is no recorded baseline at all', () => {
    expect(printFileDiff('button/index.ts', 'local', 'remote')).toBe('conflict');
  });
});
