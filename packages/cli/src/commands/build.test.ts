import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Registry } from '../registry.js';
import { buildCommand } from './build.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
// packages/cli/src/commands -> packages/cli/src -> packages/cli -> packages -> repo root
const REPO_ROOT = join(__dirname, '../../../..');
const REGISTRY_COMPONENTS_DIR = join(REPO_ROOT, 'registry/components');
const REGISTRY_JSON_PATH = join(REPO_ROOT, 'registry/registry.json');

describe('buildCommand (integration)', () => {
  let cwd: string;
  let outDir: string;
  let originalCwd: string;
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalCwd = process.cwd();
    cwd = mkdtempSync(join(tmpdir(), 'sanring-build-cwd-'));
    outDir = join(cwd, 'dist-registry');
    process.chdir(cwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    // `buildCommand` is a shared Command instance reused across every test
    // in this file — commander only sets an option's value when its flag is
    // actually present on argv (see `addOption`'s `option:<name>` handler in
    // commander's own source), and never resets it back to default when a
    // later `parseAsync` call omits that flag. Without this, e.g. a prior
    // test's `--dry-run` or `--name` silently leaks into every later test
    // that doesn't pass those flags itself.
    buildCommand.setOptionValue('source', './components');
    buildCommand.setOptionValue('out', './dist-registry');
    buildCommand.setOptionValue('name', undefined);
    buildCommand.setOptionValue('dryRun', false);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(cwd, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  function writeMinimalSource(): string {
    const sourceDir = join(cwd, 'components');
    mkdirSync(join(sourceDir, 'widget'), { recursive: true });
    mkdirSync(join(cwd, 'shared'), { recursive: true });
    writeFileSync(join(cwd, 'shared', 'utils.ts'), 'export function cn() {}\n', 'utf-8');
    writeFileSync(
      join(sourceDir, 'widget', 'widget.component.ts'),
      [
        "import { Component } from '@angular/core';",
        "import { LucideX } from '@lucide/angular';",
        "import { cn } from '../shared/utils';",
        '',
        '/**',
        ' * A minimal test widget.',
        ' */',
        "@Component({ selector: 'app-widget' })",
        'export class WidgetComponent {}',
        '',
      ].join('\n'),
      'utf-8',
    );
    return sourceDir;
  }

  it('writes registry.json and copies component/shared files', async () => {
    const sourceDir = writeMinimalSource();
    writeFileSync(
      join(cwd, 'package.json'),
      JSON.stringify({ name: 'test-registry', dependencies: { '@lucide/angular': '^1.18.0' } }),
      'utf-8',
    );

    await buildCommand.parseAsync(['--source', sourceDir, '--out', outDir], { from: 'user' });

    expect(exitSpy).not.toHaveBeenCalled();
    const registry = JSON.parse(readFileSync(join(outDir, 'registry.json'), 'utf-8')) as Registry;
    expect(registry.name).toBe('test-registry');
    expect(registry.components).toHaveLength(1);
    expect(registry.components[0]).toMatchObject({
      name: 'widget',
      description: 'A minimal test widget.',
      sharedDeps: ['utils'],
      peerDependencies: { '@lucide/angular': '^1.18.0' },
      files: ['widget/widget.component.ts'],
    });
    expect(registry.shared).toEqual([
      { name: 'utils', description: '', file: 'shared/utils.ts' },
    ]);
    expect(existsSync(join(outDir, 'components/widget/widget.component.ts'))).toBe(true);
    expect(existsSync(join(outDir, 'shared/utils.ts'))).toBe(true);
  });

  it('--dry-run prints a preview but writes nothing', async () => {
    const sourceDir = writeMinimalSource();
    writeFileSync(
      join(cwd, 'package.json'),
      JSON.stringify({ name: 'test-registry', dependencies: { '@lucide/angular': '^1.18.0' } }),
      'utf-8',
    );

    await buildCommand.parseAsync(['--source', sourceDir, '--out', outDir, '--dry-run'], { from: 'user' });

    expect(exitSpy).not.toHaveBeenCalled();
    expect(existsSync(outDir)).toBe(false);
  });

  it('fails without writing when a peerDependency version cannot be resolved', async () => {
    const sourceDir = writeMinimalSource();
    // No package.json at all -> nothing can resolve @lucide/angular's version.

    await buildCommand.parseAsync(['--source', sourceDir, '--out', outDir, '--name', 'test-registry'], {
      from: 'user',
    });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(existsSync(outDir)).toBe(false);
  });

  it('fails without writing when --source does not exist', async () => {
    await buildCommand.parseAsync(['--source', join(cwd, 'nope'), '--out', outDir, '--name', 'x'], {
      from: 'user',
    });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(existsSync(outDir)).toBe(false);
  });

  it('fails without writing when no --name is given and package.json has none', async () => {
    const sourceDir = writeMinimalSource();
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({}), 'utf-8');

    await buildCommand.parseAsync(['--source', sourceDir, '--out', outDir], { from: 'user' });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(existsSync(outDir)).toBe(false);
  });

  it('fails validateRegistry and does not write when package.json "name" is not a string', async () => {
    const sourceDir = writeMinimalSource();
    writeFileSync(
      join(cwd, 'package.json'),
      JSON.stringify({ name: 12345, dependencies: { '@lucide/angular': '^1.18.0' } }),
      'utf-8',
    );

    await buildCommand.parseAsync(['--source', sourceDir, '--out', outDir], { from: 'user' });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(existsSync(outDir)).toBe(false);
  });

  // Reproduces the charter's batch C verification requirement: run the real
  // scanner over this repo's own registry/components + registry/shared and
  // diff the output against the hand-maintained registry.json.
  // P9 batch B (peerDep transitive dedup) was dropped — see DEVLOG P9 — and
  // P24 bugs (transfer imports, accordion/collapsible/navigation-menu peerDeps,
  // component-styles over-declarations) were fixed alongside, so this test
  // now runs against the corrected registry.json with no known mismatches.
  it('golden fixture: scanner output matches registry.json', async () => {
    const registryPackageJson = {
      name: 'golden-fixture-registry',
      dependencies: {
        '@angular/aria': '^22.0.0',
        '@angular/cdk': '^22.0.0',
        '@angular/forms': '^22.0.0',
        '@angular/router': '^22.0.0',
        '@lucide/angular': '^1.18.0',
        '@sanring/date-picker-core': '^0.5.0',
        clsx: '^2.0.0',
        'embla-carousel': '^8.6.0',
        'tailwind-merge': '^3.0.0',
      },
    };
    writeFileSync(join(cwd, 'package.json'), JSON.stringify(registryPackageJson), 'utf-8');

    await buildCommand.parseAsync(
      ['--source', REGISTRY_COMPONENTS_DIR, '--out', outDir, '--name', 'golden-fixture'],
      { from: 'user' },
    );

    expect(exitSpy).not.toHaveBeenCalled();
    const generated = JSON.parse(readFileSync(join(outDir, 'registry.json'), 'utf-8')) as Registry;
    const handWritten = JSON.parse(readFileSync(REGISTRY_JSON_PATH, 'utf-8')) as Registry;
    const handByName = new Map(handWritten.components.map((c) => [c.name, c]));

    const KNOWN_MISMATCHES: Record<string, { componentDeps?: true; sharedDeps?: true; peerDependencies?: true }> = {};

    const unexpectedDiffs: string[] = [];

    for (const generatedComponent of generated.components) {
      const handComponent = handByName.get(generatedComponent.name);
      if (!handComponent) {
        unexpectedDiffs.push(`${generatedComponent.name}: not in hand-written registry.json`);
        continue;
      }
      const allowed = KNOWN_MISMATCHES[generatedComponent.name] ?? {};

      const genComponentDeps = [...(generatedComponent.componentDeps ?? [])].sort();
      const handComponentDeps = [...(handComponent.componentDeps ?? [])].sort();
      if (!allowed.componentDeps && JSON.stringify(genComponentDeps) !== JSON.stringify(handComponentDeps)) {
        unexpectedDiffs.push(
          `${generatedComponent.name}.componentDeps: generated=${JSON.stringify(genComponentDeps)} hand=${JSON.stringify(handComponentDeps)}`,
        );
      }

      const genSharedDeps = [...(generatedComponent.sharedDeps ?? [])].sort();
      const handSharedDeps = [...(handComponent.sharedDeps ?? [])].sort();
      if (!allowed.sharedDeps && JSON.stringify(genSharedDeps) !== JSON.stringify(handSharedDeps)) {
        unexpectedDiffs.push(
          `${generatedComponent.name}.sharedDeps: generated=${JSON.stringify(genSharedDeps)} hand=${JSON.stringify(handSharedDeps)}`,
        );
      }

      const genPeerDeps = Object.keys(generatedComponent.peerDependencies ?? {}).sort();
      const handPeerDeps = Object.keys(handComponent.peerDependencies ?? {}).sort();
      if (!allowed.peerDependencies && JSON.stringify(genPeerDeps) !== JSON.stringify(handPeerDeps)) {
        unexpectedDiffs.push(
          `${generatedComponent.name}.peerDependencies: generated=${JSON.stringify(genPeerDeps)} hand=${JSON.stringify(handPeerDeps)}`,
        );
      }
    }

    expect(unexpectedDiffs).toEqual([]);
  });
});
