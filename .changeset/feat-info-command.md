---
"@sanring/cli": minor
---

`sanring info` (no argument) now shows project context: CLI version, Angular detection, config path, theme file status, and the full list of installed components. Accepts `--json` for machine-readable output suitable for CI pipelines and coding agents.

`sanring info <component>` retains its existing behavior (files, peer deps, install status) and also gains `--json` output.
