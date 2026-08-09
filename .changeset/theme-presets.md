---
"@sanring/cli": minor
---

`sanring init` now accepts `--theme <preset>` to start from a named color preset instead of hand-editing tokens afterwards: `default` (unchanged), `slate` (muted blue-gray accent), `warm` (amber accent, larger radius), and `high-contrast` (near-black/white surfaces, square corners). The preset is appended after the base `theme.css`, so `src/sanring-theme.css` stays a single plain CSS file you can keep editing by hand.
