export type ComponentChangeType = 'added' | 'changed' | 'fixed';

export interface ComponentChange {
  type: ComponentChangeType;
  text: string;
}

export interface ComponentChangelogEntry {
  date: string;
  changes: ComponentChange[];
}

/**
 * @sanring/ui is excluded from Changesets (components are copied as source, not
 * published as a versioned package), so this list is maintained by hand.
 * Add a new entry at the top whenever a notable component change ships.
 */
export const componentChangelog: readonly ComponentChangelogEntry[] = [
  {
    date: '2026-07-02',
    changes: [
      { type: 'added', text: 'Select primitives: groups, separators, item-aligned positioning, and matchTriggerWidth overlay sizing.' },
      { type: 'added', text: 'CLI documentation page, and add --dry-run flag for previewing file changes before writing.' },
      { type: 'fixed', text: 'sanring-select-content overlay width no longer goes stale after the first open — now synced by the CDK connected overlay on every attach.' },
      { type: 'fixed', text: 'sanring-select-separator was invisible (missing block display on an empty host element).' },
      { type: 'changed', text: 'Unified border-radius across docs pages onto the shared --sanring-radius-* design tokens.' },
    ],
  },
];
