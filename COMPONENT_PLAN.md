# @sanring/ui Component Scope & Roadmap

> Updated: 2026-08-05
> Goal: make Sanring UI a mainstream, production-ready Angular headless component library aligned with shadcn/ui's copy-paste model and Angular's platform strengths.

This file answers: **what components should Sanring UI include, and in what order should the scope evolve?**

For per-component production readiness, use [`COMPONENT_AUDIT.md`](./COMPONENT_AUDIT.md). The audit file tracks evidence for surface alignment, specs, a11y, keyboard behavior, API stability, SSR safety, docs completeness, and next actions.

---

## Scope Principles

1. **Stabilize the existing library before expanding the catalog.**
   Sanring UI already has 50 formal registry components. The next mainstream-library milestone is not raw component count; it is reliability, a11y, docs, tests, and API consistency.

2. **Prefer Angular Aria for supported interaction patterns.**
   Use `@angular/aria` for patterns it owns well: accordion, combobox/select/listbox, menu, tabs, toolbar-like groups, tree, and grid-style interactions.

3. **Use CDK for overlays, focus, portals, layout, and advanced behavior.**
   Angular Aria does not solve overlay positioning. Floating components such as select, combobox, dropdown-menu, context-menu, popover, tooltip, dialog, sheet, and hover-card still need CDK overlay/focus/portal primitives where appropriate.

4. **Keep display primitives lightweight.**
   Components such as badge, card, alert, skeleton, spinner, label, link, and divider should stay mostly dependency-free and easy to copy.

5. **Copy-paste registry quality is the product.**
   For users, `registry/components/*` is the primary delivery surface via `@sanring/cli`. `packages/ui` is still important as the development, testing, docs, and type-check surface. These must stay aligned.

6. **Avoid ambiguous component names.**
   Generic `menu` was removed because it overlapped with `dropdown-menu` and `context-menu`. Future additions should use precise names such as `menubar`, `navigation-menu`, or `sidebar`.

---

## Current Coverage

Sanring UI currently has **50 formal registry components**:

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `date-picker`, `dialog`, `divider`, `dropdown-menu`, `field`, `file-upload`, `hover-card`, `input`, `label`, `link`, `otp-input`, `pagination`, `popover`, `progress`, `radio`, `resizable`, `scroll-area`, `select`, `sheet`, `skeleton`, `slider`, `spinner`, `stepper`, `switch`, `table`, `tabs`, `tag`, `textarea`, `timeline`, `toast`, `toggle`, `tooltip`, `transfer`, `tree`.

Current surface state:

- `registry`, `packages/ui`, docs pages, and `public-api.ts` are aligned for all 50 components.
- `@angular/aria` and `@angular/cdk` are already present in the package peer dependencies.
- Quality status is tracked in `COMPONENT_AUDIT.md`; do not duplicate that matrix here.

---

## Implemented Scope Groups

These components exist today. Their next work is audit/spec/docs hardening, not catalog planning.

### High-Risk Interaction

`dialog`, `alert-dialog`, `popover`, `select`, `combobox`, `command`, `dropdown-menu`, `context-menu`, `tooltip`, `sheet`

Roadmap stance:

- Audit these first.
- Confirm focus management, escape/outside-dismiss behavior, keyboard interaction, ARIA roles, portal behavior, and SSR safety.
- Add or expand specs before adding new complex components.

### Form / Control

`input`, `field`, `checkbox`, `radio`, `switch`, `slider`, `date-picker`, `calendar`, `file-upload`, `otp-input`, `textarea`

Roadmap stance:

- Confirm form integration, labeling, disabled/readonly states, keyboard behavior, validation messaging, and controlled/uncontrolled state patterns.
- Treat `calendar` and `date-picker` as medium-to-high complexity because of date grid behavior.

### Display / Layout

`accordion`, `tabs`, `table`, `carousel`, `resizable`, `avatar`, `breadcrumb`, `card`, `alert`, `badge`, `progress`, `skeleton`, `spinner`, `tag`, `timeline`, `tree`, plus the remaining display primitives.

Roadmap stance:

- Add minimum specs where missing.
- Review a11y for semantic components such as accordion, tabs, table, tree, breadcrumb, progress, and carousel.
- Keep styling defaults useful but not overly prescriptive.

---

## Candidate Components

These are reasonable future additions because they map to common shadcn/ui patterns or mainstream application needs.

| Component | Priority | Dependency stance | Notes |
|---|---:|---|---|
| `menubar` | High | Aria + CDK overlay | Desktop-style horizontal menu bar. Distinct from `dropdown-menu` and `context-menu`. |
| `navigation-menu` | High | Aria/CDK, likely custom composition | Marketing/docs navigation and mega-menu use cases. Keep separate from `menubar`. |
| `sidebar` | High | CDK layout optional | Common app shell primitive; should include item/group/collapsible patterns. |
| `empty` | Medium | None | Common empty-state primitive; low complexity and useful in docs/app UIs. |
| `kbd` | Medium | None | Small display primitive for shortcuts, useful with command/menu docs. |
| `typography` | Medium | None | Useful docs/content primitive, but avoid over-scoping styles. |
| `button-group` | Medium | None / Toolbar if interactive | Display grouping is easy; roving/toolbar behavior needs clearer semantics. |
| `input-group` | Medium | None | Common form composition for prefix/suffix/action controls. |
| `native-select` | Medium | None | Styled native select; lower complexity than custom `select`. |
| `item` | Low | None | Generic list item primitive; only add if repeated patterns justify it. |
| `toggle-group` | Low | Aria toolbar or custom | Add after auditing existing `toggle`, `switch`, and form controls. |
| `drawer` | Low | CDK overlay/focus | May overlap with `sheet`; add only if API distinction is clear. |

---

## Deferred / Heavy Scope

These may be useful, but should not block the current production-readiness push.

| Component | Status | Reason |
|---|---|---|
| `data-table` / `grid` | Deferred | High complexity: sorting, selection, keyboard grid behavior, virtualization, filtering, column sizing. Current `table` should be hardened first. |
| `chart` | Deferred / optional | Requires third-party charting decision; shadcn's React/Recharts model does not transfer directly to Angular. |
| `attachment` / `message` / `bubble` / `message-scroller` | Deferred | Useful for AI/chat products, but less core than app-shell and form primitives. |
| `sonner` | Deferred | Existing `toast` should be audited before introducing a second toast API. |
| `direction` / `marker` | Deferred | Add only if concrete docs/product use cases appear. |

---

## Dependency Strategy

| Pattern | Preferred dependency | Notes |
|---|---|---|
| Aria-supported interaction | `@angular/aria` | Prefer host directives where it improves roles, focus, and keyboard behavior. |
| Floating/portal UI | `@angular/cdk/overlay`, `@angular/cdk/portal`, `@angular/cdk/a11y` | Use for positioning, focus trap, escape/outside events, and portal behavior. |
| Native form controls | Native input + Angular forms + targeted ARIA | Avoid custom widgets when native behavior is better. |
| Display primitives | None | Keep copy-paste footprint small. |
| Icons | `@lucide/angular` only where needed | Avoid forcing icon dependency for components that do not render icons. |
| Dates | `@sanring/date-picker-core` | Keep date logic centralized and separately testable. |

---

## Roadmap

### Phase 1 — Production Readiness for Existing 50

- Finish `COMPONENT_AUDIT.md` high-risk interaction batch.
- Add minimum specs for zero-spec high-risk components: `command`, `context-menu`.
- Add minimum specs for remaining zero-spec components.
- Upgrade docs from basic usage/API to production adoption docs: accessibility notes, keyboard behavior, and state model.
- Add automated consistency checks for `registry`, `packages/ui`, docs pages, and `public-api.ts`.

### Phase 2 — Mainstream Catalog Gaps

After the high-risk audit has actionable issues under control, consider adding:

1. `menubar`
2. `navigation-menu`
3. `sidebar`
4. `empty`
5. `kbd`
6. `input-group`
7. `button-group`
8. `native-select`
9. `typography`

### Phase 3 — Heavy / Domain-Specific Components

Evaluate only after the library's core quality gates are consistently green:

1. `data-table` / `grid`
2. `chart`
3. chat/AI primitives such as `message`, `bubble`, `message-scroller`, `attachment`
4. alternate toast API such as `sonner`

---

## Open Decisions

- [ ] Define when a primitive should be a directive versus a component.
- [ ] Define a compatibility policy for public selectors, inputs, outputs, exported import arrays, and copied registry file structure.
- [ ] Decide whether `divider` should remain the public name or gain a `separator` alias for shadcn naming familiarity.
- [ ] Decide whether `radio` should gain a `radio-group` alias for shadcn naming familiarity.
- [ ] Decide whether `otp-input` should gain an `input-otp` alias for shadcn naming familiarity.
- [ ] Decide whether `transfer`, `timeline`, `tag`, and `stepper` remain first-class Sanring-specific differentiators or become secondary components in docs/navigation.
