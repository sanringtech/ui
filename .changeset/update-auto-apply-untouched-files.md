---
"@sanring/cli": minor
---

`update` now tells apart files you never touched since installing from ones you customized. Untouched files (registry moved on, your copy still matches what `add`/`update` last wrote) apply silently — only files that actually diverged from that baseline show a diff and ask for confirmation. `add` and `init` now record each file's content hash in `sanring.config.json` to make this possible.
