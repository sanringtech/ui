import { describe, expect, it } from 'vitest';
import type { Registry, RegistryComponent, RegistryShared } from '../registry.js';
import { collectPeerDeps, resolveInstallSet } from './add.js';

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
    { name: 'utils', description: '', file: 'shared/utils.ts', peerDependencies: { clsx: '^2.0.0' } },
  ];

  it('merges peerDependencies across components and their sharedDeps', () => {
    const components: RegistryComponent[] = [
      component({ name: 'a', peerDependencies: { '@angular/cdk': '^22.0.0' }, sharedDeps: ['utils'] }),
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
