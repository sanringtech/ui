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

Initialize Sanring UI in your Angular project. Sets up `sanring.config.json` and installs base dependencies.

```bash
npx @sanring/cli@latest init
```

Options:

| Flag | Description | Default |
|---|---|---|
| `-p, --path <path>` | Component destination path | `src/app/components/ui` |
| `-y, --yes` | Accept all defaults | `false` |

---

### `add <component>`

Copy a component into your project and install its peer dependencies.

```bash
npx @sanring/cli@latest add accordion
npx @sanring/cli@latest add button
npx @sanring/cli@latest add dialog
```

Options:

| Flag | Description |
|---|---|
| `-p, --path <path>` | Override destination path |
| `-f, --force` | Overwrite existing files |
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
