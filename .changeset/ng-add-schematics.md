---
"@sanring/cli": minor
---

`ng add @sanring/cli` now works as an alternative to `npx @sanring/cli@latest init` — it installs the CLI as a dev dependency and runs the same init flow (component path prompt, theme stylesheet, base dependency install). Options match `init`: `--path`, `--skip-confirmation`, `--force`, `--registry`.
