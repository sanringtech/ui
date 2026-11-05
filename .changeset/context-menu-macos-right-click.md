---
'@sanring/cli': patch
---

Fix `context-menu` closing right after it opens on macOS. macOS fires `contextmenu` on mousedown, so releasing the same right-click sent `auxclick` to the trigger, which the overlay treated as a click outside. A secondary-button event on the trigger no longer closes the menu; left clicks outside, right clicks elsewhere, and Escape still close it.
