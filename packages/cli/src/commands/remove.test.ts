import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Registry, RegistryComponent } from '../registry.js';
import { readConfig, writeConfig } from '../utils.js';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { addCommand } from './add.js';
import { planRemoval, removeCommand } from './remove.js';

function component(overrides: Partial<RegistryComponent> & { name: string }): RegistryComponent {
  return { description: '', files: [`${overrides.name}/index.ts`], ...overrides };
}

const registry: Registry = {
  name: 'test',
  shared: [
    { name: 'utils', description: '', file: 'shared/utils.ts' },
    { name: 'collection-controller', description: '', file: 'shared/collection-controller.ts' },
  ],
  components: [
    component({ name: 'badge', sharedDeps: ['utils'] }),
    component({ name: 'tag', componentDeps: ['badge'], sharedDeps: ['utils'] }),
    component({ name: 'button', sharedDeps: ['utils'] }),
    component({ name: 'combobox', sharedDeps: ['utils', 'collection-controller'] }),
  ],
};

describe('planRemoval', () => {
  it('removes a component with no dependents', () => {
    const plan = planRemoval(['button'], ['button', 'badge'], registry);
    expect(plan.toRemove).toEqual(['button']);
    expect(plan.notInstalled).toEqual([]);
    expect(plan.blockedBy.size).toBe(0);
  });

  it('reports requested-but-not-installed components separately', () => {
    const plan = planRemoval(['button', 'combobox'], ['button'], registry);
    expect(plan.toRemove).toEqual(['button']);
    expect(plan.notInstalled).toEqual(['combobox']);
    expect(plan.unknown).toEqual([]);
  });

  it('reports components not present in the registry as unknown, not notInstalled', () => {
    const plan = planRemoval(['button', 'select'], ['button'], registry);
    expect(plan.toRemove).toEqual(['button']);
    expect(plan.notInstalled).toEqual([]);
    expect(plan.unknown).toEqual(['select']);
  });

  it('blocks removal when a remaining installed component still depends on it', () => {
    const plan = planRemoval(['badge'], ['badge', 'tag'], registry);
    expect(plan.toRemove).toEqual(['badge']);
    expect(plan.blockedBy.get('badge')).toEqual(['tag']);
  });

  it('does not block when the dependent is being removed in the same call', () => {
    const plan = planRemoval(['badge', 'tag'], ['badge', 'tag'], registry);
    expect(plan.blockedBy.size).toBe(0);
  });

  it('flags a shared dep as possibly-unused only when no remaining component needs it', () => {
    const plan = planRemoval(['combobox'], ['combobox', 'button'], registry);
    // 'utils' is still needed by button, but collection-controller was only for combobox.
    expect(plan.possiblyUnusedShared).toEqual(['collection-controller']);
  });

  it('does not flag a shared dep still used by a remaining component', () => {
    const plan = planRemoval(['badge'], ['badge', 'button'], registry);
    expect(plan.possiblyUnusedShared).toEqual([]);
  });
});

describe('removeCommand (integration)', () => {
  let projectDir: string;
  let registryDir: string;
  let originalCwd: string;

  beforeEach(async () => {
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

    await addCommand.parseAsync(['widget', '--registry', registryDir], { from: 'user' });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('prunes the removed component baseline hashes but keeps shared ones', async () => {
    expect(readConfig(projectDir)?.installedHashes?.['widget/index.ts']).toBeDefined();

    await removeCommand.parseAsync(['widget', '--registry', registryDir, '--yes'], { from: 'user' });

    const config = readConfig(projectDir);
    expect(config?.installedHashes?.['widget/index.ts']).toBeUndefined();
    expect(config?.installedHashes?.['shared/utils.ts']).toBeDefined();
  });

  it('exits 0 when a mixed batch has a known-but-not-installed target alongside a removable one', async () => {
    // Register a second component in the registry that's never installed in
    // this project, so it's a real (known) target that's just not present.
    const registryPath = join(registryDir, 'registry.json');
    const fixtureRegistry: Registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
    fixtureRegistry.components.push({ name: 'gizmo', description: '', files: ['gizmo/index.ts'] });
    writeFileSync(registryPath, JSON.stringify(fixtureRegistry, null, 2), 'utf-8');

    await removeCommand.parseAsync(['widget', 'gizmo', '--registry', registryDir, '--yes'], {
      from: 'user',
    });

    expect(readConfig(projectDir)?.installedHashes?.['widget/index.ts']).toBeUndefined();
  });

  it('exits 1 and removes nothing when the batch includes an unknown component', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    const errors: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      errors.push(args.join(' '));
    });

    await expect(
      removeCommand.parseAsync(['widget', 'does-not-exist', '--registry', registryDir, '--yes'], {
        from: 'user',
      }),
    ).rejects.toThrow('process.exit');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errors.some((e) => e.includes('Unknown component: does-not-exist'))).toBe(true);
    // Nothing should have been removed — the unknown-target check runs before any deletion.
    expect(readConfig(projectDir)?.installedHashes?.['widget/index.ts']).toBeDefined();

    exitSpy.mockRestore();
  });

  it('preserves registries/defaultRegistry from the existing config on write', async () => {
    const existing = readConfig(projectDir)!;
    writeConfig(projectDir, {
      ...existing,
      registries: { myteam: 'https://registry.myteam.com' },
      defaultRegistry: 'myteam',
    });

    await removeCommand.parseAsync(['widget', '--registry', registryDir, '--yes'], { from: 'user' });

    const config = readConfig(projectDir);
    expect(config?.registries).toEqual({ myteam: 'https://registry.myteam.com' });
    expect(config?.defaultRegistry).toBe('myteam');
  });
});
