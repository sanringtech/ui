---
"@sanring/cli": minor
---

New `navigation-menu` component: horizontal or vertical top-level navigation with trigger-opened content panels and `link`/`label`/`description`/`separator` primitives. Clicking outside an open panel closes it — this is always-on behavior, not an opt-in prop.

Also ships `sanring-navigation-menu-viewport`, a shared panel — one fixed size, centered under the trigger group — for bars where you want a single consistent panel instead of a differently sized one per trigger, and `sanring-navigation-menu-sub` submenu flyouts positioned with CDK Overlay (viewport collision fallback, hover-intent, keyboard navigation).
