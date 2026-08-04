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
- Components without package specs: 17
- Manual a11y / keyboard / API / SSR review: not started.

## Matrix

| Component | Batch | Risk | Surface | Specs | A11y | Keyboard | API | SSR | Docs | Next |
|---|---|---:|---|---:|---|---|---|---|---|---|
| accordion | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| alert | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| alert-dialog | high-interaction | High | OK | 1 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
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
| combobox | high-interaction | High | OK | 1 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
| command | high-interaction | High | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add spec, then manual interaction audit |
| context-menu | high-interaction | High | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add spec, then manual interaction audit |
| date-picker | form-control | Medium | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| dialog | high-interaction | High | OK | 1 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
| divider | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| dropdown-menu | high-interaction | High | OK | 1 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
| field | form-control | Medium | OK | 1 | TBD | N/A | TBD | TBD | Partial | Form/control audit |
| file-upload | form-control | Medium | OK | 2 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| hover-card | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| input | form-control | Medium | OK | 1 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| label | display-layout | Low | OK | 0 | TBD | N/A | TBD | TBD | Partial | Add minimum spec |
| link | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| otp-input | form-control | Medium | OK | 1 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| pagination | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| popover | high-interaction | High | OK | 1 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
| progress | display-layout | Low | OK | 1 | TBD | N/A | TBD | TBD | Partial | Review after high-risk batch |
| radio | form-control | Medium | OK | 2 | TBD | TBD | TBD | TBD | Partial | Form/control audit |
| resizable | display-layout | Low | OK | 0 | TBD | TBD | TBD | TBD | Partial | Add minimum spec |
| scroll-area | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| select | high-interaction | High | OK | 2 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
| sheet | high-interaction | High | OK | 1 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
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
| tooltip | high-interaction | High | OK | 1 | TBD | TBD | TBD | TBD | Partial | Manual interaction audit |
| transfer | display-layout | Low | OK | 6 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |
| tree | display-layout | Low | OK | 1 | TBD | TBD | TBD | TBD | Partial | Review after high-risk batch |

## Immediate Follow-Up Queue

1. Audit high-risk interaction components in order:
   `dialog`, `alert-dialog`, `popover`, `select`, `combobox`, `command`,
   `dropdown-menu`, `context-menu`, `tooltip`, `sheet`.
2. Add minimum specs for high-risk components with zero specs:
   `command`, `context-menu`.
3. Add minimum specs for remaining zero-spec components:
   `alert`, `avatar`, `badge`, `breadcrumb`, `calendar`, `card`, `carousel`,
   `date-picker`, `divider`, `hover-card`, `label`, `link`, `resizable`,
   `spinner`, `table`.
4. Upgrade docs from `Partial` to reviewed as each component audit completes.
