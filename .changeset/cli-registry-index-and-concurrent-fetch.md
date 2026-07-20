---
"@sanring/cli": patch
---

Internal performance work, no behavior change: `add`/`diff`/`update`/`info`/`remove` now look up components and shared entries through a `createRegistryIndex` map instead of repeated `Array.find`/`.map` scans over the registry, and component/shared file fetches in `add`/`diff`/`update` run through a bounded concurrent worker pool instead of one `await` at a time — noticeable on multi-file components and custom remote registries.
