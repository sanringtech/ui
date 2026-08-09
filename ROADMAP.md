# Roadmap

Where [Sanring UI](https://ui.sanring.dev) is headed. For what's already shipped, see [`packages/cli/CHANGELOG.md`](packages/cli/CHANGELOG.md) — this doc is about direction, not a changelog.

This is a snapshot, not a commitment or a timeline. Items move, get reprioritized, or get dropped as we learn more.

## Adoption experience

- **Blocks** — installable page-level templates (login page, dashboard shell, settings page) via `sanring add block/dashboard-shell`, so you're not always assembling pages from individual components. This is the biggest adoption-experience gap compared to shadcn today.
- **Interactive theme builder** — a live color/radius preview on the docs site with copy-to-clipboard CSS. (The named starting points this was paired with — Slate, Warm, High-Contrast — already shipped via `sanring init --theme <preset>`.)
- **Try without installing** — an "Open in StackBlitz" shortcut on each component's docs page.

## Ecosystem / team use

- **Custom & third-party registries** — support for pointing the CLI at a team's own private registry alongside the official one, so multiple teams/products can share an internal component set.

## Quality infrastructure (ongoing, lower urgency)

- Automated accessibility regression testing (axe-core or similar)
- Visual regression testing for CSS changes
- Real end-to-end CLI tests against a freshly scaffolded Angular project

## Recently shipped

- `sanring init --theme <preset>` — named color presets (`slate`, `warm`, `high-contrast`) so you don't have to hand-edit tokens for a different look
- `sanring mcp` — an MCP server over stdio so AI coding agents (Claude Code, Cursor, Windsurf) can query and install components directly
- `ng add @sanring/cli` — Angular Schematics support, so you can bootstrap with the Angular CLI's own add mechanism instead of `npx @sanring/cli init`
- `sanring list --outdated` — a fast status overview of installed components against the registry
- Per-component "Recent changes" on each docs page
- Docs site dark mode toggle
- `sanring migrate` — surfaces breaking-change migration steps when updating components across CLI versions

See the [changelog](packages/cli/CHANGELOG.md) for the full, version-by-version history.
