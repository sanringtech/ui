---
"@sanring/cli": patch
---

Fix `add`/`init` installing peer dependencies via `spawnSync(..., { shell: true })` on a command string split on spaces — a custom `--registry` could supply a package name/version containing shell metacharacters that would be interpreted by the shell. Both commands now build `{ bin, args }` directly and run with `shell: false`.

`add --shared-path` is now saved to `sanring.config.json`. Previously only the initial install respected it; `diff`/`update`/`remove` always assumed shared utilities lived at `<componentPath>/shared`, so projects using a custom shared path saw drift on every subsequent command.

`fetchRegistry` now validates the parsed JSON shape (local bundle, `--registry <path>`, and remote fetch) and reports which field is malformed, instead of letting a bad registry fail later inside an unrelated command with a confusing error.
