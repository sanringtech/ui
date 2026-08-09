---
"@sanring/cli": patch
---

`navigation-menu`: the submenu trigger (`sanring-navigation-menu-sub-trigger`) carried `role="menuitem"`, which ARIA requires to be contained by a `role="menu"`/`"menubar"` ancestor — but it sits directly inside `sanring-navigation-menu-content` (`role="region"`), never a menu. Changed to `role="button"` (`packages/ui` + `registry`), matching how the top-level trigger already uses plain `aria-haspopup`/`aria-expanded` semantics instead of menu roles. Also dropped the same invalid `role="menuitem"` from the docs' submenu example content links, which had the identical bug.

Caught by axe-core automated accessibility checks in the component test suite (`packages/ui/src/testing/axe-a11y.ts`), continuing the P11 rollout past the initial 13 components.
