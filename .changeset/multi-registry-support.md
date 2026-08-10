---
"@sanring/cli": minor
---

`sanring.config.json` now accepts optional `registries` (alias → URL map) and `defaultRegistry` fields, so a project can point at a private/third-party registry without repeating `--registry <url>` on every command. `sanring add` accepts `alias:componentName` to install from a specific non-default registry, e.g. `sanring add myteam:button`. Both fields are opt-in — an existing config without them behaves exactly as before. `installedVersions` entries are recorded as `alias:componentName` once an alias is known; components installed before this feature keep their original key until next touched by `add`/`update`.
