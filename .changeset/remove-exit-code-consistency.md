---
"@sanring/cli": patch
---

`remove` now distinguishes unknown targets (hard exit 1, matching `diff`/`update`) from known-but-not-installed ones (soft skip), instead of silently exiting 0 whenever any target succeeded. Fixes a crash in `info`'s `alias:component` lookup, surfaced by newly added test coverage for `info`/`migrate`/`search`.
