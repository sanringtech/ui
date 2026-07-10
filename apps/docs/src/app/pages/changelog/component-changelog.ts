import { DocsComponentId } from '../../navigation/docs-navigation';

export type ComponentChangeType = 'added' | 'changed' | 'fixed';

export interface ComponentChange {
  type: ComponentChangeType;
  text: string;
  /** Component(s) this change touches. Drives the "Updated" section on the components page. */
  componentIds?: DocsComponentId[];
  /** Headline-worthy change (new component, breaking change). Renders with emphasis; omit for routine changes. */
  notable?: boolean;
}

export interface ComponentChangelogEntry {
  date: string;
  changes: ComponentChange[];
}

/**
 * @sanring/ui is excluded from Changesets (components are copied as source, not
 * published as a versioned package), so this list is maintained by hand.
 *
 * Conventions:
 * - Add a new entry at the top whenever a notable component change ships.
 * - Tag `componentIds` on every change that touches a specific component — the
 *   components page's "Updated" section is derived from the newest entry's tags.
 * - Keep each change to one sentence, one fact. Split multi-feature bullets rather
 *   than comma-joining them.
 * - Set `notable: true` only for new components or breaking changes; routine
 *   `fixed` changes are collapsed into a single summary line automatically.
 * - Wrap identifiers (selectors, inputs, CSS variables, attributes) in
 *   backticks — the changelog page renders backtick-delimited text as inline
 *   code instead of plain prose.
 */
export const componentChangelog: readonly ComponentChangelogEntry[] = [
  {
    date: '2026-07-10',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['combobox'],
        text: 'New Combobox component page — autocomplete input examples with single select, multiple chips, groups, keyboard navigation, and API guidance.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['carousel'],
        text: 'New Carousel component page — Embla-backed horizontal and vertical slide examples with API guidance.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['hover-card'],
        text: 'New Hover Card component page — hover and focus overlay examples with delay, placement, and API guidance.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['command'],
        text: 'New Command component page — searchable command list with groups, shortcuts, and an optional ⌘K / Ctrl K dialog wrapper.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['tree'],
        text: 'New Tree component page — expandable hierarchy examples with controlled expanded and selected state.',
      },
      {
        type: 'fixed',
        componentIds: ['sheet'],
        text: '`sanring-sheet-content` now portals through `Overlay`/`TemplatePortal` instead of an in-place `position: fixed` panel, restores focus to the trigger on close, and hides background content from assistive tech while open.',
      },
    ],
  },
  {
    date: '2026-07-07',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['input'],
        text: 'New Field composition — `SanringFieldComponent`, `FieldLabelDirective`, `ErrorMessageComponent`, and `DescriptionDirective` auto-wire `for`, `id`, and `aria-describedby` to any control implementing `SanringFieldControl`.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['input'],
        text: '`<sanring-field floating>` — floating label layout with an automatic background-matched border notch; no CDK or width measurement required.',
      },
      {
        type: 'added',
        componentIds: ['input'],
        text: '`InputDirective` now implements the full `SanringFieldControl` contract: `disabled`, `required` (native attribute or `Validators.required`), `aria-invalid`, `aria-required`, and `aria-describedby`.',
      },
    ],
  },
  {
    date: '2026-07-06',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['alert-dialog'],
        text: 'New Alert Dialog primitives — a Dialog variant that cannot be dismissed by backdrop click or Escape, with `sanringAlertDialogAction`/`sanringAlertDialogCancel` directives for confirm/cancel flows.',
      },
    ],
  },
  {
    date: '2026-07-05',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['timeline'],
        text: 'New Timeline primitives for chronological event lists with vertical and horizontal orientation support.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['stepper'],
        text: 'New Stepper primitives backed by Angular CDK Stepper, with template labels, custom icons, and solid or dashed connectors.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['slider'],
        text: 'New Slider component with pointer, keyboard, ARIA slider semantics, and Angular forms support.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['aspect-ratio'],
        text: 'New Aspect Ratio directive for responsive media boxes with CSS `aspect-ratio` support.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['textarea'],
        text: 'New Textarea directive split from `sanringInput` for native multiline form fields.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['table'],
        text: 'New Table primitives — `sanringTable`, column/cell defs, `sanringRow`, `sanringCaption`, and `sanringNoDataRow` — a headless composition layer over `@angular/cdk/table`.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['pagination'],
        text: 'New Pagination primitives plus a batteries-included `sanring-paginator` and `sanring-page-size-select`.',
      },
      {
        type: 'added',
        notable: true,
        componentIds: ['table'],
        text: '`sanringSort` / `sanringSortHeader` — a sort coordinator decoupled from any data source.',
      },
      {
        type: 'added',
        componentIds: ['table'],
        text: 'Table column `ratio` and `width` inputs for sizing, plus `sticky`/`stickyEnd` support.',
      },
      {
        type: 'fixed',
        componentIds: ['avatar'],
        text: '`Avatar`/`AvatarFallback` referenced an undefined `--sanring-muted-foreground` variable; now uses `--sanring-muted`.',
      },
      {
        type: 'fixed',
        componentIds: ['table'],
        text: 'Table no longer sets `role="grid"` on a non-interactive table — it overclaimed ARIA grid semantics; removed so CdkTable\'s own `role="table"`/`role="cell"` defaults apply.',
      },
    ],
  },
  {
    date: '2026-07-02',
    changes: [
      {
        type: 'added',
        componentIds: ['select'],
        text: 'Select primitives: groups, separators, item-aligned positioning, and `matchTriggerWidth` overlay sizing.',
      },
      {
        type: 'added',
        text: 'CLI documentation page, and a `--dry-run` flag for previewing file changes before writing.',
      },
      {
        type: 'fixed',
        componentIds: ['select'],
        text: '`sanring-select-content` overlay width went stale after the first open; now synced by the CDK connected overlay on every attach.',
      },
      {
        type: 'fixed',
        componentIds: ['select'],
        text: '`sanring-select-separator` was invisible (missing block display on an empty host element).',
      },
      {
        type: 'changed',
        text: 'Unified border-radius across docs pages onto the shared `--sanring-radius-*` design tokens.',
      },
    ],
  },
];

/**
 * Component ids touched by the newest changelog entry — feeds the "Updated"
 * section on the components page so it stays in sync with the changelog by
 * construction instead of a hand-maintained list.
 */
export function getRecentlyUpdatedComponentIds(): DocsComponentId[] {
  const latest = componentChangelog[0];
  if (!latest) return [];
  const ids = new Set<DocsComponentId>();
  for (const change of latest.changes) {
    for (const id of change.componentIds ?? []) ids.add(id);
  }
  return [...ids];
}

export function isRecentlyUpdatedComponentId(id: DocsComponentId): boolean {
  return getRecentlyUpdatedComponentIds().includes(id);
}

export function getRecentlyAddedComponentIds(): DocsComponentId[] {
  const latest = componentChangelog[0];
  if (!latest) return [];
  const ids = new Set<DocsComponentId>();
  for (const change of latest.changes) {
    if (change.type !== 'added' || !change.notable) continue;
    for (const id of change.componentIds ?? []) ids.add(id);
  }
  return [...ids];
}
