---
"@sanring/cli": patch
---

Fix `rich-text-editor` vertical toolbar navigation: ArrowDown / ArrowUp on the heading menu opened its menu instead of moving to the next or previous button. The toolbar now handles its navigation keys before its items do.
