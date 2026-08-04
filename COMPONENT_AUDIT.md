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
   `breadcrumb`, `card`, `alert`, `badge`, `progress`, `skeleton`, `spinner`,
   `tag`, `timeline`, `tree`, plus other low-risk display primitives.

## Current Snapshot

- Registry components: 50
- Surface alignment: all 50 components currently exist in `registry`, `packages/ui`, docs pages, and `public-api.ts`.
- Components without package specs: 15 (`command`, `context-menu` fixed as part of Batch 1's P0 follow-up)
- Manual a11y / keyboard / API / SSR review: **Batch 1 (10 high-interaction components) reviewed, all 3 P0s fixed** (`select` keyboard nav, `command` spec suite, `context-menu` keyboard nav + spec suite) — see Batch 1 Findings below. Batches 2–3 not started.

## Matrix

| Component | Batch | Risk | Surface | Specs | A11y | Keyboard | API | SSR | Docs | Next |
|---|---|---:|---|---:|---|---|---|---|---|---|
| accordion | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| alert | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| alert-dialog | high-interaction | High | OK | 1 | OK | OK | OK | OK | Partial | Document `closeAriaLabel`; add a regression spec for the `extends DialogContentComponent` fragility noted in source (see Batch 1 Findings) |
| aspect-ratio | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Review after high-risk batch |
| avatar | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec; `avatar-group-count`'s `clickable` mode needs a keyboard check |
| badge | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| breadcrumb | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| button | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| calendar | form-control | Medium | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| card | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| carousel | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| checkbox | form-control | Medium | OK | 2 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| collapsible | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| combobox | high-interaction | High | OK | 1 | OK | Partial (no typeahead / Home-End) | OK | OK (minor) | Partial | Add a plain component spec — only `.field.spec.ts` exists today, zero coverage of keyboard nav/multi-select/chips/clear (see Batch 1 Findings) |
| command | high-interaction | High | OK | 1 | OK (`aria-expanded="true"` is intentionally static — this component's list has no collapsed state distinct from being unmounted, see Batch 1 Findings) | OK (arrow-key nav/Enter/filter/disabled-skip now covered by spec) | Inconsistent (no value/model/CVA at all) | OK | Partial | Clean up the dead-code branch in `onKeydown` noted in Batch 1 Findings |
| context-menu | high-interaction | High | OK | 1 | OK (fixed — `sub-trigger` now sets `aria-disabled`; submenu still doesn't restore focus to the root trigger on close, only sub-menus restore to their own sub-trigger) | OK (fixed — ArrowUp/Down now navigate both the root menu and any open submenu, skipping disabled items and wrapping; still no Home/End/typeahead) | OK | OK | Partial | Consider restoring focus to the original right-click target when the root menu closes (currently no-op); add Home/End for parity if picked up later |
| date-picker | form-control | Medium | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| dialog | high-interaction | High | OK | 1 | OK | OK (CDK-delegated, verified by spec) | OK | OK | Partial | Add `sanringDialogTrigger` + `closeAriaLabel` to the API table |
| divider | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| dropdown-menu | high-interaction | High | OK | 1 | OK (delegated to `@angular/aria/menu`) | Delegated (all keyboard logic lives in the external package, nothing in-repo to review) | Inconsistent (no public open-state model, unlike every sibling) | OK | Partial | Decide whether to expose `isOpen`/`openChange` for parity with siblings; document `typeaheadDelay` (see Batch 1 Findings) |
| field | form-control | Medium | OK | 1 | TBD | N/A | TBD | TBD | Partial | Form/control audit |
| file-upload | form-control | Medium | OK | 2 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| hover-card | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| input | form-control | Medium | OK | 1 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| label | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| link | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| otp-input | form-control | Medium | OK | 1 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| pagination | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| popover | high-interaction | High | OK | 1 | OK (verified by spec) | OK (Escape only; no focus trap — likely intentional for a non-modal popover) | OK | OK | Partial | Document the no-focus-trap design decision explicitly |
| progress | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Review after high-risk batch |
| radio | form-control | Medium | OK | 2 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| resizable | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| scroll-area | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| select | high-interaction | High | OK | 2 | OK (roving tabindex, verified by spec) | OK (fixed — `FocusKeyManager` now drives ArrowUp/Down + initial focus on open, with disabled-item skip/wrap; see Batch 1 Findings) | Inconsistent (no `disabled` input(); `value` is a getter, not a model) | OK | Partial | Consider adding typeahead/Home-End for parity with combobox/command (optional, not required for basic keyboard access) |
| sheet | high-interaction | High | OK | 1 | Gap (`aria-labelledby`/`describedby` stay bound even when no title/description is projected) | OK (Escape + `cdkTrapFocus`) but no way to disable Escape-close | Inconsistent (only sibling with a 2-way `isOpen` model; `sanringSheetClose` can't carry a result) | Gap (2 of 3 constructor effects touch `window`/`document` unguarded; only the focus effect uses `afterNextRender`) | **Bug** (docs show `[showClose]="false"` in a real example; that input does not exist in source) | Fix now: remove or implement `showClose` (docs currently ship code that won't compile against real source); guard the scroll-lock effect with `afterNextRender` (see Batch 1 Findings) |
| skeleton | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Review after high-risk batch |
| slider | form-control | Medium | OK | 2 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| spinner | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| stepper | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| switch | form-control | Medium | OK | 2 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| table | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| tabs | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| tag | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Keyboard check on the removable variant's `<button>` |
| textarea | form-control | Medium | OK | 1 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| timeline | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Review after high-risk batch |
| toast | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| toggle | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| tooltip | high-interaction | High | OK | 1 | OK (verified by spec) | Gap (no touch/coarse-pointer support; Escape handling duplicated in trigger + content) | Inconsistent (`isOpen` is a plain signal, not a `model()` — can't be bound externally unlike popover/sheet/context-menu) | OK | Partial | Add touch/coarse-pointer support (or document the hover-only limitation); expand spec coverage (1 test today) |
| transfer | display-layout | Low | OK | 6 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| tree | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |

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
- **Docs bug**: `sheet.docs.ts` documents a `showClose` input and even uses
  `[showClose]="false"` in the `noClose` code example (line 191), but `showClose` does not
  exist anywhere in `sheet/` — confirmed by grep. A consumer copying that example would fail
  Angular template type-checking.
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

## Immediate Follow-Up Queue

1. ~~**P0** `select`: implement arrow-key navigation between options inside the open
   listbox~~ — done, `FocusKeyManager`-driven navigation + initial focus-on-open, see
   Batch 1 Findings.
2. ~~**P0** `command`: add a spec suite~~ — done, see `command.component.spec.ts` (6 tests:
   default active item, ArrowDown/ArrowUp with disabled-item skip/wrap, Enter-to-select,
   click-to-select, disabled-click-ignored, search filter + empty state).
3. ~~**P0** `context-menu`: add arrow-key navigation between items, then a spec suite~~ —
   done, see `context-menu.component.spec.ts` and Batch 1 Findings.
4. **P1** `sheet`: fix the `showClose` docs/source mismatch (docs ship code that won't
   compile); guard the two unguarded SSR-unsafe effects with `afterNextRender`.
5. Audit form/control batch (`input`, `field`, `checkbox`, `radio`, `switch`, `slider`,
   `date-picker`, `calendar`, `file-upload`, `otp-input`, `textarea`) using the same
   fact-finding method as Batch 1.
6. Add minimum specs for high-risk components that still lack one after items 2–3:
   already covered by items 2 and 3 above.
7. Add minimum specs for remaining zero-spec components outside this batch:
   `alert`, `avatar`, `badge`, `breadcrumb`, `calendar`, `card`, `carousel`,
   `date-picker`, `divider`, `hover-card`, `label`, `link`, `resizable`,
   `spinner`, `table`.
8. Upgrade docs from `Partial` to reviewed as each component audit completes; in the
   meantime, fix the concrete doc gaps found in Batch 1 Findings (undocumented inputs,
   `sheet`'s `showClose`, `select`'s getter-vs-input distinction).
