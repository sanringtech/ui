import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getInstalledPackages, isAngularProject, readConfig, writeConfig } from './utils.js';

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
