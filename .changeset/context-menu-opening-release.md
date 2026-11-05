---
'@sanring/cli': patch
---

Fix `context-menu` still closing right after it opens on macOS. The menu opens under the pointer, so the release of the opening right-click usually lands on the menu and the browser sends `auxclick` to `<body>`, which 0.30.4 did not cover. The menu now ignores the release of the right-click that opened it, wherever it lands.
