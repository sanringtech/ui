---
"@sanring/cli": patch
---

`update` now installs files that were added to a registry component after the user's last `add` — previously these were silently skipped, leaving the component incomplete even after a successful update. `diff` also now surfaces these missing files as "new in registry" so users know to run `sanring update` to pick them up.
