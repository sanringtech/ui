import { describe, expect, it } from 'vitest';
import type { Registry, RegistryComponent } from '../registry.js';
import { planRemoval } from './remove.js';

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
    const plan = planRemoval(['button', 'select'], ['button'], registry);
    expect(plan.toRemove).toEqual(['button']);
    expect(plan.notInstalled).toEqual(['select']);
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
