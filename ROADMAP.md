# Roadmap

Where [Sanring UI](https://ui.sanring.dev) is headed. For what's already shipped, see [`packages/cli/CHANGELOG.md`](packages/cli/CHANGELOG.md) — this doc is about direction, not a changelog.

This is a snapshot, not a commitment or a timeline. Items move, get reprioritized, or get dropped as we learn more.

## Adoption experience

- **More blocks** — remaining page templates (`register`, `forgot-password`, `settings-page`, `detail-page`, `wizard`, `pricing-page`) on top of the starter three.

## Ecosystem / team use

- **Registry Directory** — a docs page listing community/third-party registries, so teams can discover each other's component sets.
- **Private registry authentication** — Bearer-token support for company-internal or private-repo registries.

## Recently shipped

- Blocks starter set — `sanring add block/login` (and `dashboard-shell`, `table-page`) installs a page-level template plus its component dependencies
- Open in StackBlitz — each component docs previewer can open a minimal Angular 22 + Tailwind project with that example
- GitHub registries — `--registry github:owner/repo` (optional `#ref` / `@ref`) expands to the raw `registry.json` at the repo root
- `registry.json` API reference — field, type, and required/optional docs on the Registry page
- Interactive theme builder — a live color/radius preview on the docs site with copy-to-clipboard CSS
- Packaged CLI end-to-end quality gate — CI installs the local tarball into a freshly scaffolded
  Angular app, runs `sanring init` and `sanring add button`, imports the installed source, and
  requires a successful production build
- Docs site Playwright quality gate — structural smoke tests, axe-core accessibility coverage, and
  approved visual baselines for representative home/component/CLI surfaces in both themes; CI runs
  the full suite through `pnpm test:e2e:docs`
- Docs site visual system pass — consistent `--docs-*` tokens, WCAG-verified color contrast in both
  themes, and a documented type scale/spacing contract (`apps/docs/DOCS_VISUAL_SYSTEM.md`)
- `sanring build` — auto-generate a third-party registry's `registry.json` (component deps, shared deps, peer dependencies) from a source directory, instead of hand-writing it against the schema
- Custom & third-party registries — point the CLI at a team's own private registry alongside the official one (`registries`/`defaultRegistry` in `sanring.config.json`, `sanring add alias:componentName`), so multiple teams/products can share an internal component set
- `sanring init --theme <preset>` — named color presets (`slate`, `warm`, `high-contrast`) so you don't have to hand-edit tokens for a different look
- `sanring mcp` — an MCP server over stdio so AI coding agents (Claude Code, Cursor, Windsurf) can query and install components directly
- `ng add @sanring/cli` — Angular Schematics support, so you can bootstrap with the Angular CLI's own add mechanism instead of `npx @sanring/cli init`
- `sanring list --outdated` — a fast status overview of installed components against the registry
- Per-component "Recent changes" on each docs page
- Docs site dark mode toggle
- `sanring migrate` — surfaces breaking-change migration steps when updating components across CLI versions

See the [changelog](packages/cli/CHANGELOG.md) for the full, version-by-version history.
