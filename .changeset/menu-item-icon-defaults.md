---
'@sanring/cli': patch
---

`context-menu` and `dropdown-menu` items now size projected icons to `size-4`, keep them from shrinking, and ignore pointer events on them, so `<svg lucideCopy></svg>` needs no classes. An explicit `size-*` class on the icon still wins; icons follow the item color (destructive items turn them red) and fade with disabled items.
