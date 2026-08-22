# @sanring/cli

## 0.24.0

### Minor Changes

- 4076c74: `build`/`list --outdated` gain `--json` output. A new registry-integrity module (dangling `componentDeps`/`sharedDeps`/group references, unparseable peer versions, optional file-fetchability) is now shared across `doctor`, `build`, and the MCP `doctor_project` tool. `fetchRegistry`/`fetchFile` now throw a typed `RegistryFetchError` instead of calling `process.exit` directly — this also fixes `doctor`'s dead "Unreachable" catch block and 6 of 7 MCP tool handlers that had no `try`/`catch` around `getRegistry()` (a single failed fetch could previously kill the whole long-running MCP server). Also fixes a flaky-test root cause where `sync-registry.mjs`'s rm-then-async-copy raced with `mcp.e2e.test.ts`'s `npm run build`.

### Patch Changes

- 4076c74: `remove` now distinguishes unknown targets (hard exit 1, matching `diff`/`update`) from known-but-not-installed ones (soft skip), instead of silently exiting 0 whenever any target succeeded. Fixes a crash in `info`'s `alias:component` lookup, surfaced by newly added test coverage for `info`/`migrate`/`search`.

## 0.23.3

### Patch Changes

- Full-library headless-quality audit (`/audit-sweep`) across all 52 `packages/ui`/`registry` components — found and fixed real behavior, SSR, and accessibility bugs (not registry-parity drift; both sides had the same issue):

  - **button**: `sanringBtn` on a hrefless `<a>` had no `tabindex` or keyboard handler outside the disabled state — completely unreachable by keyboard
  - **context-menu**: trigger zone had no `tabindex`, so Shift+F10/the Menu key (which browsers turn into a native `contextmenu` event) could never reach it
  - **sidebar**: `sanringSidebarTrigger`'s selector wasn't restricted to `<button>` the way its sibling `sanringSidebarRail` is, so applying it to a non-interactive element silently produced a keyboard-inaccessible trigger
  - **sheet**: `document.activeElement`/`document.body.children` were read unguarded inside an effect, crashing on the server if a sheet renders initially open
  - **hover-card**: trigger was missing `aria-expanded`
  - **navigation-menu**: content panel's `role="region"` had no `aria-label`/`aria-labelledby`, so it wasn't exposed as a landmark
  - **transfer**: root element had no `class` input, so consumers couldn't style or override it
  - **input**, **textarea**: `id` was silently overwritten every change-detection cycle by the component's own host binding, discarding any `id` a consumer wrote in the template
  - **link**: the `disabled:` Tailwind variant never matches `<a>` (native `:disabled` only applies to form controls) and there was no `aria-disabled`/`tabindex`/click-guard mechanism at all, so a "disabled" link did nothing
  - **file-upload**: the remove button and the trigger directive didn't reflect the upload's disabled state
  - **select**: had no plain `disabled` input, only CVA `setDisabledState()` — unusable outside Reactive/Template-driven Forms
  - **calendar**, **date-picker**: host `role="radiogroup"` illegally wrapped `role="grid"`/`role="row"`/`role="gridcell"` children — moved to `role="group"` with `aria-required` applied per-`gridcell` instead

- Fixed a crash in `sanring search --json` — it threw a `ReferenceError` whenever the search returned at least one result, because a variable was read before its `let` declaration executed. Found via a full-library CLI completeness audit; `search.ts` was one of only three commands with no test coverage, which is why this had gone unnoticed.

## 0.23.2

### Patch Changes

- Tier 2 component audit (`/audit-component`) — registry/packages-ui parity fixes and design-token drift across ~20 components, mostly regressions introduced by the P14 `SanringCvaBase` registry refactor that never got synced back:

  - **switch**: registry was missing `ariaLabel`/`ariaLabelledBy`/`checkedChange` (dropped during the P14 refactor)
  - **checkbox**, **radio**: registry `aria-required` only checked the bare `required()` input, missing the `Validators.required`-based `fieldRequired` case
  - **collapsible**: registry `index.ts` was missing the `SANRING_COLLAPSIBLE_IMPORTS` convenience export used by the docs' own install examples — `sanring add collapsible` then following the docs would fail to compile
  - **accordion**: same missing-export bug as collapsible, plus the same drift found and fixed in **alert-dialog**, **alert**, **avatar**, **card**, **dialog**, **radio**, **scroll-area**, **tabs**, **toast**, **tooltip**
  - **pagination**: the page-size select trigger button had no accessible name — a directive `ariaLabel` input silently overrode the component's own `aria-label` binding
  - **scroll-area**: keyboard users couldn't scroll overflowing content — added `tabindex="0"` + focus-visible ring (WCAG 2.1.1)
  - **field**: error-message/label text and the `input`/`textarea` error-state border/ring used hardcoded `red-*` classes instead of `--sanring-error-*` tokens; `SanringFieldComponent` was missing a `class` input
  - **badge**, **switch**, **toast**, **stepper**, **file-upload**, **otp-input**, **checkbox**, **radio**, **calendar**, **date-picker**: assorted hardcoded `red-*`/`emerald-*`/`yellow-*`/`blue-*`/`border-primary`/`text-primary` colors replaced with the project's actual `--sanring-*` design tokens (several only defined in the docs site's own stylesheet, so components installed via the CLI never had them applied)
  - **tabs**: registry `tabs-content` had a structural difference from `packages/ui` (missing `value` input), plus `rounded-lg`/`rounded-md` token drift
  - **stepper**: focus ring used an undefined `--sanring-ring` token; registry `StepState` type was missing the `| (string & {})` escape hatch for custom states
  - **otp-input**: same undefined `--sanring-ring` token on the active slot border
  - **table**: registry `index.ts` was missing the `SANRING_TABLE_IMPORTS` convenience export
  - **button**: `a[sanringBtn]` without `href` was missing `role="button"`
  - **toggle**: `rounded-md` → `--sanring-radius` token

- Tier 3 component audit (`/audit-component`) — CDK Overlay / complex-keyboard components. Several high-severity registry-only regressions (registry drifted from the already-fixed `packages/ui` behavior) plus a few defects present in both:

  - **select**: registry was completely missing `FocusKeyManager` keyboard navigation (arrow keys did nothing) and `FocusableOption` on `select-item` — despite `registry.json` describing the component as having keyboard navigation
  - **sheet**: registry predated the `0bbb1e8` fix — panel wasn't portalled into a CDK overlay (`position: fixed` could get hijacked by an ancestor's `transform`/`filter`), closing didn't restore focus to the trigger, and background content wasn't marked `aria-hidden` while open
  - **carousel**: registry initialized Embla outside `afterNextRender()`, crashing on the server — the same SSR bug already fixed in `packages/ui`
  - **file-upload**: registry's `id` was a plain string instead of an `input()` like `packages/ui`; also fixed an unreliable `bg-[var(--sanring-active)]/30` opacity modifier and a `rounded-lg` token-drift
  - **popover**, **select**: focus never moved into the panel on open, nor back to the trigger on close/Escape
  - **context-menu**, **navigation-menu** (submenus): keyboard-opening a submenu didn't move focus into it, requiring an extra keypress to start navigating
  - **navigation-menu**: a directive `[attr.tabindex]` binding unconditionally overwrote the consumer's manually-set `tabindex="0"` on submenu links, breaking arrow-key navigation between items entirely
  - **command**: `command-group` heading text wasn't linked via `aria-labelledby` to its `role="group"` container
  - **dialog**, **alert-dialog**: `rounded-lg`/`rounded-sm` design-token drift in the registry stylesheet
  - **tree**: `TreeKeyManager` was created but never destroyed, leaking a subscription on repeated mount/unmount
  - **combobox**: `role="listbox"` was missing `aria-multiselectable="true"` in multi-select mode; opening the popup-trigger variant didn't auto-focus the search input; `disabled`/`required`/`multiple` inputs lacked `booleanAttribute` transforms
  - **sidebar**: `text-[var(--sanring-muted-foreground)]` referenced a CSS variable that was never defined anywhere in `theme.css` — replaced with the actual `--sanring-muted` token
  - **tooltip**, **toast**: `rounded-md`/`rounded-lg` design-token drift

  `packages/ui` already had the correct behavior for the registry-only regressions above; this release re-syncs `registry/` so `sanring add`/`sanring update` installs match.

## 0.23.1

### Patch Changes

- Tier 1 component audit — seven registry/packages-ui bug fixes:
  - **divider**: added missing `class` and `ariaLabel` inputs; registry now matches packages/ui API
  - **skeleton**: registry CSS token corrected (`rounded-md` → `rounded-[var(--sanring-radius-sm)]`)
  - **progress**: registry `ProgressComponent` was silently dropping `ariaValueText`; added input and template binding
  - **tag**: close button had `focus-visible:outline-none` with no replacement ring (WCAG 2.4.7); added `focus-visible:ring-1`
  - **card**: registry `rounded-xl` → `rounded-[var(--sanring-radius-lg)]` to respect theme token
  - **avatar**: `AvatarImageDirective` constructed `MutationObserver` eagerly; deferred to `afterNextRender` for SSR safety
  - **alert**: registry `destructive` variant used hardcoded `red-*` Tailwind classes instead of `--sanring-error-*` tokens; base radius corrected

## 0.23.0

### Minor Changes

- `sanring build` command: scans `registry/components/` and generates `registry/registry.json` automatically, with `componentDeps`, `sharedDeps`, and `peerDependencies` resolved from import analysis. Includes `--dry-run` flag, registry integrity golden-fixture test, and `canonicalizePeerDependencies` dedup. Multi-registry support: `sanring.config.json` accepts `registries` (alias → URL) and `defaultRegistry`; `sanring add` accepts `alias:componentName` syntax.

## 0.22.0

### Minor Changes

- d73b166: `sanring.config.json` now accepts optional `registries` (alias → URL map) and `defaultRegistry` fields, so a project can point at a private/third-party registry without repeating `--registry <url>` on every command. `sanring add` accepts `alias:componentName` to install from a specific non-default registry, e.g. `sanring add myteam:button`. Both fields are opt-in — an existing config without them behaves exactly as before. `installedVersions` entries are recorded as `alias:componentName` once an alias is known; components installed before this feature keep their original key until next touched by `add`/`update`.

## 0.21.2

### Patch Changes

- c8c5861: `collapsible`: `[sanringCollapsibleContent]` hardcoded `role="region"` on its host, which silently overrode any semantic role already on that element — most notably `sanring-sidebar-menu-sub` (`role="list"`), the documented pattern for collapsible sidebar submenus. That broke the required list/listitem ARIA relationship for the submenu's items. Removed the hardcoded role: the WAI-ARIA disclosure pattern doesn't require one on the panel (`aria-labelledby` referencing the trigger is sufficient) (`packages/ui` + `registry`).

  Caught by axe-core automated accessibility checks while adding sidebar's first component test suite (`packages/ui/src/testing/axe-a11y.ts`), completing the P11 rollout to all remaining components.

- c8c5861: `date-picker`/`calendar`: the host `aria-required`/`aria-invalid`/`aria-describedby` attributes (used for Angular Forms/`sanring-field` integration) sat on a bare `<div>` (`role="generic"`), which isn't a valid ARIA role for them — axe-core's `aria-allowed-attr` rule only permits those on specific roles (combobox, gridcell, listbox, radiogroup, spinbutton, textbox, tree). Added `role="radiogroup"` to both hosts (also the closest semantic fit: picking exactly one date from a set of cells). `date-picker`'s grid cells were a flat list without `role="row"` grouping, which the ARIA grid pattern requires; added row chunking (mirroring `calendar`, which already had it) via a `display:contents` wrapper that doesn't affect the CSS Grid layout (`packages/ui` + `registry`).

  Caught by axe-core automated accessibility checks while completing the P11 rollout to all remaining components.

- c8c5861: `navigation-menu`: the submenu trigger (`sanring-navigation-menu-sub-trigger`) carried `role="menuitem"`, which ARIA requires to be contained by a `role="menu"`/`"menubar"` ancestor — but it sits directly inside `sanring-navigation-menu-content` (`role="region"`), never a menu. Changed to `role="button"` (`packages/ui` + `registry`), matching how the top-level trigger already uses plain `aria-haspopup`/`aria-expanded` semantics instead of menu roles. Also dropped the same invalid `role="menuitem"` from the docs' submenu example content links, which had the identical bug.

  Caught by axe-core automated accessibility checks in the component test suite (`packages/ui/src/testing/axe-a11y.ts`), continuing the P11 rollout past the initial 13 components.

## 0.21.1

### Patch Changes

- ab61a84: `select`: the trigger button (`role="combobox"`) had no way to receive an accessible name other than an associated `<label>` — visible placeholder/value text doesn't count as a name for that role the way it would for a plain button, and nothing in the component or docs exposed an alternative. Added `ariaLabel`/`ariaLabelledBy` inputs to `[sanringSelectTrigger]`.

  `context-menu`: the trigger element (an arbitrary `<div>`) carried `aria-haspopup`/`aria-expanded`, which are only valid ARIA on an element whose role permits them — a bare div doesn't. Added `role="button"` to `[sanringContextMenuTrigger]`.

  Both were caught by axe-core automated accessibility checks newly added to the component test suite (`packages/ui/src/testing/axe-a11y.ts`), rolled out to the highest-risk interactive/overlay components.

## 0.21.0

### Minor Changes

- f857618: `ng add @sanring/cli` now works as an alternative to `npx @sanring/cli@latest init` — it installs the CLI as a dev dependency and runs the same init flow (component path prompt, theme stylesheet, base dependency install). Options match `init`: `--path`, `--skip-confirmation`, `--force`, `--registry`.
- 839df54: `sanring init` now accepts `--theme <preset>` to start from a named color preset instead of hand-editing tokens afterwards: `default` (unchanged), `slate` (muted blue-gray accent), `warm` (amber accent, larger radius), and `high-contrast` (near-black/white surfaces, square corners). The preset is appended after the base `theme.css`, so `src/sanring-theme.css` stays a single plain CSS file you can keep editing by hand.

## 0.20.0

### Minor Changes

- 8c6af5c: New `sanring mcp` command: starts an MCP server over stdio so AI coding agents (Claude Code, Cursor, Windsurf) can query and install components directly, without shelling out. Exposes five tools — `list_components`, `search_components`, `get_component_info`, `plan_component_install` (dry-run preview), and `add_component`.

## 0.19.0

### Minor Changes

- 2778bcb: New `navigation-menu` component: horizontal or vertical top-level navigation with trigger-opened content panels and `link`/`label`/`description`/`separator` primitives. Clicking outside an open panel closes it — this is always-on behavior, not an opt-in prop.

  Also ships `sanring-navigation-menu-viewport`, a shared panel — one fixed size, centered under the trigger group — for bars where you want a single consistent panel instead of a differently sized one per trigger, and `sanring-navigation-menu-sub` submenu flyouts positioned with CDK Overlay (viewport collision fallback, hover-intent, keyboard navigation).

### Patch Changes

- 2778bcb: `sidebar`: `SidebarProviderComponent` had no `host` styling, so the browser rendered it `display: inline` by default. Inside a flex/grid layout that broke the width it was supposed to pass through to its child, throwing off the sidebar/main-content ratio in any app shell wrapping the provider. Fixed with `display: contents`.

  `dialog`: `DialogFooterComponent` only applied `space-x-2` at the `sm:` breakpoint, so stacked buttons on mobile (`flex-col-reverse`) had no gap between them. Added `gap-2` (cancelled back out to `sm:gap-0` where `space-x-2` takes over).

  `otp-input`: slots could get compressed or overflow their container on narrow viewports. Host now caps at `max-w-full overflow-x-auto`; each slot is `shrink-0` so it keeps its configured size instead of being squeezed.

## 0.17.2

### Patch Changes

- 27be1c0: Update component peer dependency handling so `sanring add` also prompts to install peer dependencies when the consumer project has a different version spec, keeping copied components aligned with the registry metadata.

## 0.17.1

### Patch Changes

- `calendar` and `date-picker`'s `peerDependencies` now point at `@sanring/date-picker-core` instead of `@sanring/date-picker` — the upstream project renamed its headless engine package and reassigned `@sanring/date-picker` to an unrelated composed-widget package.
- `otp-input` no longer inserts a typed digit twice on mobile devices — the browser can ignore `keydown`'s `preventDefault()` on virtual keyboards, so the manual keydown update and the browser's own `input` event were both applying the same keystroke.

## 0.17.0

### Minor Changes

- New `otp-input` component: a one-time password input with individual character slots, keyboard navigation, and paste support. Install with `sanring add otp-input`.
- `transfer` gains a select-all control and a selected-item count display in each panel header, and fixes a click handler bug on list items.

## 0.16.0

### Minor Changes

- `transfer` restyled to match the design system's tokens (border/surface/radius/hover), and gained `mode="one-way"` (read-only target panel), per-panel search via `setQuery()`, and per-panel pagination via `pageSize`/`nextPage()`/`previousPage()`.

## 0.15.0

### Minor Changes

- New `transfer` component: a dual-list shuttle for moving items between two panes (e.g. assigning permissions), composed from the existing `checkbox` component. Install with `sanring add transfer`.

## 0.14.0

### Minor Changes

- New `context-menu` component: a right-click menu positioned at the pointer via `@angular/cdk/overlay`, with checkbox items, radio groups, and nested submenus that open on hover with viewport-aware flipping. Install with `sanring add context-menu`.

## 0.13.1

### Patch Changes

- `calendar`'s month/year jump popover selects now show a chevron-down indicator and use consistent padding/spacing, making it visually clearer that they're dropdowns.

## 0.13.0

### Minor Changes

- `switch`'s thumb now accepts projected icons via two named slots — `[sanringSwitchIconChecked]` and `[sanringSwitchIconUnchecked]` — that toggle automatically with the switch's checked state (e.g. a sun/moon icon riding the thumb of a theme toggle). Omitting them is fully backward compatible.

## 0.12.0

### Minor Changes

- `calendar` gains an `orientation` input (`'horizontal' | 'vertical'`) controlling how multiple months (`monthsToDisplay > 1`) are laid out — purely presentational, the underlying engine's month-grid order is untouched.

  Fixes two bugs in the month/year jump popover added last release:
  - The jump `<select>`s' native `[value]` binding raced against their `@for`-rendered `<option>`s, so on open they always showed the first option (e.g. "January" / the earliest year) instead of the month/year currently being viewed. Fixed by binding `[selected]` on each `<option>` directly.
  - The two selects were left-aligned with dead space in the popover; they now share the row evenly (`flex-1`) with centered text.

## 0.11.0

### Minor Changes

- 87a49eb: `calendar`'s header label is now clickable, opening a popover with month/year `<select>` jump controls (±100/50 years from today) instead of only stepping one month at a time. `calendar`'s registry entry now declares `popover` as a `componentDep`, so `sanring add date-picker`/`sanring add calendar` also installs it.

  Fixes two bugs surfaced by that feature:
  - `popover`: `triggerOrigin` is now a signal instead of a plain property. A trigger nested inside an `OnPush` child component (like the calendar header's label button) gets assigned after the popover content's first change-detection pass, so a plain property read stayed `undefined` forever — the overlay never positioned correctly.
  - `tree`: `TreeNodeComponent` implements the no-op `makeFocusable()` the CDK `TreeKeyManager` requires to set the initial roving tab stop, fixing keyboard navigation.

### Patch Changes

- 87a49eb: Internal performance work, no behavior change: `add`/`diff`/`update`/`info`/`remove` now look up components and shared entries through a `createRegistryIndex` map instead of repeated `Array.find`/`.map` scans over the registry, and component/shared file fetches in `add`/`diff`/`update` run through a bounded concurrent worker pool instead of one `await` at a time — noticeable on multi-file components and custom remote registries.
- 87a49eb: Fix `add`/`init` installing peer dependencies via `spawnSync(..., { shell: true })` on a command string split on spaces — a custom `--registry` could supply a package name/version containing shell metacharacters that would be interpreted by the shell. Both commands now build `{ bin, args }` directly and run with `shell: false`.

  `add --shared-path` is now saved to `sanring.config.json`. Previously only the initial install respected it; `diff`/`update`/`remove` always assumed shared utilities lived at `<componentPath>/shared`, so projects using a custom shared path saw drift on every subsequent command.

  `fetchRegistry` now validates the parsed JSON shape (local bundle, `--registry <path>`, and remote fetch) and reports which field is malformed, instead of letting a bad registry fail later inside an unrelated command with a confusing error.

## 0.10.0

### Minor Changes

- 9b04366: `sanring doctor`: new command that checks your environment and project config for common issues. Reports Node.js version, Angular project detection, sanring.config.json validity, theme file presence, per-file hash integrity (untouched / customized / orphaned), and registry reachability. Use `--offline` to skip the network check. Exits with code 1 when hard errors are found so CI pipelines can gate on it.
- b2c1d79: `sanring info` (no argument) now shows project context: CLI version, Angular detection, config path, theme file status, and the full list of installed components. Accepts `--json` for machine-readable output suitable for CI pipelines and coding agents.

  `sanring info <component>` retains its existing behavior (files, peer deps, install status) and also gains `--json` output.

- 9a9b5cf: New `sanring search <query>` command. Searches component names and descriptions (name matches ranked first), highlights the matched substring, and shows a ✔ badge next to already-installed components when run inside an Angular project.

### Patch Changes

- ddc522a: `update` now installs files that were added to a registry component after the user's last `add` — previously these were silently skipped, leaving the component incomplete even after a successful update. `diff` also now surfaces these missing files as "new in registry" so users know to run `sanring update` to pick them up.
- 774f3f7: `sanring update --trust`: users who installed components before v0.9.0 have no recorded hash baseline. Without `--trust` every changed file would show as a conflict even if it was never customised. `--trust` promotes those no-baseline conflicts to silent auto-updates, letting pre-0.9.0 projects catch up cleanly in one pass. A note in the output shows how many files were trusted so the user can audit the assumption afterwards.

## 0.9.2

### Patch Changes

- ce1f66e: Refresh the README (shown on the npm package page): the `diff`/`update` command docs described the old "just prints every diff" behavior instead of the current safe-to-update vs needs-review distinction, and there was no summary of the CLI's current standout features up top.

## 0.9.1

### Patch Changes

- fe5fad8: `diff` now labels each changed file as "safe to update" (registry moved on, you never touched the file) or "needs review" (you customized it), reusing the same baseline-hash comparison `update` uses, and its summary line points you at `sanring update` to apply the safe ones.

## 0.9.0

### Minor Changes

- 6685a1d: `update` now tells apart files you never touched since installing from ones you customized. Untouched files (registry moved on, your copy still matches what `add`/`update` last wrote) apply silently — only files that actually diverged from that baseline show a diff and ask for confirmation. `add` and `init` now record each file's content hash in `sanring.config.json` to make this possible.

## 0.8.0

### Minor Changes

- acfa713: Add three new commands:

  - `sanring info <component>` — shows a component's description, full file list (including auto-added dependencies), and peer dependencies without installing anything.
  - `sanring remove <components...>` (alias `rm`) — removes installed components. Refuses to remove one that another still-installed component depends on unless `--force` is passed; reports shared files that may no longer be needed instead of deleting them automatically.
  - `sanring update [components...]` — walks installed files that differ from the registry and prompts to apply each change, instead of only reporting drift like `diff` does.

## 0.7.1

### Patch Changes

- fdc764f: `sanring --help` now prints a "Quick start" block with the actual init/add command sequence and a note that no npm install is needed, instead of leaving first-time users to find that in the README.

## 0.7.0

### Minor Changes

- e620e62: Add 10 components that were documented on the docs site but missing from the CLI registry: carousel, combobox, command, dropdown-menu, hover-card, pagination, resizable, select, table, and tree. `npx @sanring/cli add <name>` now works for all of them. Also adds two new shared helpers (`collection-controller`, `collection-state`) used by combobox and command.

### Patch Changes

- 3271557: Fix `sanring --version` reporting a hardcoded `0.0.1` instead of the package's actual version. Fix `scrollArea` being registered under the wrong name — `npx @sanring/cli add scroll-area` (matching its docs page and every other kebab-case component name) now works; it previously only responded to `scrollArea`.

## 0.6.1

### Patch Changes

- d97444e: Fix `sanring add field` and `sanring add input`, both of which produced broken installs. `field`'s registry entry only listed `field/index.ts`, but that file re-exports from 4 other source files that were never shipped — `registry/components/field/` itself was missing everything but an empty `index.ts`. Separately, `input`'s shipped `input.directive.ts` was a stale pre-Field-integration version with no `SanringFieldControl` implementation, ARIA wiring, or Angular Forms validation state, and its registry entry didn't declare `field` as a `componentDeps` even though it imports from it.

  `field` now ships its full source (`field.component.ts`, `field.type.ts`, `label.directive.ts`, `description.directive.ts`, `error-message.component.ts`) and both entries declare the `@angular/forms` peer dependency they actually need. `input` now installs `field` automatically, matching the current `@sanring/ui` implementation.

## 0.6.0

### Minor Changes

- 205c89d: `init` now writes `src/sanring-theme.css` — the full set of `--sanring-*` design tokens every component reads (color scales, semantic colors, radius, progress/badge tokens). Previously these variables only existed inside the docs app itself, so a fresh `sanring init` + `sanring add` produced components with no visible styling. Existing files are left alone by default (protects any brand-color edits); pass `-f/--force` to reset to the shipped defaults. Also adds the `--sanring-primary`/`--sanring-primary-fg` alias needed for Radio and Checkbox's Tailwind-bridged `bg-primary`/`text-primary`/`border-primary` utilities to resolve.

  New `sanring diff [components...]` command. Sanring UI has no version concept — components are copied source, not npm packages — so there was previously no way to know if a local file had drifted from the registry before `add --force` overwrote it. `diff` compares installed components and `sanring-theme.css` against the current registry line by line, printing what's been customized locally versus what changed upstream. Omit component names to check everything currently installed.

## 0.5.1

### Patch Changes

- 5641f88: Sync `registry/shared/utils.ts` with `@sanring/ui`'s `utils.ts`, adding the `uniqueId()` helper. Components with `sharedDeps: ["utils"]` were missing this function, which the in-progress Field/Input `id` generation now depends on.

## 0.5.0

### Minor Changes

- b5211cc: Registry now includes `alert-dialog`, `slider`, `stepper`, and `timeline` components.

  - `sanring add alert-dialog` — a Dialog variant requiring an explicit user choice (cannot be dismissed by backdrop or Escape). Includes `sanringAlertDialogTrigger`, `sanringAlertDialogAction`, and `sanringAlertDialogCancel` directives. Installing it also installs `dialog` as a dependency.
  - `sanring add slider` — a range control with pointer, keyboard, and ARIA slider semantics, plus Angular forms support.
  - `sanring add stepper` — a multi-step workflow built on Angular CDK Stepper, with template labels, custom icons, and solid or dashed connectors.
  - `sanring add timeline` — chronological event/process primitives with vertical and horizontal orientation.

  Also updates the `dialog` component: adds `DialogMedia` for an icon badge above the title, `sanringDialogTrigger` now accepts an optional `sanringDialogConfig` to override CDK `DialogConfig` per-trigger, and `sanringDialogClose` accepts an optional result value (`[sanringDialogClose]="result"`).

## 0.4.0

### Minor Changes

- 20c768d: Registry now includes `aspect-ratio` and `textarea` components (`sanring add aspect-ratio`, `sanring add textarea`). `@sanring/ui`'s `input` directive no longer targets `<textarea>` — use the new `sanringTextarea` directive instead when re-copying the `input` component.

## 0.3.0

### Minor Changes

- 6cc0001: `add` now accepts multiple component names (`sanring add button dialog`) and automatically installs a component's `componentDeps` (e.g. `sanring add tag` also adds `badge`), labeling auto-added components `(dependency)` in the output. Shared files and peer dependencies are deduped and installed once across the whole batch. Single-component usage is unaffected.

## 0.2.1

### Patch Changes

- 5ffb8f9: Fix `packages/cli/registry` (bundled with the published package) silently drifting from the root `registry/` source of truth. `pnpm build` now runs a `sync-registry` step that mirrors root `registry/` into the package and fails the build if `registry.json` references a file that doesn't exist, so a stale/broken registry can no longer ship unnoticed.

  Also fix the version-pinned remote registry fallback (used when the bundled registry is missing, e.g. before a first build): it referenced a `v<version>` git tag and `packages/cli/registry`, neither of which ever existed — Changesets tags releases as `<package-name>@<version>`, and `packages/cli/registry` is gitignored so it's never committed. The fallback now points at the correct tag (URL-encoded `refs/tags/@sanring/cli@<version>`) and the repo-root `registry/` directory, and was verified end-to-end against the real GitHub repo.

  Adds unit tests for package-manager detection, config read/write, and registry source-resolution priority (local path → URL → bundled registry → remote fallback).

## 0.2.0

### Minor Changes

- edee46d: Add `--dry-run` to `add`, previewing which files would be created or overwritten without writing to disk or installing dependencies.

## 0.1.0

### Minor Changes

- db4d79a: Add `init` command, auto-install peer dependencies, and spinner UX

### Patch Changes

- 1d9ef19: feat: 自動偵測 package manager（npm/pnpm/yarn/bun）
