---
'@sanring/cli': patch
---

- `table`: `sanring-table-container` becomes keyboard-focusable (`tabindex="0"` with a focus ring) while its content overflows, so keyboard users can scroll wide tables. Tables that fit are unchanged.
- `pagination`: `sanring-paginator` wraps onto two lines when space runs out, instead of squeezing the range label.
- `block/org-chart`: card avatars are marked decorative (`aria-hidden`), since the card button already names the person.
