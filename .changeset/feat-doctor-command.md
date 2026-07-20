---
"@sanring/cli": minor
---

`sanring doctor`: new command that checks your environment and project config for common issues. Reports Node.js version, Angular project detection, sanring.config.json validity, theme file presence, per-file hash integrity (untouched / customized / orphaned), and registry reachability. Use `--offline` to skip the network check. Exits with code 1 when hard errors are found so CI pipelines can gate on it.
