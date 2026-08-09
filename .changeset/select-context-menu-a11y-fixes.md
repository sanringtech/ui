---
"@sanring/cli": patch
---

`select`: the trigger button (`role="combobox"`) had no way to receive an accessible name other than an associated `<label>` — visible placeholder/value text doesn't count as a name for that role the way it would for a plain button, and nothing in the component or docs exposed an alternative. Added `ariaLabel`/`ariaLabelledBy` inputs to `[sanringSelectTrigger]`.

`context-menu`: the trigger element (an arbitrary `<div>`) carried `aria-haspopup`/`aria-expanded`, which are only valid ARIA on an element whose role permits them — a bare div doesn't. Added `role="button"` to `[sanringContextMenuTrigger]`.

Both were caught by axe-core automated accessibility checks newly added to the component test suite (`packages/ui/src/testing/axe-a11y.ts`), rolled out to the highest-risk interactive/overlay components.
