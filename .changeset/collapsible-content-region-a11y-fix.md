---
"@sanring/cli": patch
---

`collapsible`: `[sanringCollapsibleContent]` hardcoded `role="region"` on its host, which silently overrode any semantic role already on that element — most notably `sanring-sidebar-menu-sub` (`role="list"`), the documented pattern for collapsible sidebar submenus. That broke the required list/listitem ARIA relationship for the submenu's items. Removed the hardcoded role: the WAI-ARIA disclosure pattern doesn't require one on the panel (`aria-labelledby` referencing the trigger is sufficient) (`packages/ui` + `registry`).

Caught by axe-core automated accessibility checks while adding sidebar's first component test suite (`packages/ui/src/testing/axe-a11y.ts`), completing the P11 rollout to all remaining components.
