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
    date: '2026-07-05',
    changes: [
      { type: 'added', text: 'Table primitive set: sanringTable/sanringColumnDef/sanringCellDef family, sanringRow, sanringCaption, sanringNoDataRow, and TableContainerComponent — a thin, headless-composition layer over @angular/cdk/table.' },
      { type: 'added', text: 'Table column width ratios (ratio input, flex-grow-like proportional sizing) and fixed-width columns (width input), auto-toggling table-layout: fixed only when used.' },
      { type: 'added', text: 'Table column and row sticky support (sticky / stickyEnd forwarded from CdkColumnDef).' },
      { type: 'added', text: 'sanringSort / sanringSortHeader — column sort coordinator plus a sortable <th>, decoupled from any data source; app code owns the actual sort.' },
      { type: 'added', text: 'Pagination primitives (sanring-pagination, sanring-pagination-list, sanringPaginationNav, sanringPaginationItem) and a batteries-included sanring-paginator + sanring-page-size-select, independent of Table.' },
      { type: 'fixed', text: 'Avatar and AvatarFallback fallback text referenced an undefined --sanring-muted-foreground CSS variable; now uses --sanring-muted.' },
      { type: 'fixed', text: 'Table role=grid on a non-interactive table incorrectly overclaimed ARIA grid semantics; removed so CdkTable applies its own role=table/cell defaults.' },
    ],
  },
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
