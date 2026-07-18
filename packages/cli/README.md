# @sanring/cli

CLI for adding [Sanring UI](https://ui.sanring.dev) components to your Angular project.

> Sanring UI is a collection of open-source Angular components built on top of `@angular/aria` and `@angular/cdk`, styled with Tailwind CSS. Components are copied directly into your project — you own the code.

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

---

### `add <components...>`

Copy one or more components into your project and install their peer dependencies. If a component depends on another (e.g. `tag` depends on `badge`), the dependency is added automatically and labeled `(dependency)` in the output — no need to run `add` again.

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

Sanring UI has no version concept — components are copied source, not npm packages — so there's no automatic way to know if your local copy has drifted from the registry. `diff` compares your installed files (and `sanring-theme.css`) against the current registry and prints what changed, so you can see whether a file was customized locally, updated upstream, or both before running `add --force`.

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

Applies registry changes to installed files, one file at a time. For each file that differs from the registry, shows the diff and asks whether to apply it — unlike `diff`, which only reports drift, `update` lets you accept or reject each change without hand-editing. Omit component names to check everything installed.

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

## Requirements

- Node.js >= 18
- Angular >= 22
- Tailwind CSS configured in your project

## License

MIT
