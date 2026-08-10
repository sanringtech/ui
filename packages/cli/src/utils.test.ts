import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getInstalledPackages,
  getInstalledPackageSpecs,
  fetchTextTargetsConcurrent,
  hashContent,
  isAngularProject,
  mapConcurrent,
  migrateInstalledVersionsKeys,
  readConfig,
  resolveRegistrySource,
  satisfiesMinimumPackageSpec,
  writeConfig,
} from './utils.js';

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'sanring-cli-test-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('isAngularProject', () => {
  it('is true when angular.json exists', () => {
    writeFileSync(join(dir, 'angular.json'), '{}');
    expect(isAngularProject(dir)).toBe(true);
  });

  it('is false when angular.json is missing', () => {
    expect(isAngularProject(dir)).toBe(false);
  });
});

describe('readConfig / writeConfig', () => {
  it('round-trips a config written by writeConfig', () => {
    writeConfig(dir, { componentPath: 'src/app/ui' });
    expect(readConfig(dir)).toEqual({ componentPath: 'src/app/ui' });
  });

  it('returns null when sanring.config.json does not exist', () => {
    expect(readConfig(dir)).toBeNull();
  });

  it('returns null when sanring.config.json is malformed', () => {
    writeFileSync(join(dir, 'sanring.config.json'), '{ not valid json');
    expect(readConfig(dir)).toBeNull();
  });
});

describe('resolveRegistrySource', () => {
  const config = {
    componentPath: 'src/app/ui',
    registries: { official: 'https://registry.sanring.dev', myteam: 'https://registry.myteam.com' },
    defaultRegistry: 'official',
  };

  it('prefers flagOverride over everything else', () => {
    expect(resolveRegistrySource('myteam', config, './local-path')).toBe('./local-path');
  });

  it('resolves an explicit alias against registries', () => {
    expect(resolveRegistrySource('myteam', config)).toBe('https://registry.myteam.com');
  });

  it('falls back to defaultRegistry when no alias is given', () => {
    expect(resolveRegistrySource(undefined, config)).toBe('https://registry.sanring.dev');
  });

  it('returns undefined when the alias is unknown', () => {
    expect(resolveRegistrySource('unknown', config)).toBeUndefined();
  });

  it('degrades silently to undefined when config has no registries', () => {
    expect(resolveRegistrySource(undefined, { componentPath: 'src/app/ui' })).toBeUndefined();
  });

  it('degrades silently to undefined when config is null', () => {
    expect(resolveRegistrySource(undefined, null)).toBeUndefined();
  });
});

describe('migrateInstalledVersionsKeys', () => {
  it('prefixes bare keys with defaultRegistry', () => {
    const config = {
      componentPath: 'src/app/ui',
      defaultRegistry: 'official',
      installedVersions: { button: '1.0.0' },
    };
    expect(migrateInstalledVersionsKeys(config).installedVersions).toEqual({
      'official:button': '1.0.0',
    });
  });

  it('leaves already-prefixed keys untouched', () => {
    const config = {
      componentPath: 'src/app/ui',
      defaultRegistry: 'official',
      installedVersions: { 'myteam:button': '1.0.0' },
    };
    expect(migrateInstalledVersionsKeys(config).installedVersions).toEqual({
      'myteam:button': '1.0.0',
    });
  });

  it('leaves bare keys untouched when defaultRegistry is not set', () => {
    const config = { componentPath: 'src/app/ui', installedVersions: { button: '1.0.0' } };
    expect(migrateInstalledVersionsKeys(config)).toBe(config);
  });

  it('is a no-op when installedVersions is missing', () => {
    const config = { componentPath: 'src/app/ui', defaultRegistry: 'official' };
    expect(migrateInstalledVersionsKeys(config)).toBe(config);
  });
});

describe('getInstalledPackages', () => {
  it('merges dependencies, devDependencies, and peerDependencies', () => {
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({
        dependencies: { a: '1.0.0' },
        devDependencies: { b: '1.0.0' },
        peerDependencies: { c: '1.0.0' },
      }),
    );
    const installed = getInstalledPackages(dir);
    expect(installed).toEqual(new Set(['a', 'b', 'c']));
  });

  it('returns an empty set when package.json does not exist', () => {
    expect(getInstalledPackages(dir)).toEqual(new Set());
  });

  it('returns an empty set when package.json is malformed', () => {
    writeFileSync(join(dir, 'package.json'), '{ not valid json');
    expect(getInstalledPackages(dir)).toEqual(new Set());
  });
});

describe('getInstalledPackageSpecs', () => {
  it('keeps installed package version specs', () => {
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({
        dependencies: { a: '^1.0.0' },
        devDependencies: { b: '~2.0.0' },
        peerDependencies: { c: '>=3.0.0' },
      }),
    );

    expect(getInstalledPackageSpecs(dir)).toEqual(
      new Map([
        ['a', '^1.0.0'],
        ['b', '~2.0.0'],
        ['c', '>=3.0.0'],
      ]),
    );
  });
});

describe('satisfiesMinimumPackageSpec', () => {
  it('accepts the same version spec', () => {
    expect(satisfiesMinimumPackageSpec('^1.18.0', '^1.18.0')).toBe(true);
  });

  it('accepts newer compatible caret ranges', () => {
    expect(satisfiesMinimumPackageSpec('^1.20.0', '^1.18.0')).toBe(true);
  });

  it('rejects older caret ranges', () => {
    expect(satisfiesMinimumPackageSpec('^1.0.0', '^1.18.0')).toBe(false);
  });

  it('rejects incompatible major versions for caret ranges', () => {
    expect(satisfiesMinimumPackageSpec('^2.0.0', '^1.18.0')).toBe(false);
  });
});

describe('hashContent', () => {
  it('is deterministic for identical content', () => {
    expect(hashContent('const a = 1;')).toBe(hashContent('const a = 1;'));
  });

  it('differs for different content', () => {
    expect(hashContent('const a = 1;')).not.toBe(hashContent('const a = 2;'));
  });
});

describe('mapConcurrent', () => {
  it('preserves input order while limiting parallel work', async () => {
    let active = 0;
    let maxActive = 0;

    const result = await mapConcurrent([1, 2, 3, 4], 2, async (item) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await Promise.resolve();
      active--;
      return item * 2;
    });

    expect(result).toEqual([2, 4, 6, 8]);
    expect(maxActive).toBeLessThanOrEqual(2);
  });
});

describe('fetchTextTargetsConcurrent', () => {
  it('fetches text targets concurrently with a limit and preserves order', async () => {
    let active = 0;
    let maxActive = 0;

    const result = await fetchTextTargetsConcurrent(
      [
        { remotePath: 'a.ts', label: 'a' },
        { remotePath: 'b.ts', label: 'b' },
        { remotePath: 'c.ts', label: 'c' },
        { remotePath: 'd.ts', label: 'd' },
      ],
      2,
      async (remotePath) => {
        active++;
        maxActive = Math.max(maxActive, active);
        await Promise.resolve();
        active--;
        return `content:${remotePath}`;
      },
    );

    expect(result.map((item) => item.ok && item.content)).toEqual([
      'content:a.ts',
      'content:b.ts',
      'content:c.ts',
      'content:d.ts',
    ]);
    expect(maxActive).toBeGreaterThan(1);
    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it('keeps failed text fetches in their original result slot', async () => {
    const result = await fetchTextTargetsConcurrent(
      [{ remotePath: 'a.ts' }, { remotePath: 'missing.ts' }, { remotePath: 'c.ts' }],
      2,
      async (remotePath) => {
        if (remotePath === 'missing.ts') throw new Error('not found');
        return remotePath;
      },
    );

    expect(result[0].ok).toBe(true);
    expect(result[1].ok).toBe(false);
    expect(result[2].ok).toBe(true);
  });
});
