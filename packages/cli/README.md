# @sanring/cli

CLI for adding [Sanring UI](https://ui.sanring.dev) components to your Angular project.

> Sanring UI is a collection of open-source Angular components built on top of `@angular/aria` and `@angular/cdk`, styled with Tailwind CSS. Components are copied directly into your project — you own the code.

- **No package to depend on** — components are copied as source, so there's nothing to install or version-pin.
- **`sanring add`** pulls in whatever a component depends on automatically (other components, peer packages, shared utilities).
- **`sanring diff`/`sanring update`** know the difference between "the registry moved on and you never touched this file" and "you customized it" — untouched files update silently, real customizations always show a diff and ask first.
- **`sanring info`** lets you preview exactly what a component would install before running `add`.
- **`ng add @sanring/cli`** works too — it's the same `init` flow, just reachable through the Angular CLI's own add mechanism.

## Links

- **Documentation**: [ui.sanring.dev](https://ui.sanring.dev)
- **GitHub**: [github.com/sanringtech/ui](https://github.com/sanringtech/ui)

---

## Usage

No installation required. Run with `npx`:

```bash
npx @sanring/cli@latest init
npx @sanring/cli@latest add accordion
```

Angular CLI users can also bootstrap with `ng add`, which installs `@sanring/cli` as a dev dependency and runs `init` for you:

```bash
ng add @sanring/cli
```

---

## Multiple registries

`sanring.config.json` accepts two optional fields for pointing commands at a registry other than the official one, without repeating `--registry <url>` on every invocation:

```json
{
  "componentPath": "src/app/components/ui",
  "registries": {
    "myteam": "https://registry.myteam.com"
  },
  "defaultRegistry": "myteam"
}
```

- Both fields are opt-in — an existing config without them behaves exactly as before (official bundle, with GitHub fallback).
- `defaultRegistry` must name a key in `registries`; every command that talks to a registry resolves it and uses that URL/path unless `--registry` is passed, which always wins.
- `sanring add` accepts `alias:componentName` to fetch a specific component from a non-default registry, e.g. `sanring add myteam:button`. All components in one `add` call must come from the same registry (explicit alias, or the shared `defaultRegistry` fallback) — the CLI doesn't merge component lists across registries in a single invocation.
- Installed component versions are then tracked as `alias:componentName` in `installedVersions` once an alias is known; components installed before this feature (or with no `registries` configured) keep their original bare-name key until next touched by `add`/`update`.

See [ADR-0001](https://github.com/sanringtech/ui/blob/main/.claude/adrs/0001-multi-registry-support.md) for the full design.

---

## Commands

### `init`

Initialize Sanring UI in your Angular project. Sets up `sanring.config.json`, writes `src/sanring-theme.css` (the `--sanring-*` design tokens every component reads — see [Theming](https://ui.sanring.dev/theming)), and installs base dependencies.

```bash
npx @sanring/cli@latest init
```

Add the generated stylesheet to your global CSS once:

```css
@import './sanring-theme.css';
```

Options:

| Flag | Description | Default |
|---|---|---|
| `-p, --path <path>` | Component destination path | `src/app/components/ui` |
| `-y, --yes` | Accept all defaults | `false` |
| `-f, --force` | Overwrite an existing theme file with the defaults | `false` |
| `--registry <source>` | Custom registry (URL or local path) | — |

`ng add @sanring/cli` runs this same command under the hood, with matching options (`--path`, `--skip-confirmation` for `-y`, `--force`, `--registry`):

```bash
ng add @sanring/cli --path src/app/ui --skip-confirmation
```

---

### `add <components...>`

Copy one or more components into your project and install their peer dependencies. If a peer dependency is already present but its version spec differs from the registry, `add` prompts to install the registry version spec so copied components stay aligned. If a component depends on another (e.g. `tag` depends on `badge`), the dependency is added automatically and labeled `(dependency)` in the output — no need to run `add` again.

```bash
npx @sanring/cli@latest add accordion
npx @sanring/cli@latest add button dialog
npx @sanring/cli@latest add tag   # also adds badge automatically
```

Options:

| Flag | Description |
|---|---|
| `-p, --path <path>` | Override destination path |
| `-f, --force` | Overwrite existing files after confirmation |
| `-y, --yes` | Skip overwrite confirmation when using `--force` |
| `--registry <source>` | Custom registry (URL or local path) |
| `--dry-run` | Preview changes without writing files |

---

### `remove <components...>`

Remove one or more installed components. Refuses to remove a component that another still-installed component depends on (e.g. `remove badge` while `tag` is installed) unless you pass `--force`. Shared files (`utils.ts`, `component-styles.ts`, etc.) are never deleted automatically — if none of your remaining installed components need one anymore, it's reported so you can delete it by hand.

```bash
npx @sanring/cli@latest remove accordion
npx @sanring/cli@latest remove tag badge
```

Options:

| Flag | Description |
|---|---|
| `-p, --path <path>` | Override destination path |
| `-y, --yes` | Skip the delete confirmation |
| `-f, --force` | Remove even if another installed component still depends on it |
| `--registry <source>` | Custom registry (URL or local path) |

---

### `info <component>`

Show a component's description, the full file list it would install (including any auto-added `componentDeps`), and its peer dependencies — without writing anything. Useful for checking what you're about to pull in before running `add`.

```bash
npx @sanring/cli@latest info select
```

Options:

| Flag | Description |
|---|---|
| `-p, --path <path>` | Destination path, used only to report whether it's already installed |
| `--registry <source>` | Custom registry (URL or local path) |

---

### `diff [components...]`

Sanring UI has no version concept — components are copied source, not npm packages — so there's no automatic way to know if your local copy has drifted from the registry. `diff` compares your installed files (and `sanring-theme.css`) against the current registry and prints what changed, labeling each one **safe to update** (the registry moved on, but you never touched this file) or **needs review** (you customized it) — then points you at `sanring update` to apply the safe ones.

```bash
npx @sanring/cli@latest diff            # check everything installed
npx @sanring/cli@latest diff accordion  # check just one component
```

Options:

| Flag | Description |
|---|---|
| `-p, --path <path>` | Override destination path |
| `--registry <source>` | Custom registry (URL or local path) |

---

### `update [components...]`

Applies registry changes to installed files. Files you never touched since installing (`add`/`init` record a content hash for exactly this) are updated silently — nothing to lose, since your copy still matches what was last written. Files that differ *and* were customized still show the diff and ask before overwriting, so a real edit is never clobbered. Omit component names to check everything installed.

```bash
npx @sanring/cli@latest update            # check + prompt for everything installed
npx @sanring/cli@latest update accordion  # just one component
npx @sanring/cli@latest update --yes      # apply every change without prompting
```

Options:

| Flag | Description |
|---|---|
| `-p, --path <path>` | Override destination path |
| `-y, --yes` | Apply every change without prompting |
| `--dry-run` | Show what would change without writing anything |
| `--registry <source>` | Custom registry (URL or local path) |

---

### `list`

List all available components.

```bash
npx @sanring/cli@latest list
```

---

### `mcp`

Start the Sanring UI MCP server over stdio so AI coding agents can inspect the
registry and install components without shelling out manually.

```bash
npx @sanring/cli@latest mcp
```

The server exposes five tools:

| Tool | Description |
|---|---|
| `list_components` | List every available component with its description |
| `search_components` | Search components by name or description |
| `get_component_info` | Show files, auto-installed component dependencies, shared utilities, and peer dependencies |
| `plan_component_install` | Preview files, component deps, and peer packages that would be installed — without modifying the project |
| `add_component` | Run `sanring add --yes` in the target Angular project (call `plan_component_install` first to preview) |

Claude Code example:

```json
{
  "mcpServers": {
    "sanring": {
      "command": "npx",
      "args": ["@sanring/cli@latest", "mcp"]
    }
  }
}
```

For local development before publishing, build the CLI first and point the
agent at the compiled entry:

```json
{
  "mcpServers": {
    "sanring": {
      "command": "node",
      "args": ["/absolute/path/to/sanring-workspace/packages/cli/dist/index.js", "mcp"]
    }
  }
}
```

---

### `build`

Generate a `registry.json` and matching file layout from your own Angular component source tree. Intended for teams who want to publish a private registry that `sanring add` can consume — the output format is the same schema the official Sanring UI registry uses.

```bash
npx @sanring/cli@latest build --source ./components --out ./dist-registry
```

**Source tree layout expected by `build`:**

```
your-library/
├── components/          ← pass this to --source
│   ├── button/
│   │   └── button.component.ts
│   └── card/
│       └── card.component.ts
└── shared/              ← sibling of components/, optional
    └── utils.ts
```

The scanner reads every `.ts` file in each component subdirectory (excluding `*.spec.ts`, `*.test.ts`, `*.stories.ts`), classifies import/export specifiers, and derives:

- **`componentDeps`** — relative imports that resolve to another component subdirectory (e.g. `../badge`)
- **`sharedDeps`** — relative imports under `../shared/` (e.g. `../shared/utils`)
- **`peerDependencies`** — all other bare package imports (e.g. `@angular/cdk/overlay` → `@angular/cdk`), with version specs resolved from your `package.json`

Peer dependency versions are resolved from your own `package.json` (`dependencies` → `devDependencies` → `peerDependencies`). If a package is imported but not listed in any of those, `build` exits with an error before writing any output.

Options:

| Flag | Description | Default |
|---|---|---|
| `-s, --source <path>` | Directory containing your component subdirectories | `./components` |
| `-o, --out <path>` | Output directory for `registry.json` and copied files | `./dist-registry` |
| `-n, --name <name>` | Registry name (falls back to `package.json` `"name"`) | — |
| `--dry-run` | Preview what would be written without writing any files | `false` |

Once built, host `dist-registry/` statically and point consumers at it:

```json
{
  "registries": {
    "myteam": "https://registry.myteam.com"
  },
  "defaultRegistry": "myteam"
}
```

---

## Requirements

- Node.js >= 18
- Angular >= 22
- Tailwind CSS configured in your project

## License

MIT
