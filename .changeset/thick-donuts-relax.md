---
"@sanring/cli": minor
---

`init` now writes `src/sanring-theme.css` — the full set of `--sanring-*` design tokens every component reads (color scales, semantic colors, radius, progress/badge tokens). Previously these variables only existed inside the docs app itself, so a fresh `sanring init` + `sanring add` produced components with no visible styling. Existing files are left alone by default (protects any brand-color edits); pass `-f/--force` to reset to the shipped defaults. Also adds the `--sanring-primary`/`--sanring-primary-fg` alias needed for Radio and Checkbox's Tailwind-bridged `bg-primary`/`text-primary`/`border-primary` utilities to resolve.

New `sanring diff [components...]` command. Sanring UI has no version concept — components are copied source, not npm packages — so there was previously no way to know if a local file had drifted from the registry before `add --force` overwrote it. `diff` compares installed components and `sanring-theme.css` against the current registry line by line, printing what's been customized locally versus what changed upstream. Omit component names to check everything currently installed.
