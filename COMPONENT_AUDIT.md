# Component Audit Matrix

This matrix tracks the production-readiness audit for Sanring UI components.
It is intentionally separate from `todolist.md`: the todo list tracks roadmap
items, while this file tracks per-component evidence and follow-up actions.

## Audit Rubric

Each component should eventually have a conclusion for these fields:

- `surface`: `registry`, `packages/ui`, docs page, and `public-api.ts` are aligned.
- `spec`: at least one focused spec exists for render, class merging, and core behavior.
- `a11y`: roles, ARIA attributes, labeling, disabled states, and focus semantics are reviewed.
- `keyboard`: expected keyboard interaction is documented and tested where applicable.
- `api`: inputs, outputs, selectors, naming, and state model are stable and coherent.
- `ssr`: no browser-only access during construction/render without a platform guard.
- `docs`: docs include usage, installation, API, accessibility notes, keyboard behavior, and state model where relevant.
- `risk`: initial audit priority, not final quality judgment.
- `next`: the next concrete action.

## Priority Batches

1. High-risk interaction components:
   `dialog`, `alert-dialog`, `popover`, `select`, `combobox`, `command`,
   `dropdown-menu`, `context-menu`, `tooltip`, `sheet`.
2. Form/control components:
   `input`, `field`, `checkbox`, `radio`, `switch`, `slider`, `date-picker`,
   `calendar`, `file-upload`, `otp-input`, `textarea`.
3. Display/layout components:
   `accordion`, `tabs`, `table`, `carousel`, `resizable`, `avatar`,
   `breadcrumb`, `card`, `alert`, `badge`, `progress`, `sidebar`, `skeleton`, `spinner`,
   `tag`, `timeline`, `tree`, plus other low-risk display primitives.

## Current Snapshot

- Registry components: 51
- Surface alignment: all 51 components currently exist in `registry`, `packages/ui`, docs pages, and `public-api.ts`.
- Components without package specs: 1 (`sidebar`; newly added after the P4 minimum-spec baseline)
- Manual a11y / keyboard / API / SSR review: **Batch 1 (10 high-interaction components) reviewed, all 3 P0s fixed** (`select` keyboard nav, `command` spec suite, `context-menu` keyboard nav + spec suite). **Batch 2 (11 form/control components) reviewed, all 3 findings fixed** (`switch` gained a `checkedChange` output and a real `ariaLabel`/`ariaLabelledBy` input — the latter also fixed an identical bug in the live demo page, not just the docs code sample; `checkbox`/`radio-group` now bind `aria-required` to `fieldRequired` so `Validators.required`-only forms are announced correctly). **Batch 3 (16 display/layout components) reviewed, findings fixed** — `avatar`'s `MutationObserver` and `carousel`'s `EmblaCarousel()`/`ResizeObserver` are now both deferred to `afterNextRender` (SSR-safe); `resizable`'s handle now exposes `aria-valuenow`/`min`/`max`; `progress` now forwards `ariaValueText` to the underlying directive. The `table` pagination finding (docs referencing a nonexistent `<sanring-paginator>`) turned out to be stale by the time it was investigated — `PaginatorComponent` was added independently while this batch was in progress and its real API matches the docs exactly, so no fix was needed there. `tabs`' `selectionMode`/`orientation` documentation is still outstanding.

## Matrix

| Component | Batch | Risk | Surface | Specs | A11y | Keyboard | API | SSR | Docs | Next |
|---|---|---:|---|---:|---|---|---|---|---|---|
| accordion | display-layout | Low | OK | 1 | OK (`role`/`aria-expanded`/`aria-controls` all come from `@angular/aria`'s `NgAccordionGroup`/`AccordionTrigger`, verified by spec) | OK (Enter/Space tested; Arrow/Home/End implemented upstream in `@angular/aria` but not exercised by this repo's spec) | Inconsistent (`disabled` exists independently at both group level and item level with no prefix/qualifier distinguishing them) | OK (`afterNextRender` used correctly) | Partial | Flat API table conflates 3 sub-components' inputs into one list; add `class`/group-level `disabled`/`softDisabled`/`wrap` to docs |
| alert | display-layout | Low | OK | 1 | OK (`role="alert"`, verified by spec) | N/A | OK | OK | Partial | `class` input documented default `''` vs actual `undefined`; title/description directive `class` inputs undocumented |
| alert-dialog | high-interaction | High | OK | 1 | OK | OK | OK | OK | Partial | Document `closeAriaLabel`; add a regression spec for the `extends DialogContentComponent` fragility noted in source (see Batch 1 Findings) |
| aspect-ratio | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Review after high-risk batch |
| avatar | display-layout | Low | OK | 1 | OK | OK (`avatar-group-count`'s clickable mode has real `(keydown.enter)`/`(keydown.space)` handling, Space-key tested by spec) | OK | **Bug**: `AvatarImageDirective` constructs `new MutationObserver(...)` as a field initializer and calls `.observe()` synchronously in the constructor, with no `afterNextRender`/`isPlatformBrowser` guard anywhere in the directory — will throw in an SSR context without a `MutationObserver` polyfill | Partial | **Fix**: guard the `MutationObserver` construction/`.observe()` call with `afterNextRender`; document `avatar-group-count`'s `clickable` input and `clicked` output (implemented + tested, entirely undocumented and absent from every example) |
| badge | display-layout | Low | OK | 1 | N/A (correctly no role/aria — purely decorative styling directive, works on span/div/a) | N/A | OK | OK | OK | None — clean |
| breadcrumb | display-layout | Low | OK | 1 | OK (`role="navigation"`, `aria-current="page"` on the current-page item, `aria-hidden` on decorative divider/ellipsis — all verified by spec) | N/A | OK | OK | Partial | `class` input collapsed into one generic row across all 7 sub-components |
| button | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| calendar | form-control | Medium | OK | 1 | OK | Delegated (all keyboard logic lives in `@sanring/date-picker-core`, no in-repo code) | OK | OK (minor: `new Date()` inside a `computed()` for year options — tiny SSR/hydration mismatch risk at a day boundary) | Partial | API table gap fixed for `id`/`required`/`ariaDescribedBy`/jump labels/`focus()`; still needs broader accessibility/state notes |
| card | display-layout | Low | OK | 1 | N/A (correctly no ARIA — purely structural, no semantics to override) | N/A | OK | OK | OK | None — clean, proportionate to its (small) actual surface |
| carousel | display-layout | Low | OK | 1 | Gap (no `aria-live` region anywhere — slide changes update visually/silently with no screen-reader announcement, the classic carousel a11y failure; no `aria-current` on the active slide either) | Partial (Arrow-only via bubbling `keydown` on the region — no Home/End, and the region itself has no `tabindex` so a keyboard user must already be inside a focusable descendant for it to receive events) | OK | **Bug**: `EmblaCarousel(...)` (which internally does `new ResizeObserver(...)`) is called unconditionally inside `ngAfterViewInit()` with no `afterNextRender`/`isPlatformBrowser` guard — same class of SSR risk as avatar's `MutationObserver` | Partial | **Fix**: guard `EmblaCarousel()` initialization for SSR; consider an `aria-live` region announcing the current slide; `class` on content/item sub-components undocumented |
| checkbox | form-control | Medium | OK | 2 | OK (fixed — `aria-required` now bound to `fieldRequired`, covers `Validators.required`-only forms too) | OK (native `<button>`, Enter explicitly suppressed to match native checkbox semantics) | OK | OK | OK | None — clean |
| collapsible | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| combobox | high-interaction | High | OK | 1 | OK | Partial (no typeahead / Home-End) | OK | OK (minor) | Partial | Add a plain component spec — only `.field.spec.ts` exists today, zero coverage of keyboard nav/multi-select/chips/clear (see Batch 1 Findings) |
| command | high-interaction | High | OK | 1 | OK (`aria-expanded="true"` is intentionally static — this component's list has no collapsed state distinct from being unmounted, see Batch 1 Findings) | OK (arrow-key nav/Enter/filter/disabled-skip now covered by spec) | Inconsistent (no value/model/CVA at all) | OK | Partial | Clean up the dead-code branch in `onKeydown` noted in Batch 1 Findings |
| context-menu | high-interaction | High | OK | 1 | OK (fixed — `sub-trigger` now sets `aria-disabled`; submenu still doesn't restore focus to the root trigger on close, only sub-menus restore to their own sub-trigger) | OK (fixed — ArrowUp/Down now navigate both the root menu and any open submenu, skipping disabled items and wrapping; still no Home/End/typeahead) | OK | OK | Partial | Consider restoring focus to the original right-click target when the root menu closes (currently no-op); add Home/End for parity if picked up later |
| date-picker | form-control | Medium | OK | 1 | OK | Delegated (all keyboard logic lives in `@sanring/date-picker-core`, no in-repo code) | OK | OK | Partial | API table gap fixed for `id`/`required`/`ariaDescribedBy`/`focus()`; still needs broader accessibility/state notes |
| dialog | high-interaction | High | OK | 1 | OK | OK (CDK-delegated, verified by spec) | OK | OK | Partial | Add `sanringDialogTrigger` + `closeAriaLabel` to the API table |
| divider | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Minimum spec added; review after high-risk batch |
| dropdown-menu | high-interaction | High | OK | 1 | OK (delegated to `@angular/aria/menu`) | Delegated (all keyboard logic lives in the external package, nothing in-repo to review) | Inconsistent (no public open-state model, unlike every sibling) | OK | Partial | `typeaheadDelay`/`wrap` docs fixed; still decide whether to expose `isOpen`/`openChange` for parity with siblings |
| field | form-control | Medium | OK | 1 | OK (label `for`/`aria-describedby` wiring is genuinely dynamic and correct when a control is projected) | N/A | OK | OK | OK | None — this one's clean |
| file-upload | form-control | Medium | OK | 2 | Gap (`FileDropzoneComponent` has no `role`/`tabindex`/keyboard handling of its own — relies entirely on a projected `sanringFileTrigger` button for both semantics and keyboard access) | Gap (`FileTriggerDirective` has zero keyboard handling of its own — Enter/Space-to-activate only works because every real usage happens to apply it to a native `<button>`; nothing enforces or warns against misuse on a non-interactive element) | OK | OK (minor: `URL.createObjectURL`/`revokeObjectURL` in an unguarded constructor `effect()` in `file-item.component.ts` — low risk since effects don't run during SSR, but no explicit guard either) | Partial | Core validation logic (`handleFiles`/`validateFiles`/dedup/max-size/max-files) has zero direct test coverage; consider hardening `FileTriggerDirective` against non-button hosts (see Batch 2 Findings) |
| hover-card | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Minimum spec added; review after high-risk batch |
| input | form-control | Medium | OK | 1 | OK (`aria-invalid`/`aria-required` dynamic; `aria-describedby` wired imperatively via `setAttribute` from the field, works but bypasses declarative host bindings) | OK (native `<input>`, no custom handling needed) | OK | OK | OK | `setDescribedByIds()` is byte-for-byte duplicated between `InputDirective` and `TextareaDirective` — consider sharing (see Batch 2 Findings) |
| label | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Minimum spec added; review after high-risk batch |
| link | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Minimum spec added; review after high-risk batch |
| otp-input | form-control | Medium | OK | 1 | OK (real single `<input>` drives all interaction; visible slots are `aria-hidden` decoration) | OK (Arrow/Home/End/Backspace/Delete/paste all implemented, well specced) | OK | OK | Partial | API table gap fixed; still needs broader accessibility/state notes |
| pagination | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| popover | high-interaction | High | OK | 1 | OK (verified by spec) | OK (Escape only; no focus trap — likely intentional for a non-modal popover) | OK | OK | Partial | Document the no-focus-trap design decision explicitly |
| progress | display-layout | Low | OK | 1 | Gap (`ProgressDirective` supports `ariaValueText`, but `ProgressComponent`'s template never forwards it, making it unreachable via `<sanring-progress>`; `aria-valuemin` is hardcoded `0`, not configurable) | N/A | OK | OK | OK | Forward `ariaValueText` from `ProgressComponent` to the directive, or remove the dead capability |
| radio | form-control | Medium | OK | 2 | OK (fixed — group's `aria-required` now bound to `fieldRequired`, same fix as checkbox) | OK (full roving-tabindex APG radiogroup pattern: Arrow/Home/End with wrap, Space explicit, Enter suppressed) | OK | OK | Partial | `RadioGroupComponent.id` docs fixed; consider a dedicated `RadioItemComponent` spec later |
| resizable | display-layout | Low | OK | 1 | Gap (`role="separator"` is real and keyboard-adjustable, but has no `aria-valuenow`/`aria-valuemin`/`aria-valuemax` — a bigger gap here than on a static separator since this one is genuinely operable) | OK (Arrow keys + Home/End implemented and tested, RTL-aware) | OK | OK | OK (best-documented of the batch — component-prefixed rows) | Add `aria-valuenow`/`min`/`max` to the handle; drag/touch interaction path is entirely untested (only keyboard is) |
| scroll-area | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| select | high-interaction | High | OK | 2 | OK (roving tabindex, verified by spec) | OK (fixed — `FocusKeyManager` now drives ArrowUp/Down + initial focus on open, with disabled-item skip/wrap; see Batch 1 Findings) | Inconsistent (no `disabled` input(); `value` is a getter, not a model) | OK | Partial | `value` getter distinction documented; consider adding typeahead/Home-End for parity with combobox/command |
| sheet | high-interaction | High | OK | 1 | Gap (`aria-labelledby`/`describedby` stay bound even when no title/description is projected) | OK (Escape + `cdkTrapFocus`) but no way to disable Escape-close | Inconsistent (only sibling with a 2-way `isOpen` model; `sanringSheetClose` can't carry a result) | Gap (2 of 3 constructor effects touch `window`/`document` unguarded; only the focus effect uses `afterNextRender`) | Partial (fixed — removed nonexistent `showClose` API/example) | Guard the scroll-lock effect with `afterNextRender`; decide whether to add a real close-button API later |
| sidebar | display-layout | Low | OK | 0 | Partial (persistent layout primitive; no focus trap/background hiding by design, but no spec coverage yet) | Native (menu buttons are anchors/buttons; trigger click behavior only, no custom roving focus) | Initial (new API: `open`, `collapsible`, `id`, menu button `active`/`disabled`) | OK | OK | Add minimum spec for render/class merging, `collapsible` modes, trigger toggle, and menu button active/disabled behavior |
| skeleton | display-layout | Low | OK | 1 | OK (`aria-hidden="true"`, verified by spec) | N/A | OK | OK | Partial | `class` input documented default `''` vs actual `undefined` |
| slider | form-control | Medium | OK | 2 | OK (`role="slider"` + full valuemin/max/now/text, `aria-orientation` hard-coded horizontal — no vertical mode exists so this is currently accurate) | OK (Arrow×4/Home/End/PageUp/PageDown all implemented + pointer drag) | OK | OK | Partial | API table gap fixed; still needs broader accessibility/state notes |
| spinner | display-layout | Low | OK | 1 | OK (`role="status"` + `aria-label` bound to the `ariaLabel` input, default `'Loading'`, verified by spec) | N/A | OK | OK | OK (most complete/accurate table in the whole batch) | None critical — only `loader`/`loader-circle` icon variants untested (spec only exercises `pinwheel`) |
| stepper | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| switch | form-control | Medium | OK | 2 | OK (fixed — added real `ariaLabel`/`ariaLabelledBy` inputs forwarding to `[attr.aria-label]`/`[attr.aria-labelledby]` on the button; fixed both the docs code sample *and* the live demo template in `switch-page.component.ts`, which had the same bug independently via `[attr.aria-label]` instead of the property) | OK (native `<button>`; Space **and** Enter both toggle, matching the ARIA APG switch pattern — intentionally different from checkbox/radio, which suppress Enter) | OK (fixed — added `checkedChange` output for parity with checkbox) | OK | OK (fixed) | None — 4 new specs added (click toggles + emits, ariaLabel forwarding, disabled ignores clicks) |
| table | display-layout | Low | OK | 1 | OK (real native `<table>`; a previously-misleading `role="grid"` was already removed per the component's own `todolist.md` — good sign) | OK (sort headers use a real `<button>`, native keyboard access, verified by spec) | OK | OK | OK (correction: `<sanring-paginator>` was flagged as missing during this audit, but `packages/ui/src/lib/components/pagination/paginator.component.ts` now exists — a real, registered `PaginatorComponent` with `pageIndex`/`pageSize`/`length`/`pageChange` matching the docs example exactly, verified directly. Landed independently while this audit was in progress) | None — the earlier finding no longer applies |
| tabs | display-layout | Low | OK | 1 | OK (`role`/`aria-selected`/`aria-controls`/`aria-labelledby` all come from `@angular/aria`'s `NgTabs`/`NgTabList`/`NgTab`, verified by spec) | Delegated (Arrow/Home/End + automatic activation-on-focus all live in `@angular/aria`, not exercised by this repo's spec — only 2 shallow mouse-driven tests exist) | Gap (`orientation` is set independently on both `<sanring-tabs>` (styling only) and `<sanring-tabs-list>` (drives real keyboard-nav axis) with no sync between them — the docs' own vertical example sets it on both, confirming the duplication is real) | OK | Partial | `selectionMode` (automatic vs. manual tab activation) is a real, consumer-overridable capability that is completely undocumented anywhere; add a keyboard-navigation spec (currently zero) |
| tag | display-layout | Low | OK | 1 | OK (remove button has a dynamic `aria-label`, verified by spec) | OK (remove control is a real `<button>` — free native keyboard access, no custom handling needed) | OK | OK | OK | The remove button's actual `(remove)` emission is untested — the one spec only covers `aria-label` text customization, never dispatches a click/keypress |
| textarea | form-control | Medium | OK | 1 | OK (same dynamic `aria-invalid`/`aria-required` pattern as input) | OK (native `<textarea>`, no custom handling needed) | Inconsistent (`class` input has no default — `input<string \| undefined>()` — while input/field/label/description/error-message all default it to `''`) | OK | Partial (docs claim `class` defaults to `''`, source default is actually `undefined`) | Align `class` input's type/default with the rest of the family; no Field-integration spec exists (only class-merging is tested, unlike input's `.field.spec.ts`) |
| timeline | display-layout | Low | OK | 1 | OK (`role="list"`/`"listitem"`/`aria-hidden` on the separator, verified by spec — explicitly re-added because Tailwind Preflight strips native `ul`/`li`'s implicit role) | N/A | OK | OK | OK (component-prefixed rows, matches source) | None critical |
| toast | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| toggle | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| tooltip | high-interaction | High | OK | 1 | OK (verified by spec) | Gap (no touch/coarse-pointer support; Escape handling duplicated in trigger + content) | Inconsistent (`isOpen` is a plain signal, not a `model()` — can't be bound externally unlike popover/sheet/context-menu) | OK | Partial | Add touch/coarse-pointer support (or document the hover-only limitation); expand spec coverage (1 test today) |
| transfer | display-layout | Low | OK | 6 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| tree | display-layout | Low | OK | 1 | OK (minor: no `aria-level`/`aria-setsize`/`aria-posinset`, optional treeview-pattern enhancements) | OK (real CDK `TreeKeyManager`, roving tabindex, well tested with actual keydown dispatch) | OK | OK | Partial | `class` input collapsed into one generic row across 3 sub-components; Left/Right/Home/End/typeahead implemented via CDK but not independently tested in this repo |

## Batch 1 Findings — High-Risk Interaction Components

Evidence gathered by reading the actual source (`packages/ui/src/lib/components/<name>/`),
existing spec files, and the corresponding `.docs.ts` files — not inferred. File:line
references point at `packages/ui/src/lib/components/` unless noted otherwise.

**Three P0s stood out across the batch, all fixed**: `select` couldn't be navigated between
options with the keyboard once its listbox was open (Arrow keys only opened it);
`context-menu` had no arrow-key navigation between items at all; `context-menu`/`command`
both had zero automated test coverage. See the per-component write-ups below for what
changed and how it was verified.

### dialog
- Shares its underlying mechanism with `alert-dialog` via `dialog.service.ts`, which wraps
  `@angular/cdk/dialog`'s `Dialog` with `autoFocus:'first-tabbable'`, `restoreFocus:true`,
  `ariaModal:true` (`dialog/dialog.service.ts:29-34`).
  `aria-labelledby`/`aria-describedby` are wired dynamically in `ngAfterContentInit` only
  when a `DialogTitleDirective`/`DialogDescriptionDirective` is actually content-projected
  (`dialog-content.component.ts:96-117`) — no fallback if absent. `clearDialogAria()` only
  removes `aria-describedby`, not `aria-labelledby`, on close (asymmetric, likely harmless
  since the container is destroyed anyway).
- Escape/backdrop-close and focus trap/restore are 100% delegated to CDK — zero custom
  keyboard code in this repo, verified working by `dialog.component.spec.ts`.
- No direct `document`/`window` access anywhere in the directory.
- No `@Output()`/`output()` anywhere in the family — open/close is entirely imperative via
  `DialogRef.closed`. `sanringDialogTrigger` (the primary way to open a dialog) and
  `closeAriaLabel` are missing from the docs `apiRows` table.

### alert-dialog
- Thin decorator over `DialogService`: `alert-dialog.service.ts:30-34` spreads
  `{ role: 'alertdialog', disableClose: true }` **after** the caller's config, so neither can
  be overridden — verified by 4 dedicated specs.
- `AlertDialogContentComponent extends DialogContentComponent` rather than wrapping it
  (`alert-dialog-content.component.ts:5-9`); the source comment itself flags this as fragile
  because the inherited `@ContentChild` queries resolve relative to wherever the subclass is
  instantiated, and would break if content were passed through a nested `<ng-content>`
  wrapper. No regression spec exists for that scenario.
- Docs document the action/cancel directives' *resolved* default (`true`/`false`) rather than
  their literal source default (`''`, resolved at click time) — not wrong for consumers, but
  worth a note. `closeAriaLabel` is undocumented here too.

### sheet
- **Does not use `@angular/cdk/dialog`** at all — it injects `Overlay` directly and
  hand-rolls focus-restore, background `aria-hidden`, and scroll-lock
  (`sheet-content.component.ts:197-236`) instead of getting them from CDK for free.
- **Docs bug — fixed in P5 first pass**: `sheet.docs.ts` documented a `showClose` input and
  used `[showClose]="false"` in the `noClose` code example, but `showClose` does not exist
  anywhere in `sheet/`. The docs now remove that fake API and show an explicit
  `sanringSheetClose` custom close control instead.
- **SSR inconsistency**: two `effect()`s registered in the constructor touch `window`/
  `document` with no guard — the scroll-lock effect (`sheet-content.component.ts:118-127`,
  reads `window.innerWidth`/`document.documentElement`, writes `document.body.style`) and the
  attach/detach effect (lines 130-136, touches `document.activeElement` /
  `document.body.children`). A third effect in the same file correctly defers its DOM read to
  `afterNextRender` (lines 141-145) with a comment explaining why — the other two should use
  the same pattern.
- `aria-labelledby`/`aria-describedby` are unconditionally bound to `sheet.titleId`/`descId`
  (`sheet-content.component.ts:73-74`) regardless of whether a `sanring-sheet-title`/
  `-description` is actually projected — unlike Dialog, which only sets these attributes when
  the corresponding directive is found. A sheet without a title projects a dangling
  `aria-labelledby` reference.
- API is the least consistent with its siblings: `isOpen` is the only two-way `model()` among
  dialog/alert-dialog/sheet; the trigger has no config input (no way to disable Escape-close,
  unlike Dialog's `disableClose`); `sanringSheetClose` can't carry a result value the way
  `sanringDialogClose`/`sanringAlertDialogAction` can.

### popover
- `aria-labelledby`/`aria-describedby` are genuinely dynamic (wired to `PopoverTitleComponent`
  /`PopoverDescriptionComponent`'s generated ids) and verified by spec
  (`popover.component.spec.ts:78-79`). `aria-controls` on the trigger is only present while
  open (`popover-trigger.directive.ts:9-14`).
- Only Escape is handled (`popover-content.component.ts:169-174`); no focus trap and no
  explicit focus-restore-to-trigger call anywhere. This is a reasonable choice for a
  non-modal popover per WAI-ARIA, but it isn't stated anywhere as an intentional design
  decision — worth a one-line doc note so it doesn't read as an oversight.
- No `document`/`window` access anywhere in the directory.

### tooltip
- `aria-describedby` is dynamic and only present while open, verified by the (single) spec.
- **No touch/coarse-pointer handling at all** — confirmed via grep for `touch`/`pointerType`/
  `matchMedia`, zero hits. The trigger only listens to `mouseenter`/`mouseleave`/`focus`/
  `blur` (`tooltip-trigger.directive.ts:11-14`). On a touch device there is no hover, so a
  tooltip built this way is effectively unreachable there.
- Escape is handled in **two** places independently (`tooltip-content.component.ts:89-97` and
  `tooltip-trigger.directive.ts:15,33-41`) — duplicated rather than shared.
- `TooltipComponent.isOpen` is a plain internal `signal(false)`, not an `input()`/`model()`
  (`tooltip.component.ts:19`) — unlike popover/sheet/context-menu, it cannot be externally
  bound or controlled.
- Spec coverage is a single `it()` block — no coverage of `delayDuration`, `side`/
  `sideOffset`, or the mouse/focus/blur triggers individually.

### dropdown-menu
- Architecturally different from the other menu-like components: it delegates ARIA roles and
  all keyboard handling to `@angular/aria/menu` (`Menu`/`MenuItem`/`MenuTrigger` via
  `hostDirectives`) — confirmed by source comments
  (`dropdown-menu-content.component.ts:19-23`, `dropdown-menu-item.directive.ts:7-11`) stating
  the host bindings and keyboard/mouse events are handled entirely by the external package.
  There is **no custom keyboard code in this repo to audit** for arrow-nav/typeahead/Home-End
  — it either works because the upstream package implements it, or it doesn't; this repo has
  no spec exercising it either way.
- **No public open-state API at all** — `DropdownMenuComponent` has zero inputs/outputs, and
  state lives entirely inside `ngMenuTrigger.expanded()`, exposed only via `aria-expanded`/
  `data-visible` attributes. Every sibling with an open/close concept (popover, sheet,
  context-menu) exposes it as a public `model()`; dropdown-menu is the outlier.
- `typeaheadDelay`, `wrap`, and `id` are real pass-through inputs from the `ngMenu`
  hostDirective (`dropdown-menu-content.component.ts:10-16`) but are absent from the docs
  `apiRows` — `typeaheadDelay` in particular is the only clue in this repo that typeahead
  search exists at all, and it isn't documented.

### context-menu
- **Zero `.spec.ts` files — fixed**: added `context-menu.component.spec.ts` (7 tests:
  render, ArrowUp/Down navigation with disabled-item skip and wrap, Enter-to-select +
  `itemSelected` emit + close, Escape-to-close, checkbox toggle, radio-group selection,
  submenu open/navigate/close-with-refocus).
- **No arrow-key navigation between sibling items — fixed**: added
  `focusAdjacentMenuItem()` in a new shared `packages/ui/src/lib/components/shared/
  menu-navigation.ts`, wired into both `ContextMenuContentComponent` and
  `ContextMenuSubContentComponent`'s existing `overlayRef.keydownEvents()` subscriptions
  (the same channel Escape already used). Plain DOM traversal rather than a CDK key
  manager — items use real per-item `tabindex="0"/"-1"` focus (same model as `select`) but
  are spread across four different component classes (item/checkbox-item/radio-item/
  sub-trigger) with no common base to query via Angular's typed `contentChildren()`, so a
  `FocusKeyManager<T>` wasn't a clean fit here the way it was for `select`.
  **Caught and fixed a real bug in the first draft of this fix while writing the spec**: a
  closed submenu's `<sanring-context-menu-sub-content>` stays in the DOM (just CSS-hidden)
  until actually opened, so a naive `querySelectorAll('[tabindex="0"][role^="menuitem"]')`
  on the root menu also picked up the (invisible) submenu's items. Fixed by filtering to
  items whose nearest `[role="menu"]` ancestor is the container being navigated —
  checkbox/radio items are still correctly included (they sit directly in the root menu,
  not inside a nested `role="menu"`), only genuinely-nested submenu items are excluded.
  Verified with the new specs and manually in a real browser via Playwright (ArrowDown
  correctly skips the disabled item, Escape correctly flips `aria-expanded` back to
  `false`, no console errors).
- `ContextMenuItemComponent`/`CheckboxItemComponent`/`RadioItemComponent` each independently
  implement identical `(keydown.enter)`/`(keydown.space)` handlers
  (e.g. `context-menu-item.component.ts:27-28`) — duplicated three times instead of shared.
  Not touched by this fix; still worth consolidating later.
- `ContextMenuSubTriggerComponent` sets `data-disabled` but not `aria-disabled` when disabled
  — **fixed**, now sets `[attr.aria-disabled]` matching its sibling item components.
- Focus restoration on close still only exists for submenus (back to the sub-trigger,
  `context-menu-sub-content.component.ts`) — the root menu's Escape/close path still doesn't
  restore focus to the original right-click target. Not part of this fix's scope (arrow-key
  navigation), left as a follow-up.
- `ContextMenuComponent.isOpen` (the model controlling the whole menu) is entirely absent
  from the docs `apiRows` table.

### select
- **P0 keyboard gap — fixed**: `select-trigger.directive.ts:27-30` maps ArrowDown/ArrowUp
  (along with Enter/Space) to `onOpenKeydown`, which only called `select.setOpen(true)` — it
  never moved an active/highlighted item, and once open, the only way to move between options
  was native Tab order. Fixed by giving `SelectContentComponent` a CDK `FocusKeyManager` (the
  real-DOM-focus analog of the `ActiveDescendantKeyManager` combobox/command already use via
  `CollectionController` — select uses real per-item focus/tabindex rather than
  `aria-activedescendant`, so `FocusKeyManager` is the correct fit): `.withWrap()`,
  `.withVerticalOrientation()`, `.skipPredicate((item) => item.disabled)`. The listbox now
  also moves focus to the selected (or first enabled) option as soon as it opens
  (`focusInitialItem()`, called from `(attach)`), matching the standard select/combobox
  keyboard pattern. `SelectItemComponent` now implements `FocusableOption` (`focus()`,
  `getLabel()`, plus a `disabled` getter — its `disabled` input was renamed to `disabledInput`
  with an alias, same workaround combobox-item/command-item already use for the identical
  `Highlightable.disabled` conflict). Verified with new specs in `select.component.spec.ts`
  (initial-focus-on-open, Arrow-key wrap-over-disabled-item in both directions, Enter-to-select)
  and manually in a real browser via Playwright (arrow keys move the highlighted option,
  Enter commits it, no console errors).
- `SelectComponent` has no `disabled` `input()` — the only way to disable it is via
  `ControlValueAccessor.setDisabledState()` (reactive forms), unlike combobox which has a
  plain standalone `disabled` input. `SelectComponent.value` is a read-only getter derived
  from `selectedValue`, not a settable input/model, but is documented in `apiRows` without
  that distinction.
- Still no typeahead or Home/End — `FocusKeyManager` supports both via `.withTypeAhead()`/
  `.withHomeAndEnd()`, not enabled here (kept the fix scoped to the reported gap: basic
  Arrow-key navigation). Worth adding for parity with combobox/command if picked up later.

### combobox
- Full ARIA combobox pattern is genuinely wired: `aria-expanded`/`aria-controls`/
  `aria-activedescendant` all dynamically bound (`combobox-input.component.ts:26-33`) via the
  shared `CollectionController`'s `ActiveDescendantKeyManager`
  (`shared/collection-controller.ts:1-64`). Arrow keys and Enter work correctly through this.
- `.withTypeAhead()`/`.withHomeAndEnd()` are **never called** anywhere in the codebase
  (confirmed via grep) — so neither combobox nor command (which share this controller) support
  typeahead search or Home/End, despite `ActiveDescendantKeyManager` supporting both.
- Only `combobox.field.spec.ts` exists (form-integration focused, 2 tests) — there is no plain
  component spec, so keyboard navigation, multi-select/chip removal, the clear button, and
  disabled state all have zero test coverage.
- `combobox-content.component.ts:52-56` registers a `document:pointerdown` `@HostListener`
  with no explicit platform guard — low risk since Angular's event plugin abstracts the
  global target, but inconsistent with the SSR-conscious pattern used in `sheet`'s one correct
  effect.
- `ComboboxComponent.required` input and `ComboboxItemComponent.disabled` (aliased) are
  missing from the docs `apiRows`.

### command
- `command-input.component.ts` sets `aria-expanded="true"` as a static string rather than a
  dynamic binding, unlike select/combobox — **verified this is not a bug**: `sanring-command`'s
  list has no collapsed state distinct from the whole component being unmounted (confirmed via
  the docs' basic usage example, where `<sanring-command-list>` renders unconditionally right
  under the input, not behind any open/closed toggle), so a dynamic binding would always
  resolve to `true` anyway. Leaving it static is fine; just inconsistent-looking next to
  select/combobox's dynamic bindings for the same attribute name.
- **Zero `.spec.ts` files exist** — no coverage of keyboard nav, the ⌘K/Ctrl+K toggle,
  filtering, or the shared `CollectionController` as consumed here.
- `command.component.ts`'s `onKeydown` has an `if (event.key === 'Enter') { ...; return; }`
  branch whose body is identical to the fallthrough path below it — dead/redundant code, not
  a functional bug but worth cleaning up.
- `aria-selected` on `command-item.component.ts` reflects the CDK `Highlightable.active`
  (currently-highlighted) state, not a persisted "selected value" — a semantic mismatch with
  the ARIA spec's definition of `aria-selected` for `option` roles, and different from how
  select/combobox use it (value-equality based).
- `command-group.component.ts` has no `aria-labelledby` wiring to its heading, unlike
  `combobox-group.component.ts` which does wire one via a generated id — inconsistent between
  the two components that otherwise share the same `CollectionController` engine.
- No `value`/model/`ControlValueAccessor` integration at all — command is pure
  event-emission (`valueChange`/`selected` outputs), unlike select/combobox.
- `isMac` detection in `command-dialog.component.ts:20-26` is correctly guarded by
  `platform.isBrowser` before touching `navigator`, so no SSR hazard there.

### Cross-cutting API inconsistency (all ten components)
Every component in this batch has its own way of representing "is it open": `dialog`/
`alert-dialog` are 100% imperative (no bindable state, only `DialogRef.closed`); `popover`,
`sheet`, `context-menu` each expose `isOpen = model(false)`; `tooltip` uses a private
`signal()` that isn't externally bindable; `dropdown-menu` exposes no open-state API at all;
`select`/`combobox`/`command` don't apply (they're listbox-style, not dialog/menu-style, but
`select`'s `value` is a read-only getter while `combobox`'s is a `model()` and `command` has
no value concept whatsoever). None of this is necessarily wrong on its own, but there is no
single documented convention for "how do I control an overlay component from outside" across
the library — worth a deliberate decision (even if the decision is "imperative services for
modal dialogs, `model()` for everything else, and dropdown-menu should get one to match").

## Batch 2 Findings — Form/Control Components

Evidence gathered by reading actual source, existing specs, and `.docs.ts` files — not
inferred. Two real bugs stood out (both in `switch`) plus a shared a11y edge case in
`checkbox`/`radio-group` — **all three fixed**; everything else is a doc gap or a spec gap.

### switch — two real bugs, both fixed
- **No `checkedChange` output at all** — `output()` isn't even imported in
  `switch.component.ts`. Checkbox and radio-group both support a two-way-bindable pair
  (`checked`/`checkedChange`, `value`/`valueChange`); switch can only be driven through
  Angular Forms (`ngModel`/`formControl`), not a plain `[(checked)]` binding, breaking API
  parity with its siblings for no apparent reason (the CVA/adapter machinery is otherwise
  identical across all three).
- **Docs ship a broken accessibility example**: `switch.docs.ts`'s `icon`/`iconThumb`
  examples both use `<sanring-switch checked aria-label="Toggle theme">`, but
  `SwitchComponent` has no `ariaLabel` input and no `[attr.aria-label]` host binding —
  confirmed via grep, zero occurrences of `ariaLabel` in the component. A literal
  `aria-label` attribute placed on `<sanring-switch>` in a template lands on the custom
  element's host tag, not on the inner `role="switch"` `<button>` that screen readers
  actually query — so a developer copying this exact documented example ships an
  unlabeled, inaccessible switch. Checkbox and radio-group both have real
  `ariaLabel`/`ariaLabelledBy` inputs that correctly forward to their interactive element;
  switch is the outlier.
- Also notably switch's spec coverage is the thinnest of the three (3 tests total vs. 6
  each for checkbox and radio) — no test exercises `toggle()`, click behavior, or `size`.

### checkbox / radio — shared a11y edge case, fixed
- Both bind `aria-required` to the raw `required()` input only
  (`checkbox.component.ts:58`, `radio-group.component.ts:51`), not to the `fieldRequired`
  getter that also checks `ngControl?.control?.hasValidator(Validators.required)`. A
  checkbox/radio-group made required purely via a reactive `FormControl`'s
  `Validators.required` (no literal `required` attribute in the template) silently omits
  `aria-required="true"` from the DOM, even though the field-adapter's own
  `fieldRequired` getter (used for the `SanringFieldControl` contract) would correctly
  report `true`. Every other required/invalid signal in these two components already goes
  through the `ngControl`-aware getters — `aria-required` is the one exception.
- `RadioItemComponent` has no dedicated spec file at all (zero direct coverage of its
  `onSpace` handler, `focusOnly()`, or disabled-item behavior — only exercised indirectly
  through `radio-group.component.spec.ts`, which itself only tests ArrowDown, not
  ArrowUp/Left/Right/Home/End/wrap-around).

### file-upload — defensive-programming gap, not a live bug
- `FileTriggerDirective` (`file-trigger.directive.ts`) has zero keyboard handling of its
  own — its only interaction handler is `@HostListener('click', ...)`. Enter/Space
  currently work in every real usage purely because the directive is always applied to a
  native `<button>` in every doc example, which gives free browser-native
  keydown-to-click semantics. Nothing in the directive enforces or warns that the host
  must be natively interactive — applying `sanringFileTrigger` to a `<div>`/`<span>` (no
  `tabindex`, no `role="button"`, no keydown bridging) would silently produce a
  mouse-only control. Not urgent since current usage is correct, but worth hardening.
- `FileDropzoneComponent` itself has no `role`/keyboard access either — it's a
  drag-and-drop-only surface; file selection is only reachable via a projected
  `sanringFileTrigger` button.
- Core validation logic (`handleFiles`, `validateFiles`, `getFileErrors`,
  `remainingSlots`, dedup, max-size/max-files/accept matching — all in
  `file-upload.component.ts`) has **zero direct test coverage**; the two existing spec
  files only cover the hidden-input creation regression and Field/`NgControl` integration.

### date-picker / calendar — keyboard fully external, specs and API docs now baseline-covered
- Both components' keyboard handling (`GranularityGridDirective`/`CalendarGridDirective`,
  Arrow/Home/End/PageUp/PageDown/Enter/Space/Escape, cross-month auto-transfer) lives
  entirely inside the external `@sanring/date-picker-core` npm package (confirmed as a
  real published dependency, not a local workspace package — `pnpm-workspace.yaml` only
  globs `packages/*`/`apps/*`, and `pnpm-lock.yaml` resolves it via registry integrity
  hash, not a `link:` reference). There is no in-repo keyboard code to review or fix for
  either component.
- **Spec baseline fixed in P4**: both components now have minimum package specs.
- **API docs fixed in P5 first pass**: `calendar`'s `jumpMonthLabel`/`jumpYearLabel` inputs
  now appear in the API table, alongside `id`/`required`/`ariaDescribedBy`/`focus()` for
  both `calendar` and `date-picker`.
- Minor, low-risk: `calendar.component.ts`'s `yearOptions` computed calls `new Date()` to
  build the year-picker range — since it's lazy (`computed()`), it doesn't run at
  construction time, but a render straddling a year boundary between server and client
  could theoretically produce a one-year `<option>` list mismatch. Not seen as
  practically significant, noted for completeness.

### Everything else (input, field, textarea, slider, otp-input, radio's docs, calendar/date-picker's docs)
Solid implementations, no functional bugs found. The concrete API-table gaps from Batch 2
are now fixed in P5's first two docs passes (`calendar`, `date-picker`, `otp-input`,
`slider`, and `radio`). Remaining items are small
consistency nits (`textarea`'s `class` input has no default, unlike every sibling
directive/component in the input/field family, which all default to `''`;
`setDescribedByIds()` is duplicated byte-for-byte between `InputDirective` and
`TextareaDirective` rather than shared). `field` itself came back completely clean.

## Batch 3 Findings — Display/Layout Components

Evidence gathered by reading actual source, existing specs, and `.docs.ts` files — not
inferred. Two real SSR bugs stand out (avatar and carousel — same failure class:
constructing a browser-only Observer with no platform guard), plus one broken doc example
(table's pagination) and a couple of genuine a11y/API gaps. Everything else is a doc
granularity nit or a spec-depth note. None of these are fixed yet — see the question below.

### avatar — SSR bug
`AvatarImageDirective` does `private readonly srcObserver = new MutationObserver(() =>
this.syncImageStateFromSrc());` as a field initializer, then calls `.observe(...)`
synchronously in the constructor — no `afterNextRender`/`isPlatformBrowser` guard anywhere
in the `avatar/` directory (confirmed via grep). `MutationObserver` is browser-only; this
would throw during SSR unless the server environment polyfills it. Verified directly.
Separately, `avatar-group-count`'s `clickable` input and `clicked` output are implemented
and keyboard-tested (Space key dispatched in the spec) but appear nowhere in the docs API
table or in any example — a real, working capability that's invisible to consumers.

### carousel — SSR bug + missing live region
`CarouselContentComponent.ngAfterViewInit()` calls `EmblaCarousel(this.el.nativeElement,
options)` unconditionally, no `afterNextRender`/`isPlatformBrowser` guard. Verified: Embla
internally does `new ResizeObserver(...)` during its own init (confirmed by reading the
installed `embla-carousel@8.6.0` package source) — same failure class as avatar's
`MutationObserver`, and notably `resizable-group.component.ts` in the *same batch* gets
this right (wraps its own DOM-dependent init in `afterNextRender`), so there's already an
in-repo example of the correct pattern to follow. Separately: no `aria-live` region exists
anywhere in the carousel source, so slide changes update visually with zero screen-reader
announcement — the textbook carousel accessibility failure. Keyboard support is Arrow-only
(no Home/End), and the carousel region itself has no `tabindex`, so a keyboard user must
already be focused on a descendant (e.g. the prev/next button) before Arrow keys do
anything.

### table — finding turned out to be stale (correction, not a bug)
Originally flagged: the docs' `pagination` example uses `<sanring-paginator>`, which at the
time of the initial fact-finding pass did not exist anywhere in `packages/ui` (confirmed via
`ls`), and the component's own internal `todolist.md` listed a paginator as planned/
not-yet-built work. By the time this was picked up for fixing, `PaginatorComponent`
(`packages/ui/src/lib/components/pagination/paginator.component.ts`) had been built and
registered independently — verified directly: `pageIndex`/`pageSize`/`length`/`pageChange`
all exist and match the docs example's usage exactly, and `check-registry-sync.mjs` /
`check-component-audit-sync.mjs` both confirm it's fully consistent across registry/
packages-ui/docs/public-api. No code change was needed. Left here as a reminder that a
"current state" fact can go stale between the audit pass and the fix pass, same as several
other entries earlier in this file.

### resizable — real a11y gap on a genuinely interactive control
`role="separator"` is real and keyboard-adjustable (Arrow keys + Home/End, RTL-aware,
verified by spec) but has no `aria-valuenow`/`aria-valuemin`/`aria-valuemax` — confirmed via
grep, zero matches. This matters more here than it would on a decorative separator, because
this one is genuinely operable and a screen-reader user resizing it via keyboard gets no
feedback on the current split.

### progress — dead capability
`ProgressDirective` supports `ariaValueText`, but `ProgressComponent`'s template never
forwards it (`progress.component.ts` only passes `value`/`max`/`ariaLabel` down) — so
`ariaValueText` is unreachable through the actual `<sanring-progress>` component, only
usable if a consumer bypasses the component and applies `sanringProgress` directly. Also:
`aria-valuemin` is hardcoded to the literal `0`, not configurable via any input.

### tabs — undocumented capability + unsynced duplicate input
Keyboard/ARIA is fully delegated to `@angular/aria` (same pattern as accordion) and
confirmed correct via the package's own source, but this repo's spec is only 2 shallow
mouse-driven tests — zero keyboard coverage exists locally for a component whose real
behavior lives upstream. Two separate findings worth calling out: (1) `selectionMode`
(automatic-vs-manual tab activation, a real `@angular/aria` capability exposed via
hostDirective passthrough) is completely undocumented anywhere — a consumer has no way to
discover it exists. (2) `orientation` is set *independently* on both `<sanring-tabs>`
(styling only) and `<sanring-tabs-list>` (drives the actual keyboard-navigation axis) with
no sync between them — confirmed real because the docs' own vertical example sets it on
both tags, i.e. even the component's own maintainers had to remember to duplicate it.

### Everything else (accordion, alert, badge, breadcrumb, card, skeleton, spinner, tag,
timeline, tree)
Solid — no functional bugs found. accordion (9 tests, real behavior coverage via
`@angular/aria`) and tree (CDK `TreeKeyManager`, roving tabindex, real keydown-dispatch
tests) are the best-tested of the batch. Gaps are exclusively doc-table granularity (a
single generic `class` row standing in for the same-named input repeated across 3–7
sub-components — affects accordion/breadcrumb/card/tree) or minor default-value doc
mismatches (`class` documented as `''` when the real default is `undefined` — affects
alert/skeleton, a pattern already seen in Batch 2). `tag`'s remove button is a real
`<button>` (correct a11y-by-default) but its `(remove)` output emission itself is entirely
untested — the one spec only covers the `aria-label` text customization.

## Immediate Follow-Up Queue

1. ~~**P0** `select`: implement arrow-key navigation between options inside the open
   listbox~~ — done, `FocusKeyManager`-driven navigation + initial focus-on-open, see
   Batch 1 Findings.
2. ~~**P0** `command`: add a spec suite~~ — done, see `command.component.spec.ts` (6 tests:
   default active item, ArrowDown/ArrowUp with disabled-item skip/wrap, Enter-to-select,
   click-to-select, disabled-click-ignored, search filter + empty state).
3. ~~**P0** `context-menu`: add arrow-key navigation between items, then a spec suite~~ —
   done, see `context-menu.component.spec.ts` and Batch 1 Findings.
4. **P1** `sheet`: ~~fix the `showClose` docs/source mismatch~~ — docs fixed in P5 first
   pass; still guard the two unguarded SSR-unsafe effects with `afterNextRender`.
5. ~~**P1** `switch`: add `checkedChange` output; add a real `ariaLabel`/`ariaLabelledBy`
   input~~ — done, both fixed plus the live demo template (`switch-page.component.ts`)
   had the identical `[attr.aria-label]` bug independently, also fixed. 4 new specs added.
6. ~~**P2** `checkbox`/`radio-group`: bind `aria-required` to `fieldRequired`~~ — done for
   both; regression specs added (`checkbox.field.spec.ts`, `radio-group.field.spec.ts`)
   covering the `Validators.required`-without-literal-`[required]` case.
7. ~~Audit form/control batch~~ — done, see Batch 2 Findings above.
8. ~~Add minimum specs for zero-spec components~~ — done. P4 minimum-spec baseline is
   complete for all 50 formal components. This is a baseline only; deeper a11y/keyboard
   hardening remains tracked in the per-component findings and P10.
9. ~~Audit display/layout batch~~ — done, see Batch 3 Findings above.
10. ~~**P1** `avatar`: guard `AvatarImageDirective`'s `MutationObserver` construction with
    `afterNextRender`~~ — done; construction + `.observe()` deferred, `disconnect()` guarded
    with `?.` since the observer may now be null before first render.
11. ~~**P1** `carousel`: guard `EmblaCarousel()` initialization with `afterNextRender`~~ —
    done; the whole engine init moved out of `ngAfterViewInit` into the constructor's
    `afterNextRender`, following the exact pattern `resizable-group.component.ts` already used.
12. ~~**P2** `table`: fix or clearly flag the docs' `pagination` example~~ — turned out to be
    stale: `PaginatorComponent` was built and registered independently before this item was
    picked up; verified its real API matches the docs example exactly, no fix needed.
13. ~~**P2** `resizable`: add `aria-valuenow`/`aria-valuemin`/`aria-valuemax` to the handle~~
    — done; reflects the size (%) of the panel immediately before the handle, with that
    panel's own `minSize`/`maxSize` as the bounds. New `ResizableGroupComponent.getBeforePanel()`
    method added to support this (panels/elementRef were private). Spec assertions added.
14. **P1** `tabs`: document `selectionMode`; decide whether `orientation` should sync
    automatically between `<sanring-tabs>` and `<sanring-tabs-list>` instead of requiring
    both to be set manually.
15. ~~**P2** `progress`: forward `ariaValueText` from `ProgressComponent` to the underlying
    directive~~ — done; the capability was already fully implemented on `ProgressDirective`,
    just never wired through the component's template. Docs row + spec assertion added.
16. Upgrade docs from `Partial` to reviewed as each component audit completes; in the
    meantime, fix the remaining concrete doc gaps found in Batch 1/2/3 Findings
    (`avatar-group-count`'s `clickable`/`clicked`, and per-component accessibility/state
    notes).
