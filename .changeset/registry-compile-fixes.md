---
"@sanring/cli": patch
---

Fix two registry items that failed to compile after install: `context-menu` imported `../../shared/menu-navigation` instead of `../shared/menu-navigation`, and `block/table-page` left out the required `value` on its row "Delete" menu item.
