---
"@sanring/cli": minor
---

New `sanring mcp` command: starts an MCP server over stdio so AI coding agents (Claude Code, Cursor, Windsurf) can query and install components directly, without shelling out. Exposes five tools — `list_components`, `search_components`, `get_component_info`, `plan_component_install` (dry-run preview), and `add_component`.
