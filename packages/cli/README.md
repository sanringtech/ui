# @sanring/cli

CLI for adding [Sanring UI](https://ui.sanring.dev) components to your Angular project. Components are copied directly into your project as source — you own the code.

## Features

- No runtime UI package to depend on — nothing to install or version-pin.
- `sanring add` resolves component dependencies, peer packages, and shared utilities automatically.
- `sanring diff` / `sanring update` protect customized files by showing a diff before overwriting.

## Usage

```bash
npx @sanring/cli@latest init
npx @sanring/cli@latest add date-picker
```

Angular CLI users can bootstrap with:

```bash
ng add @sanring/cli
```

Commands are grouped by what stage of your workflow they belong to:

```bash
# Install
npx @sanring/cli@latest init                    # set up sanring.config.json + theme
npx @sanring/cli@latest add date-picker          # copy a component into your project
npx @sanring/cli@latest remove date-picker       # remove an installed component

# Explore
npx @sanring/cli@latest list                     # browse available components
npx @sanring/cli@latest search date              # search by name or description
npx @sanring/cli@latest info date-picker         # preview what would be installed

# Maintain
npx @sanring/cli@latest diff date-picker         # compare local files against registry
npx @sanring/cli@latest migrate date-picker      # check for breaking-change migration steps
npx @sanring/cli@latest update date-picker       # apply registry changes
npx @sanring/cli@latest doctor                   # check environment + project health
```

`build` generates a `registry.json` for publishing your own registry, and `mcp` starts an MCP server for AI coding agents — see below.

Every command accepts `--registry <url-or-path>` to point at a custom registry. `sanring.config.json` also supports `registries` and `defaultRegistry` for permanent alias configuration. Run any command with `--help` for the full flag list, or see [ui.sanring.dev/cli](https://ui.sanring.dev/cli) for complete documentation.

## Notes

- Requires Node.js >= 18, Angular >= 22, Tailwind CSS.
- `init` creates `sanring.config.json` and writes `src/sanring-theme.css`. Add the theme file to your global CSS once: `@import './sanring-theme.css';`
- `add` records a content hash per file so `diff`/`update` can tell untouched files from customized ones — untouched files update silently, customized files always prompt first.
- `mcp` starts an MCP server over stdio for AI coding agents (`npx @sanring/cli@latest mcp`).
- `build` generates a `registry.json` from your own Angular component source tree for publishing a private registry (`npx @sanring/cli@latest build --help`).

## Links

- **Documentation**: [ui.sanring.dev](https://ui.sanring.dev)
- **GitHub**: [github.com/sanringtech/ui](https://github.com/sanringtech/ui)

## License

MIT
