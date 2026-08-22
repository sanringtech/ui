---
"@sanring/cli": minor
---

`build`/`list --outdated` gain `--json` output. A new registry-integrity module (dangling `componentDeps`/`sharedDeps`/group references, unparseable peer versions, optional file-fetchability) is now shared across `doctor`, `build`, and the MCP `doctor_project` tool. `fetchRegistry`/`fetchFile` now throw a typed `RegistryFetchError` instead of calling `process.exit` directly — this also fixes `doctor`'s dead "Unreachable" catch block and 6 of 7 MCP tool handlers that had no `try`/`catch` around `getRegistry()` (a single failed fetch could previously kill the whole long-running MCP server). Also fixes a flaky-test root cause where `sync-registry.mjs`'s rm-then-async-copy raced with `mcp.e2e.test.ts`'s `npm run build`.
