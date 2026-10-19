---
"@sanring/cli": patch
---

Fix `select` inside a `dialog`, `alert-dialog` or `sheet`: the options showed but could not be clicked, because the dialog sits in the browser's top layer and the listbox did not. The listbox now uses the same popover overlay as the other overlay components, so it opens above dialogs.
