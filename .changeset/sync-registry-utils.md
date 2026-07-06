---
"@sanring/cli": patch
---

Sync `registry/shared/utils.ts` with `@sanring/ui`'s `utils.ts`, adding the `uniqueId()` helper. Components with `sharedDeps: ["utils"]` were missing this function, which the in-progress Field/Input `id` generation now depends on.
