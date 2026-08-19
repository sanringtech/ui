import { DocsComponentId } from '../../navigation/docs-navigation';

export type ComponentChangeType = 'added' | 'changed' | 'fixed';

export interface ComponentChange {
  type: ComponentChangeType;
  text: string;
  /** Component(s) this change touches. Drives the "Updated" section on the components page. */
  componentIds?: DocsComponentId[];
  /** Headline-worthy change (new component, breaking change). Shown by default; non-notable entries collapse. */
  notable?: boolean;
  /** Marks a breaking change — renders a red BREAKING badge in the changelog and is referenced by `sanring migrate`. */
  breaking?: boolean;
}

export interface CliVersionEntry {
  /** Semver string, e.g. "0.19.0" */
  version: string;
  date: string;
  changes: ComponentChange[];
}

function isPatch(version: string): boolean {
  return version.split('.')[2] !== '0';
}

/**
 * @sanring/cli release history, newest first.
 *
 * Conventions:
 * - Each entry maps to one npm release of @sanring/cli.
 * - `notable: true` marks new components or significant new CLI commands.
 * - `componentIds` tags any change affecting a specific component —
 *   used to drive the "Updated" badge on the components list.
 * - Keep each change to one sentence. Wrap identifiers in backticks.
 */
export const cliVersionChangelog: readonly CliVersionEntry[] = [
  {
    version: '0.23.3',
    date: '2026-08-19',
    changes: [
      {
        type: 'fixed',
        componentIds: ['button'],
        text: '`sanringBtn` on a hrefless `<a>` had no `tabindex` or keyboard handler outside the disabled state, making it unreachable by keyboard.',
      },
      {
        type: 'fixed',
        componentIds: ['context-menu'],
        text: 'Trigger zone had no `tabindex`, so Shift+F10/the Menu key could never reach it.',
      },
      {
        type: 'fixed',
        componentIds: ['sidebar'],
        text: '`sanringSidebarTrigger`’s selector wasn’t restricted to `<button>`, so misuse on a non-interactive element silently produced a keyboard-inaccessible trigger.',
      },
      {
        type: 'fixed',
        componentIds: ['sheet'],
        text: '`document.activeElement`/`document.body.children` were read unguarded in an effect, crashing on the server if a sheet renders initially open.',
      },
      {
        type: 'fixed',
        componentIds: ['hover-card'],
        text: 'Trigger was missing `aria-expanded`.',
      },
      {
        type: 'fixed',
        componentIds: ['navigation-menu'],
        text: 'Content panel’s `role="region"` had no `aria-label`/`aria-labelledby`, so it wasn’t exposed as a landmark.',
      },
      {
        type: 'fixed',
        componentIds: ['transfer'],
        text: 'Root element had no `class` input, so consumers couldn’t style or override it.',
      },
      {
        type: 'fixed',
        componentIds: ['input', 'textarea'],
        text: '`id` was silently overwritten every change-detection cycle by the component’s own host binding, discarding any `id` a consumer wrote.',
      },
      {
        type: 'fixed',
        componentIds: ['link'],
        text: 'The `disabled:` class variant never matches `<a>`, and there was no `aria-disabled`/`tabindex`/click-guard mechanism at all — a "disabled" link did nothing.',
      },
      {
        type: 'fixed',
        componentIds: ['file-upload'],
        text: 'The remove button and the trigger directive didn’t reflect the upload’s disabled state.',
      },
      {
        type: 'fixed',
        componentIds: ['select'],
        text: 'Had no plain `disabled` input, only CVA `setDisabledState()` — unusable outside Reactive/Template-driven Forms.',
      },
      {
        type: 'fixed',
        componentIds: ['calendar', 'date-picker'],
        text: 'Host `role="radiogroup"` illegally wrapped `role="grid"`/`role="row"`/`role="gridcell"` children; moved to `role="group"` with `aria-required` applied per-cell instead.',
      },
      {
        type: 'fixed',
        text: '`sanring search --json` threw a `ReferenceError` whenever the search returned any results.',
      },
    ],
  },
  {
    version: '0.23.2',
    date: '2026-08-14',
    changes: [
      {
        type: 'fixed',
        componentIds: ['select'],
        text: 'Registry was completely missing `FocusKeyManager` keyboard navigation and `FocusableOption` on `select-item` — arrow keys did nothing after `sanring add select`.',
      },
      {
        type: 'fixed',
        componentIds: ['sheet'],
        text: 'Registry panel wasn’t portalled into a CDK overlay, didn’t restore focus to the trigger on close, and didn’t mark background content `aria-hidden` while open.',
      },
      {
        type: 'fixed',
        componentIds: ['carousel'],
        text: 'Registry initialized Embla outside `afterNextRender()`, crashing on the server (SSR).',
      },
      {
        type: 'fixed',
        componentIds: ['popover', 'select'],
        text: 'Focus never moved into the panel on open, nor back to the trigger on close/Escape.',
      },
      {
        type: 'fixed',
        componentIds: ['context-menu', 'navigation-menu'],
        text: 'Keyboard-opening a submenu didn’t move focus into it, requiring an extra keypress before you could start navigating.',
      },
      {
        type: 'fixed',
        componentIds: ['navigation-menu'],
        text: 'A directive `tabindex` binding unconditionally overwrote the consumer’s manually-set `tabindex="0"` on submenu links, breaking arrow-key navigation between items.',
      },
      {
        type: 'fixed',
        componentIds: ['command'],
        text: '`command-group` heading text wasn’t linked via `aria-labelledby` to its `role="group"` container.',
      },
      {
        type: 'fixed',
        componentIds: ['tree'],
        text: '`TreeKeyManager` was created but never destroyed, leaking a subscription on repeated mount/unmount.',
      },
      {
        type: 'fixed',
        componentIds: ['combobox'],
        text: '`role="listbox"` was missing `aria-multiselectable="true"` in multi-select mode; the popup-trigger variant didn’t auto-focus its search input on open; `disabled`/`required`/`multiple` lacked `booleanAttribute` transforms.',
      },
      {
        type: 'fixed',
        componentIds: ['file-upload'],
        text: 'Registry `id` was a plain string instead of an `input()`; also fixed an unreliable opacity modifier on the drag-over highlight.',
      },
      {
        type: 'fixed',
        componentIds: ['switch'],
        text: 'Registry was missing `ariaLabel`/`ariaLabelledBy`/`checkedChange`, dropped during an earlier registry refactor.',
      },
      {
        type: 'fixed',
        componentIds: ['checkbox', 'radio'],
        text: '`aria-required` only checked the bare `required()` input in the registry, missing the `Validators.required`-based case.',
      },
      {
        type: 'fixed',
        componentIds: [
          'collapsible',
          'accordion',
          'alert-dialog',
          'alert',
          'avatar',
          'card',
          'dialog',
          'radio',
          'scroll-area',
          'tabs',
          'toast',
          'tooltip',
        ],
        text: 'Registry `index.ts` was missing the `SANRING_*_IMPORTS` convenience export that the docs’ own install examples import — following the docs after `sanring add` would fail to compile.',
      },
      {
        type: 'fixed',
        componentIds: ['pagination'],
        text: 'The page-size select trigger button had no accessible name — a directive `ariaLabel` input silently overrode the component’s own `aria-label` binding.',
      },
      {
        type: 'fixed',
        componentIds: ['scroll-area'],
        text: 'Keyboard users couldn’t scroll overflowing content. Added `tabindex="0"` and a focus-visible ring.',
      },
      {
        type: 'fixed',
        componentIds: ['field', 'input', 'textarea'],
        text: 'Error-message/label text and the error-state border/ring used hardcoded red classes instead of design tokens; `field` was missing a `class` input.',
      },
      {
        type: 'fixed',
        componentIds: ['badge', 'switch', 'toast', 'stepper', 'file-upload', 'otp-input', 'checkbox', 'radio', 'calendar', 'date-picker'],
        text: 'Assorted hardcoded colors replaced with the project’s actual design tokens — several were only defined in the docs site’s own stylesheet, so components installed via the CLI never had them applied.',
      },
      {
        type: 'fixed',
        componentIds: ['tabs'],
        text: 'Registry `tabs-content` had a structural difference from the npm package (missing a `value` input), plus rounded-corner token drift.',
      },
      {
        type: 'fixed',
        componentIds: ['stepper'],
        text: 'Focus ring used an undefined CSS variable; registry `StepState` type was missing the escape hatch for custom state strings.',
      },
      {
        type: 'fixed',
        componentIds: ['otp-input'],
        text: 'Active slot border used the same undefined CSS variable as `stepper`’s focus ring.',
      },
      {
        type: 'fixed',
        componentIds: ['table'],
        text: 'Registry `index.ts` was missing the `SANRING_TABLE_IMPORTS` convenience export.',
      },
      {
        type: 'fixed',
        componentIds: ['button'],
        text: '`a[sanringBtn]` without `href` was missing `role="button"`.',
      },
      {
        type: 'fixed',
        componentIds: ['toggle', 'dialog', 'alert-dialog', 'tooltip', 'toast'],
        text: 'Rounded-corner classes hardcoded instead of using the project’s radius design tokens.',
      },
      {
        type: 'fixed',
        componentIds: ['sidebar'],
        text: '`text-[var(--sanring-muted-foreground)]` referenced a CSS variable that was never defined in `theme.css` — replaced with the actual token.',
      },
    ],
  },
  {
    version: '0.23.1',
    date: '2026-08-13',
    changes: [
      {
        type: 'fixed',
        componentIds: ['divider'],
        text: 'Registry was missing `class` and `ariaLabel` inputs present on the npm package.',
      },
      {
        type: 'fixed',
        componentIds: ['skeleton'],
        text: 'Registry CSS used a hardcoded radius class instead of the design token.',
      },
      {
        type: 'fixed',
        componentIds: ['progress'],
        text: 'Registry was silently dropping the `ariaValueText` input.',
      },
      {
        type: 'fixed',
        componentIds: ['tag'],
        text: 'Close button had no visible focus ring, failing WCAG 2.4.7.',
      },
      {
        type: 'fixed',
        componentIds: ['card'],
        text: 'Registry radius class didn’t respect the theme’s radius token.',
      },
      {
        type: 'fixed',
        componentIds: ['avatar'],
        text: '`AvatarImageDirective` constructed a `MutationObserver` eagerly instead of deferring to `afterNextRender`, unsafe under SSR.',
      },
      {
        type: 'fixed',
        componentIds: ['alert'],
        text: 'Registry `destructive` variant used hardcoded red classes instead of the project’s error-color tokens.',
      },
    ],
  },
  {
    version: '0.23.0',
    date: '2026-08-11',
    changes: [
      {
        type: 'added',
        notable: true,
        text: 'New `sanring build` command: scans `registry/components/` and generates `registry/registry.json` automatically, resolving `componentDeps`, `sharedDeps`, and `peerDependencies` from import analysis. Includes a `--dry-run` flag.',
      },
    ],
  },
  {
    version: '0.22.0',
    date: '2026-08-10',
    changes: [
      {
        type: 'added',
        notable: true,
        text: '`sanring.config.json` now accepts `registries` (alias → URL map) and `defaultRegistry`, so a project can point at a private/third-party registry without repeating `--registry <url>` on every command. `sanring add` accepts `alias:componentName` to install from a specific non-default registry, e.g. `sanring add myteam:button`. Both fields are opt-in — an existing config keeps working unchanged.',
      },
    ],
  },
  {
    version: '0.21.0',
    date: '2026-08-09',
    changes: [
      {
        type: 'added',
        notable: true,
        text: '`ng add @sanring/cli` now works as an alternative to `npx @sanring/cli@latest init` — installs the CLI as a dev dependency and runs the same init flow (component path prompt, theme stylesheet, base dependency install).',
      },
      {
        type: 'added',
        text: '`sanring init --theme <preset>` starts from a named color preset instead of hand-editing tokens: `slate` (muted blue-gray), `warm` (amber, larger radius), or `high-contrast` (near-black/white, square corners).',
      },
    ],
  },
  {
    version: '0.20.0',
    date: '2026-08-09',
    changes: [
      {
        type: 'added',
        notable: true,
        text: 'New `sanring mcp` command: starts an MCP server over stdio so AI coding agents (Claude Code, Cursor, Windsurf) can query and install components directly, without shelling out. Exposes five tools — `list_components`, `search_components`, `get_component_info`, `plan_component_install` (dry-run preview), and `add_component`.',
      },
    ],
  },
  {
    version: '0.19.0',
    date: '2026-08-06',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['navigation-menu'],
        text: 'New `navigation-menu` component: horizontal or vertical top-level navigation with trigger-opened content panels and `link` / `label` / `description` / `separator` primitives.',
      },
      {
        type: 'added',
        componentIds: ['navigation-menu'],
        text: '`sanring-navigation-menu-viewport` — one shared fixed-size panel centered under the trigger group, for bars that want a consistent panel instead of a differently sized one per trigger.',
      },
      {
        type: 'added',
        componentIds: ['navigation-menu'],
        text: '`sanring-navigation-menu-sub` submenu flyouts positioned with CDK Overlay (viewport collision fallback, hover-intent, click, and keyboard navigation).',
      },
      {
        type: 'fixed',
        componentIds: ['sidebar'],
        text: '`SidebarProviderComponent` rendered `display: inline` by default inside flex/grid layouts, breaking the sidebar/main-content width ratio. Fixed with `display: contents`.',
      },
      {
        type: 'fixed',
        componentIds: ['dialog'],
        text: '`DialogFooterComponent` buttons had no gap on mobile where they stack vertically. Added `gap-2` (cancelled at `sm:` where `space-x-2` takes over).',
      },
      {
        type: 'fixed',
        componentIds: ['otp-input'],
        text: '`otp-input` slots could be compressed or overflow on narrow viewports. Host now caps at `max-w-full overflow-x-auto`; each slot is `shrink-0`.',
      },
    ],
  },
  {
    version: '0.18.0',
    date: '2026-08-05',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['sidebar'],
        text: 'New `sidebar` component: a composable application shell sidebar with rail mode, inset layout, sub-menus, action buttons, and badge indicators.',
      },
    ],
  },
  {
    version: '0.17.2',
    date: '2026-08-05',
    changes: [
      {
        type: 'changed',
        text: '`sanring add` now also prompts to update a peer dependency when the installed version spec differs from the registry minimum, keeping copied components aligned with registry metadata.',
      },
    ],
  },
  {
    version: '0.17.1',
    date: '2026-07-28',
    changes: [
      {
        type: 'changed',
        componentIds: ['calendar', 'date-picker'],
        text: '`calendar` and `date-picker` peer dependency renamed from `@sanring/date-picker` to `@sanring/date-picker-core` — the upstream project reassigned the original package name to an unrelated composed widget.',
      },
      {
        type: 'fixed',
        componentIds: ['otp-input'],
        text: '`otp-input` no longer inserts a digit twice on mobile — the browser can ignore `keydown` `preventDefault()` on virtual keyboards, so both the manual update and the browser\'s own `input` event were firing.',
      },
    ],
  },
  {
    version: '0.17.0',
    date: '2026-07-28',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['otp-input'],
        text: 'New `otp-input` component: a one-time password input with individual character slots, keyboard navigation, and paste support.',
      },
      {
        type: 'changed',
        componentIds: ['transfer'],
        text: '`transfer` gains a select-all control and a selected-item count display in each panel header.',
      },
      {
        type: 'fixed',
        componentIds: ['transfer'],
        text: 'Clicking a `transfer` list item now toggles its selection correctly.',
      },
    ],
  },
  {
    version: '0.16.0',
    date: '2026-07-27',
    changes: [
      {
        type: 'changed',
        notable: true,
        componentIds: ['transfer'],
        text: '`transfer` restyled to use design system tokens and gained `mode="one-way"` (read-only target), per-panel search via `setQuery()`, and per-panel pagination via `pageSize` / `nextPage()` / `previousPage()`.',
      },
    ],
  },
  {
    version: '0.15.0',
    date: '2026-07-27',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['transfer'],
        text: 'New `transfer` component: a dual-list shuttle for moving items between two panes (e.g. assigning permissions), composed from the existing `checkbox` component.',
      },
    ],
  },
  {
    version: '0.14.0',
    date: '2026-07-26',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['context-menu'],
        text: 'New `context-menu` component: a right-click menu positioned at the pointer via `@angular/cdk/overlay`, with checkbox items, radio groups, and nested submenus that open on hover with viewport-aware flipping.',
      },
    ],
  },
  {
    version: '0.13.1',
    date: '2026-07-26',
    changes: [
      {
        type: 'changed',
        componentIds: ['calendar'],
        text: '`calendar` month/year jump popover selects now show a chevron-down indicator and use consistent padding and spacing.',
      },
    ],
  },
  {
    version: '0.13.0',
    date: '2026-07-26',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['switch'],
        text: '`switch` thumb now accepts projected icons via `[sanringSwitchIconChecked]` and `[sanringSwitchIconUnchecked]` slots — they toggle automatically with the checked state (e.g. a sun/moon icon). Fully backward compatible.',
      },
    ],
  },
  {
    version: '0.12.0',
    date: '2026-07-22',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['calendar'],
        text: '`calendar` gains an `orientation` input (`\'horizontal\' | \'vertical\'`) controlling how multiple months (`monthsToDisplay > 1`) are laid out.',
      },
      {
        type: 'fixed',
        componentIds: ['calendar'],
        text: 'Calendar month/year jump selects always showed the first option on open due to a `[value]` binding race against `@for`-rendered `<option>`s. Fixed by binding `[selected]` on each `<option>` directly.',
      },
      {
        type: 'fixed',
        componentIds: ['calendar'],
        text: 'Calendar jump selects were left-aligned with dead space; they now share the row evenly with centered text.',
      },
      {
        type: 'fixed',
        componentIds: ['tabs'],
        text: '`tabs` triggers are now `cursor-pointer` instead of the browser default.',
      },
    ],
  },
  {
    version: '0.11.0',
    date: '2026-07-20',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['calendar'],
        text: '`calendar` header label is now clickable, opening a popover with month/year `<select>` jump controls (±100/50 years from today), instead of only stepping one month at a time.',
      },
      {
        type: 'fixed',
        componentIds: ['popover'],
        text: '`popover` `triggerOrigin` changed from a plain property to a signal, fixing overlay positioning for triggers inside an `OnPush` child component (e.g. calendar\'s header label button).',
      },
      {
        type: 'fixed',
        componentIds: ['tree'],
        text: '`tree` keyboard navigation now works — `TreeNodeComponent` implements the `makeFocusable()` no-op that CDK `TreeKeyManager` requires to set the initial roving tab stop.',
      },
      {
        type: 'fixed',
        text: '`add` and `init` no longer accept shell metacharacters in peer-dependency arguments — commands now pass `{ bin, args }` directly with `shell: false` instead of interpolating into a command string.',
      },
      {
        type: 'changed',
        text: '`add --shared-path` is now persisted to `sanring.config.json`, so `diff` / `update` / `remove` use the same custom path instead of always assuming the default.',
      },
      {
        type: 'changed',
        text: '`fetchRegistry` now validates the parsed JSON shape and reports which field is malformed, instead of failing later inside an unrelated command.',
      },
      {
        type: 'changed',
        text: 'Registry lookups use an indexed map instead of repeated `Array.find` scans; file fetches in `add` / `diff` / `update` run with bounded concurrency instead of one at a time.',
      },
    ],
  },
  {
    version: '0.10.0',
    date: '2026-07-20',
    changes: [
      {
        type: 'added',
        notable: true,
        text: 'New `sanring doctor` command: checks Node.js version, Angular project detection, `sanring.config.json`, theme file, per-file hash integrity, and registry reachability. Exits 1 on hard errors for CI use. Accepts `--offline` to skip the network check.',
      },
      {
        type: 'added',
        notable: true,
        text: 'New `sanring search <query>` command: fuzzy-searches component names and descriptions (name matches ranked first), highlights the matched substring, and shows a ✔ badge next to already-installed components.',
      },
      {
        type: 'added',
        text: '`sanring info` (no argument) now shows project context: CLI version, Angular detection, config summary, theme status, and full list of installed components. Accepts `--json` for CI and agent use.',
      },
      {
        type: 'added',
        text: '`sanring diff --exit-code` exits 1 when any file differs from the registry — use it as a CI gate to detect component drift.',
      },
      {
        type: 'added',
        text: '`sanring update --trust` promotes files with no recorded hash baseline to silent auto-update, letting pre-v0.9.0 installs catch up without false conflict prompts.',
      },
      {
        type: 'added',
        text: '`sanring list --installed` / `-i` filters the output to only components already installed in the current project.',
      },
      {
        type: 'added',
        text: '`sanring add --diff` previews the line-by-line diff against local files before installing. `sanring add --view` prints the raw registry content without writing anything.',
      },
      {
        type: 'fixed',
        text: '`sanring update` silently skipped files that were added to a component\'s registry entry after the user\'s last install. Those files now appear as "new in registry" and are installed automatically.',
      },
    ],
  },
  {
    version: '0.9.2',
    date: '2026-07-19',
    changes: [
      {
        type: 'changed',
        text: 'Refreshed the `@sanring/cli` README on npm: `diff` / `update` docs now describe the safe-to-update vs needs-review split, and added a standout-features summary.',
      },
    ],
  },
  {
    version: '0.9.1',
    date: '2026-07-19',
    changes: [
      {
        type: 'changed',
        text: '`sanring diff` now labels each file as "safe to update" (registry moved on, you never touched it) or "needs review" (you customized it), reusing the same baseline-hash comparison as `update`.',
      },
    ],
  },
  {
    version: '0.9.0',
    date: '2026-07-18',
    changes: [
      {
        type: 'changed',
        notable: true,
        text: '`sanring update` now tells apart files you never touched since installing from ones you customized: untouched files apply silently; only truly diverged files show a diff and prompt for confirmation.',
      },
      {
        type: 'added',
        text: '`sanring add` and `sanring init` now record a per-file content hash in `sanring.config.json` to make the smart-update comparison possible.',
      },
    ],
  },
  {
    version: '0.8.0',
    date: '2026-07-18',
    changes: [
      {
        type: 'added',
        notable: true,
        text: 'Three new commands: `sanring info <component>` (preview files and peer deps without installing), `sanring remove <components...>` (uninstall, refuses to break dependents), and `sanring update` (apply registry changes interactively, one file at a time).',
      },
    ],
  },
  {
    version: '0.7.1',
    date: '2026-07-18',
    changes: [
      {
        type: 'changed',
        text: '`sanring --help` now prints a "Quick start" block with the `init` / `add` command sequence and a note that no `npm install` is needed, instead of leaving first-time users to find that in the README.',
      },
    ],
  },
  {
    version: '0.7.0',
    date: '2026-07-18',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['carousel', 'combobox', 'command', 'dropdown-menu', 'hover-card', 'pagination', 'resizable', 'select', 'table', 'tree'],
        text: 'Added 10 components missing from the CLI registry: `carousel`, `combobox`, `command`, `dropdown-menu`, `hover-card`, `pagination`, `resizable`, `select`, `table`, and `tree`. `npx @sanring/cli add <name>` now works for all of them.',
      },
      {
        type: 'fixed',
        text: '`sanring --version` reported a hardcoded `0.0.1` regardless of the actual published version.',
      },
      {
        type: 'fixed',
        componentIds: ['scroll-area'],
        text: '`sanring add scroll-area` now works — the registry had it registered as `scrollArea`, so only that exact (undocumented) camelCase name was accepted.',
      },
    ],
  },
  {
    version: '0.6.1',
    date: '2026-07-10',
    changes: [
      {
        type: 'fixed',
        componentIds: ['input'],
        text: '`sanring add field` and `sanring add input` produced broken installs. `field` was missing four of its five source files; `input` shipped a stale pre-Field version with no `SanringFieldControl` implementation, and the registry didn\'t declare `field` as a dependency. Both are now fully repaired.',
      },
    ],
  },
  {
    version: '0.6.0',
    date: '2026-07-10',
    changes: [
      {
        type: 'added',
        notable: true,
        text: '`sanring init` now writes `src/sanring-theme.css` — the full set of `--sanring-*` design tokens every component reads. Previously components had no visible styling after a fresh install.',
      },
      {
        type: 'added',
        notable: true,
        text: 'New `sanring diff [components...]` command: compares installed files against the current registry line by line, showing what\'s been customized locally versus what changed upstream.',
      },
    ],
  },
  {
    version: '0.5.1',
    date: '2026-07-10',
    changes: [
      {
        type: 'fixed',
        text: 'Synced `registry/shared/utils.ts` with `@sanring/ui`, adding the `uniqueId()` helper. Components with `sharedDeps: ["utils"]` were missing this function.',
      },
    ],
  },
  {
    version: '0.5.0',
    date: '2026-07-06',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['alert-dialog', 'slider', 'stepper', 'timeline'],
        text: 'New components: `alert-dialog` (a Dialog variant requiring an explicit user choice), `slider` (pointer, keyboard, ARIA, and Angular Forms), `stepper` (CDK Stepper with template labels and custom icons), and `timeline` (vertical and horizontal orientation).',
      },
      {
        type: 'changed',
        componentIds: ['dialog'],
        text: '`dialog` gains `DialogMedia` for an icon badge above the title, per-trigger config via `sanringDialogConfig`, and `[sanringDialogClose]="result"` to pass a result value on close.',
      },
    ],
  },
  {
    version: '0.4.0',
    date: '2026-07-06',
    changes: [
      {
        type: 'added',
        notable: true,
        componentIds: ['aspect-ratio', 'textarea'],
        text: 'New `aspect-ratio` directive for responsive media boxes, and new `textarea` directive split from `sanringInput` for native multiline form fields.',
      },
    ],
  },
  {
    version: '0.3.0',
    date: '2026-07-05',
    changes: [
      {
        type: 'added',
        notable: true,
        text: '`sanring add` now accepts multiple component names at once and automatically installs each component\'s `componentDeps` (e.g. `sanring add tag` also adds `badge`). Shared files and peer dependencies are deduped across the whole batch.',
      },
    ],
  },
  {
    version: '0.2.1',
    date: '2026-07-03',
    changes: [
      {
        type: 'fixed',
        text: '`pnpm build` now runs a `sync-registry` step that mirrors root `registry/` into the package and fails if any referenced file is missing, preventing a stale registry from shipping silently.',
      },
      {
        type: 'fixed',
        text: 'Remote fallback registry URL was pointing at a tag format (`v<version>`) and path (`packages/cli/registry`) that never existed. Fixed to the correct Changesets tag (`@sanring/cli@<version>`) and root `registry/` path.',
      },
      {
        type: 'added',
        text: 'Unit tests for package-manager detection, config read/write, and registry source-resolution priority.',
      },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-07-03',
    changes: [
      {
        type: 'added',
        notable: true,
        text: '`sanring add --dry-run`: previews which files would be created or overwritten without writing to disk or installing dependencies.',
      },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-06-29',
    changes: [
      {
        type: 'added',
        notable: true,
        text: 'Initial release: `sanring init` scaffolds the config, `sanring add <component>` copies source files and installs peer dependencies, with spinner UX and auto-detection of npm / pnpm / yarn / bun.',
      },
    ],
  },
];

/**
 * Component ids touched by the newest version entry — feeds the "Updated"
 * badge on the components list so it stays in sync with the version history.
 */
export function getRecentlyUpdatedComponentIds(): DocsComponentId[] {
  const latest = cliVersionChangelog[0];
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
  const latest = cliVersionChangelog[0];
  if (!latest) return [];
  const ids = new Set<DocsComponentId>();
  for (const change of latest.changes) {
    if (change.type !== 'added' || !change.notable) continue;
    for (const id of change.componentIds ?? []) ids.add(id);
  }
  return [...ids];
}

export { isPatch };
