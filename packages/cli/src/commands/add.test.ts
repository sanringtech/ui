import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Registry, RegistryComponent, RegistryShared } from '../registry.js';
import { hashContent, readConfig, writeConfig } from '../utils.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import {
  addCommand,
  collectOverwriteCandidates,
  collectPeerDeps,
  parseComponentRef,
  resolveInstallSet,
} from './add.js';

function component(overrides: Partial<RegistryComponent> & { name: string }): RegistryComponent {
  return { description: '', files: [`${overrides.name}/index.ts`], ...overrides };
}

const registry: Registry = {
  name: 'test',
  shared: [],
  components: [
    component({ name: 'badge' }),
    component({ name: 'tag', componentDeps: ['badge'] }),
    component({ name: 'button' }),
    component({ name: 'select', componentDeps: ['listbox'] }),
    component({ name: 'listbox', componentDeps: ['select'] }), // cycle
  ],
};

describe('resolveInstallSet', () => {
  it('includes only the requested component when it has no dependencies', () => {
    const { toInstall, autoAdded, missing } = resolveInstallSet(['button'], registry);
    expect(toInstall.map((c) => c.name)).toEqual(['button']);
    expect(autoAdded).toEqual([]);
    expect(missing).toEqual([]);
  });

  it('pulls in componentDeps and marks them as auto-added', () => {
    const { toInstall, autoAdded, missing } = resolveInstallSet(['tag'], registry);
    expect(toInstall.map((c) => c.name)).toEqual(['tag', 'badge']);
    expect(autoAdded).toEqual(['badge']);
    expect(missing).toEqual([]);
  });

  it('does not mark a dependency as auto-added if it was also explicitly requested', () => {
    const { toInstall, autoAdded } = resolveInstallSet(['tag', 'badge'], registry);
    expect(toInstall.map((c) => c.name)).toEqual(['tag', 'badge']);
    expect(autoAdded).toEqual([]);
  });

  it('dedupes a shared dependency requested by multiple components', () => {
    const { toInstall, autoAdded } = resolveInstallSet(['tag', 'button'], registry);
    expect(toInstall.map((c) => c.name)).toEqual(['tag', 'button', 'badge']);
    expect(autoAdded).toEqual(['badge']);
  });

  it('reports unknown requested component names as missing', () => {
    const { toInstall, missing } = resolveInstallSet(['nope', 'button'], registry);
    expect(missing).toEqual(['nope']);
    expect(toInstall.map((c) => c.name)).toEqual(['button']);
  });

  it('does not infinite-loop on a componentDeps cycle', () => {
    const { toInstall, missing } = resolveInstallSet(['select'], registry);
    expect(toInstall.map((c) => c.name).sort()).toEqual(['listbox', 'select']);
    expect(missing).toEqual([]);
  });
});

describe('collectPeerDeps', () => {
  const shared: RegistryShared[] = [
    {
      name: 'utils',
      description: '',
      file: 'shared/utils.ts',
      peerDependencies: { clsx: '^2.0.0' },
    },
  ];

  it('merges peerDependencies across components and their sharedDeps', () => {
    const components: RegistryComponent[] = [
      component({
        name: 'a',
        peerDependencies: { '@angular/cdk': '^22.0.0' },
        sharedDeps: ['utils'],
      }),
      component({ name: 'b', peerDependencies: { '@lucide/angular': '^1.0.0' } }),
    ];
    expect(collectPeerDeps(components, shared)).toEqual({
      '@angular/cdk': '^22.0.0',
      '@lucide/angular': '^1.0.0',
      clsx: '^2.0.0',
    });
  });

  it('returns an empty object when nothing has peer dependencies', () => {
    expect(collectPeerDeps([component({ name: 'a' })], [])).toEqual({});
  });
});

describe('parseComponentRef', () => {
  it('has no alias when there is no colon', () => {
    expect(parseComponentRef('button')).toEqual({ name: 'button' });
  });

  it('splits alias from component name at the first colon', () => {
    expect(parseComponentRef('myteam:button')).toEqual({ alias: 'myteam', name: 'button' });
  });
});

describe('collectOverwriteCandidates', () => {
  const shared: RegistryShared[] = [
    { name: 'utils', description: '', file: 'shared/utils.ts' },
    { name: 'styles', description: '', file: 'shared/component-styles.ts' },
  ];

  it('returns existing shared and component files that force would overwrite', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-add-'));
    const componentBasePath = join(dir, 'components');
    const sharedDestDir = join(componentBasePath, 'shared');

    try {
      mkdirSync(sharedDestDir, { recursive: true });
      mkdirSync(join(componentBasePath, 'button'), { recursive: true });
      writeFileSync(join(sharedDestDir, 'utils.ts'), 'local utils', { flag: 'w' });
      writeFileSync(join(componentBasePath, 'button', 'index.ts'), 'local button', { flag: 'w' });

      const candidates = collectOverwriteCandidates(
        [
          component({ name: 'button', sharedDeps: ['utils', 'styles'] }),
          component({ name: 'badge' }),
        ],
        shared,
        componentBasePath,
        sharedDestDir,
      );

      expect(candidates.map((candidate) => candidate.label)).toEqual([
        'shared/utils.ts',
        'button/index.ts',
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns an empty list when target files do not exist', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-add-'));

    try {
      expect(
        collectOverwriteCandidates(
          [component({ name: 'button', sharedDeps: ['utils'] })],
          shared,
          join(dir, 'components'),
          join(dir, 'components', 'shared'),
        ),
      ).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('addCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-project-'));
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-registry-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
    });
    process.chdir(projectDir);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('writes component and shared files, and records their baseline hash', async () => {
    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });

    const componentFile = join(projectDir, 'src/app/components/ui/widget/index.ts');
    const sharedFile = join(projectDir, 'src/app/components/ui/shared/utils.ts');
    expect(existsSync(componentFile)).toBe(true);
    expect(existsSync(sharedFile)).toBe(true);
    expect(readFileSync(componentFile, 'utf-8')).toBe('export const widget = 1;\n');

    const config = readConfig(projectDir);
    expect(config?.componentPath).toBe('src/app/components/ui');
    expect(config?.installedHashes?.['widget/index.ts']).toBe(
      hashContent('export const widget = 1;\n'),
    );
    expect(config?.installedHashes?.['shared/utils.ts']).toBe(
      hashContent('export function cn() {}\n'),
    );
  });

  it('exits 1 with a clean error instead of an unhandled rejection when the registry is unreachable', async () => {
    const errors: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    const brokenRegistryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-add-broken-registry-'));

    await expect(
      addCommand.parseAsync(['widget', '--registry', brokenRegistryDir], { from: 'user' }),
    ).rejects.toThrow('process.exit');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errors.some((e) => e.includes('Cannot read registry at'))).toBe(true);

    rmSync(brokenRegistryDir, { recursive: true, force: true });
    exitSpy.mockRestore();
  });

  it('preserves registries/defaultRegistry from the existing config on write', async () => {
    writeConfig(projectDir, {
      componentPath: 'src/app/components/ui',
      registries: { myteam: 'https://registry.myteam.com' },
      defaultRegistry: 'myteam',
    });

    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });

    const config = readConfig(projectDir);
    expect(config?.registries).toEqual({ myteam: 'https://registry.myteam.com' });
    expect(config?.defaultRegistry).toBe('myteam');
  });

  it('resolves an unprefixed name through defaultRegistry and records the aliased key', async () => {
    writeConfig(projectDir, {
      componentPath: 'src/app/components/ui',
      registries: { myteam: registryDir },
      defaultRegistry: 'myteam',
    });

    // `addCommand` is a shared Command instance reused across tests in this
    // file — commander doesn't clear a flag's value between `parseAsync`
    // calls, so an earlier test's `--registry` would otherwise leak in and
    // mask the alias resolution this test means to exercise. Pass an empty
    // value explicitly to override it (falsy, so `resolveRegistrySource`
    // treats it the same as "flag not passed").
    await addCommand.parseAsync(['widget', '--registry', ''], { from: 'user' });

    const config = readConfig(projectDir);
    expect(config?.installedVersions?.['myteam:widget']).toBeDefined();
    expect(config?.installedVersions?.['widget']).toBeUndefined();
  });

  it('resolves an explicit alias:name ref and records the aliased key', async () => {
    writeConfig(projectDir, { componentPath: 'src/app/components/ui', registries: { myteam: registryDir } });

    await addCommand.parseAsync(['myteam:widget', '--registry', ''], { from: 'user' });

    const componentFile = join(projectDir, 'src/app/components/ui/widget/index.ts');
    expect(existsSync(componentFile)).toBe(true);

    const config = readConfig(projectDir);
    expect(config?.installedVersions?.['myteam:widget']).toBeDefined();
  });

  it('refuses to mix registries in a single add without writing anything', async () => {
    writeConfig(projectDir, {
      componentPath: 'src/app/components/ui',
      registries: { myteam: registryDir, other: registryDir },
    });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    await addCommand.parseAsync(['myteam:widget', 'other:widget'], { from: 'user' });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(existsSync(join(projectDir, 'src/app/components/ui/widget/index.ts'))).toBe(false);
  });

  it('writes shared files to --shared-path and persists that path', async () => {
    await addCommand.parseAsync(
      ['widget', '--registry', registryDir, '--shared-path', 'src/app/shared/sanring'],
      { from: 'user' },
    );

    const sharedFile = join(projectDir, 'src/app/shared/sanring/utils.ts');
    expect(existsSync(sharedFile)).toBe(true);

    const config = readConfig(projectDir);
    expect(config?.sharedPath).toBe('src/app/shared/sanring');
    expect(config?.installedHashes?.['shared/utils.ts']).toBe(
      hashContent('export function cn() {}\n'),
    );
  });

  it('skips an existing file instead of overwriting it without --force', async () => {
    const componentFile = join(projectDir, 'src/app/components/ui/widget/index.ts');
    mkdirSync(join(projectDir, 'src/app/components/ui/widget'), { recursive: true });
    writeFileSync(componentFile, 'hand-written before add ever ran\n', 'utf-8');

    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });

    expect(readFileSync(componentFile, 'utf-8')).toBe('hand-written before add ever ran\n');
  });

  it('prompts to update peer dependencies when the installed version spec differs', async () => {
    const logs: string[] = [];
    vi.mocked(console.log).mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    writeFileSync(
      join(projectDir, 'package.json'),
      JSON.stringify({ dependencies: { '@lucide/angular': '^1.0.0' } }),
      'utf-8',
    );
    const registryJsonPath = join(registryDir, 'registry.json');
    const registryJson = JSON.parse(readFileSync(registryJsonPath, 'utf-8')) as Registry;
    registryJson.components[0].peerDependencies = { '@lucide/angular': '^1.18.0' };
    writeFileSync(registryJsonPath, JSON.stringify(registryJson, null, 2), 'utf-8');

    await addCommand.parseAsync(['widget', '--registry', registryDir, '--dry-run'], {
      from: 'user',
    });

    expect(logs.some((line) => line.includes('Updating peer dependencies'))).toBe(true);
    expect(
      logs.some((line) => line.includes('Would install: npm install @lucide/angular@^1.18.0')),
    ).toBe(true);
  });

  it('does not update peer dependencies when the installed version spec already satisfies the minimum', async () => {
    const logs: string[] = [];
    vi.mocked(console.log).mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    writeFileSync(
      join(projectDir, 'package.json'),
      JSON.stringify({ dependencies: { '@lucide/angular': '^1.20.0' } }),
      'utf-8',
    );
    const registryJsonPath = join(registryDir, 'registry.json');
    const registryJson = JSON.parse(readFileSync(registryJsonPath, 'utf-8')) as Registry;
    registryJson.components[0].peerDependencies = { '@lucide/angular': '^1.18.0' };
    writeFileSync(registryJsonPath, JSON.stringify(registryJson, null, 2), 'utf-8');

    await addCommand.parseAsync(['widget', '--registry', registryDir, '--dry-run'], {
      from: 'user',
    });

    expect(logs.some((line) => line.includes('Already installed: @lucide/angular'))).toBe(true);
    expect(logs.some((line) => line.includes('Updating peer dependencies'))).toBe(false);
    expect(logs.some((line) => line.includes('Would install:'))).toBe(false);
  });
});
