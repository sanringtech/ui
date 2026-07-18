---
"@sanring/cli": minor
---

Add three new commands:

- `sanring info <component>` — shows a component's description, full file list (including auto-added dependencies), and peer dependencies without installing anything.
- `sanring remove <components...>` (alias `rm`) — removes installed components. Refuses to remove one that another still-installed component depends on unless `--force` is passed; reports shared files that may no longer be needed instead of deleting them automatically.
- `sanring update [components...]` — walks installed files that differ from the registry and prompts to apply each change, instead of only reporting drift like `diff` does.
