---
"@sanring/cli": patch
---

`date-picker`/`calendar`: the host `aria-required`/`aria-invalid`/`aria-describedby` attributes (used for Angular Forms/`sanring-field` integration) sat on a bare `<div>` (`role="generic"`), which isn't a valid ARIA role for them — axe-core's `aria-allowed-attr` rule only permits those on specific roles (combobox, gridcell, listbox, radiogroup, spinbutton, textbox, tree). Added `role="radiogroup"` to both hosts (also the closest semantic fit: picking exactly one date from a set of cells). `date-picker`'s grid cells were a flat list without `role="row"` grouping, which the ARIA grid pattern requires; added row chunking (mirroring `calendar`, which already had it) via a `display:contents` wrapper that doesn't affect the CSS Grid layout (`packages/ui` + `registry`).

Caught by axe-core automated accessibility checks while completing the P11 rollout to all remaining components.
