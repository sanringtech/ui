import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  canonicalizePeerDependencies,
  canonicalizePackageName,
  classifyModuleSpecifier,
  classifyModuleSpecifiers,
  discoverComponentSources,
  discoverSharedSources,
  extractDescription,
  filterBaselinePackages,
  resolvePeerDependencyVersion,
  validateReferencedTargets,
} from './registry-scan.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
// packages/cli/src -> packages/cli -> packages -> repo root
const REPO_ROOT = join(__dirname, '../../..');
const REGISTRY_COMPONENTS_DIR = join(REPO_ROOT, 'registry/components');

describe('discoverComponentSources', () => {
  const found = discoverComponentSources(REGISTRY_COMPONENTS_DIR);

  it('finds every component subdirectory, excluding "shared"', () => {
    const names = found.map((c) => c.name);
    expect(names).toContain('tag');
    expect(names).toContain('calendar');
    expect(names).toContain('combobox');
    expect(names).not.toContain('shared');
  });

  it('collects only .ts files for a component, no spec/test/stories files', () => {
    const tag = found.find((c) => c.name === 'tag')!;
    expect(tag.files.every((f) => f.endsWith('.ts'))).toBe(true);
    expect(tag.files.some((f) => f.endsWith('tag.component.ts'))).toBe(true);
    expect(tag.files.every((f) => !/\.(spec|test|stories|cy)\.ts$/.test(f))).toBe(true);
  });
});

describe('discoverSharedSources', () => {
  const found = discoverSharedSources(REGISTRY_COMPONENTS_DIR);

  it('finds shared .ts files from the sibling shared/ directory', () => {
    const names = found.map((s) => s.name);
    expect(names).toContain('utils');
    expect(names).toContain('component-styles');
  });

  it('excludes non-.ts files (e.g. theme.css, theme-presets/)', () => {
    const names = found.map((s) => s.name);
    expect(names).not.toContain('theme');
    expect(names.every((n) => !n.includes('.'))).toBe(true);
  });

  it('returns [] when there is no shared/ directory, instead of throwing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-registry-scan-'));
    const componentsDir = join(dir, 'components');
    mkdirSync(componentsDir, { recursive: true });
    try {
      expect(discoverSharedSources(componentsDir)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('classifyModuleSpecifier', () => {
  it('classifies a shared import', () => {
    expect(classifyModuleSpecifier('../shared/utils')).toEqual({ kind: 'sharedDep', name: 'utils' });
  });

  it('classifies a nested shared import by its first path segment', () => {
    expect(classifyModuleSpecifier('../shared/component-styles')).toEqual({
      kind: 'sharedDep',
      name: 'component-styles',
    });
  });

  it('classifies a component import', () => {
    expect(classifyModuleSpecifier('../badge')).toEqual({ kind: 'componentDep', name: 'badge' });
  });

  it('classifies a component import via a nested file as the directory name', () => {
    expect(classifyModuleSpecifier('../field/field.type')).toEqual({
      kind: 'componentDep',
      name: 'field',
    });
  });

  it('classifies a same-directory import as internal', () => {
    expect(classifyModuleSpecifier('./tag.styles')).toEqual({ kind: 'internal' });
  });

  it('classifies a bare package specifier as a peerDependency candidate', () => {
    expect(classifyModuleSpecifier('@angular/cdk/overlay')).toEqual({
      kind: 'peerDependencyCandidate',
      specifier: '@angular/cdk/overlay',
    });
  });
});

describe('classifyModuleSpecifiers', () => {
  it('classifies every import/export in a real registry component file', () => {
    const content = readFileSync(join(REGISTRY_COMPONENTS_DIR, 'tag/tag.component.ts'), 'utf-8');
    const classifications = classifyModuleSpecifiers(content);

    expect(classifications).toContainEqual({ kind: 'sharedDep', name: 'utils' });
    expect(classifications).toContainEqual({ kind: 'componentDep', name: 'badge' });
    expect(classifications).toContainEqual({
      kind: 'peerDependencyCandidate',
      specifier: '@lucide/angular',
    });
    expect(classifications).toContainEqual({
      kind: 'peerDependencyCandidate',
      specifier: '@angular/core',
    });
    expect(classifications).toContainEqual({ kind: 'internal' });
  });

  it('classifies calendar.component.ts peerDependency candidates', () => {
    const content = readFileSync(
      join(REGISTRY_COMPONENTS_DIR, 'calendar/calendar.component.ts'),
      'utf-8',
    );
    const specifiers = classifyModuleSpecifiers(content)
      .filter((c) => c.kind === 'peerDependencyCandidate')
      .map((c) => c.specifier);

    expect(specifiers).toContain('@angular/cdk/a11y');
    expect(specifiers).toContain('@angular/forms');
  });
});

describe('filterBaselinePackages', () => {
  it('drops exact baseline matches and keeps everything else', () => {
    const result = filterBaselinePackages([
      { kind: 'peerDependencyCandidate', specifier: '@angular/core' },
      { kind: 'peerDependencyCandidate', specifier: 'rxjs' },
      { kind: 'peerDependencyCandidate', specifier: '@angular/cdk/overlay' },
    ]);
    expect(result).toEqual(['@angular/cdk/overlay']);
  });

  it('excludes any submodule of a baseline package, not just the bare import', () => {
    const result = filterBaselinePackages([
      { kind: 'peerDependencyCandidate', specifier: '@angular/core/testing' },
      { kind: 'peerDependencyCandidate', specifier: 'rxjs/operators' },
      { kind: 'peerDependencyCandidate', specifier: '@angular/cdk/overlay' },
    ]);
    expect(result).toEqual(['@angular/cdk/overlay']);
  });
});

describe('validateReferencedTargets', () => {
  const knownComponents = new Set(['badge', 'field']);
  const knownShared = new Set(['utils', 'component-styles']);

  it('keeps candidates that resolve to a known target', () => {
    const result = validateReferencedTargets(['badge'], ['utils'], knownComponents, knownShared);
    expect(result.componentDeps).toEqual(['badge']);
    expect(result.sharedDeps).toEqual(['utils']);
    expect(result.droppedComponentDeps).toEqual([]);
    expect(result.droppedSharedDeps).toEqual([]);
  });

  it('drops candidates with no matching discovered target', () => {
    const result = validateReferencedTargets(
      ['badge', 'nonexistent'],
      ['utils', 'also-missing'],
      knownComponents,
      knownShared,
    );
    expect(result.componentDeps).toEqual(['badge']);
    expect(result.droppedComponentDeps).toEqual(['nonexistent']);
    expect(result.sharedDeps).toEqual(['utils']);
    expect(result.droppedSharedDeps).toEqual(['also-missing']);
  });

  it('deduplicates repeated candidates', () => {
    const result = validateReferencedTargets(['badge', 'badge'], [], knownComponents, knownShared);
    expect(result.componentDeps).toEqual(['badge']);
  });
});

describe('extractDescription', () => {
  it('takes the first line of a /** */ comment directly above @Component', () => {
    const content = `
import { Component } from '@angular/core';

/**
 * A dual-list control for moving items between two panes.
 * Extra detail on a second line, ignored.
 */
@Component({ selector: 'app-widget' })
export class WidgetComponent {}
`;
    expect(extractDescription(content)).toBe('A dual-list control for moving items between two panes.');
  });

  it('returns an empty string when there is no comment above @Component', () => {
    const content = `
import { Component } from '@angular/core';

@Component({ selector: 'app-widget' })
export class WidgetComponent {}
`;
    expect(extractDescription(content)).toBe('');
  });

  it('returns an empty string when the class has no @Component decorator', () => {
    const content = `
export class PlainClass {}
`;
    expect(extractDescription(content)).toBe('');
  });

  it('matches this repo\'s own components having no leading comment (they use hand-written registry.json prose instead)', () => {
    const content = readFileSync(join(REGISTRY_COMPONENTS_DIR, 'tag/tag.component.ts'), 'utf-8');
    expect(extractDescription(content)).toBe('');
  });
});

describe('canonicalizePackageName', () => {
  it('takes the first two segments of a scoped package', () => {
    expect(canonicalizePackageName('@angular/cdk/overlay')).toBe('@angular/cdk');
  });

  it('takes the first segment of an unscoped package', () => {
    expect(canonicalizePackageName('embla-carousel/foo')).toBe('embla-carousel');
  });

  it('leaves a bare scoped or unscoped package unchanged', () => {
    expect(canonicalizePackageName('@lucide/angular')).toBe('@lucide/angular');
    expect(canonicalizePackageName('rxjs')).toBe('rxjs');
  });
});

describe('canonicalizePeerDependencies', () => {
  it('canonicalizes and deduplicates submodule imports from the same package', () => {
    expect(canonicalizePeerDependencies(['@angular/cdk/overlay', '@angular/cdk/a11y'])).toEqual(['@angular/cdk']);
  });

  it('returns all packages sorted, including ones also declared by componentDeps', () => {
    const result = canonicalizePeerDependencies([
      '@lucide/angular', '@sanring/date-picker-core', '@angular/cdk/a11y', '@angular/forms',
    ]);
    expect(result).toEqual(['@angular/cdk', '@angular/forms', '@lucide/angular', '@sanring/date-picker-core']);
  });

  it('returns [] for an empty input', () => {
    expect(canonicalizePeerDependencies([])).toEqual([]);
  });
});

describe('resolvePeerDependencyVersion', () => {
  it('resolves from dependencies first', () => {
    const pkg = { dependencies: { '@angular/cdk': '^22.0.0' }, peerDependencies: { '@angular/cdk': '^1.0.0' } };
    expect(resolvePeerDependencyVersion('@angular/cdk', pkg)).toEqual({
      resolved: true,
      version: '^22.0.0',
    });
  });

  it('falls back to devDependencies, then peerDependencies', () => {
    expect(
      resolvePeerDependencyVersion('a', { devDependencies: { a: '1.0.0' } }),
    ).toEqual({ resolved: true, version: '1.0.0' });
    expect(
      resolvePeerDependencyVersion('b', { peerDependencies: { b: '2.0.0' } }),
    ).toEqual({ resolved: true, version: '2.0.0' });
  });

  it('returns resolved: false when the package is nowhere in package.json', () => {
    expect(resolvePeerDependencyVersion('missing-pkg', { dependencies: {} })).toEqual({
      resolved: false,
      packageName: 'missing-pkg',
    });
  });

  it('returns resolved: false when there is no package.json at all', () => {
    expect(resolvePeerDependencyVersion('missing-pkg', null)).toEqual({
      resolved: false,
      packageName: 'missing-pkg',
    });
  });
});

