---
"@sanring/cli": patch
---

`diff` now labels each changed file as "safe to update" (registry moved on, you never touched the file) or "needs review" (you customized it), reusing the same baseline-hash comparison `update` uses, and its summary line points you at `sanring update` to apply the safe ones.
