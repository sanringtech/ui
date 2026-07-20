---
"@sanring/cli": patch
---

`sanring update --trust`: users who installed components before v0.9.0 have no recorded hash baseline. Without `--trust` every changed file would show as a conflict even if it was never customised. `--trust` promotes those no-baseline conflicts to silent auto-updates, letting pre-0.9.0 projects catch up cleanly in one pass. A note in the output shows how many files were trusted so the user can audit the assumption afterwards.
