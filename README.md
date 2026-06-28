# Sanring UI

Headless Angular UI components — copy and paste into your project.

Built with Angular 22, Tailwind CSS v4, and `@angular/aria` for accessibility.

---

## Usage

```bash
# Add a component to your project
npx @sanring/cli@latest add accordion

# List all available components
npx @sanring/cli@latest list
```

Works with any package manager:

```bash
pnpm dlx @sanring/cli@latest add accordion
yarn dlx @sanring/cli@latest add accordion
bunx @sanring/cli@latest add accordion
```

Components are copied directly into your source code — you own them and can modify them freely.

---

## Available Components

accordion · alert · avatar · badge · breadcrumb · button · card · checkbox · collapsible · dialog · divider · field · input · label · link · menu · popover · progress · radio · scrollArea · sheet · skeleton · spinner · switch · tabs · tag · toast · toggle · tooltip

---

## How it works

This is a **copy-paste component library**, not a traditional npm package.

When you run `npx @sanring/cli@latest add accordion`:

1. CLI fetches the component source from this repository
2. Files are written directly into your project (`src/app/components/ui/`)
3. You own the code — modify it however you need

---

## Monorepo Structure

```
sanring-ui/
├── apps/docs/        ← Documentation site
├── packages/ui/      ← Component source (development only)
├── packages/cli/     ← @sanring/cli published to npm
└── registry/         ← Component templates fetched by CLI
```

---

## Tech Stack

| | |
|---|---|
| Framework | [Angular 22](https://angular.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Accessibility | [@angular/aria](https://angular.dev/guide/aria) + [@angular/cdk](https://material.angular.io/cdk) |
| Icons | [@lucide/angular](https://lucide.dev) |
| Package Manager | [pnpm](https://pnpm.io) |
| Versioning | [Changesets](https://github.com/changesets/changesets) |

---

## License

[MIT](./LICENSE) © 2026 sanring
