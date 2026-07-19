# @sanring/cli

## 0.9.2

### Patch Changes

- ce1f66e: Refresh the README (shown on the npm package page): the `diff`/`update` command docs described the old "just prints every diff" behavior instead of the current safe-to-update vs needs-review distinction, and there was no summary of the CLI's current standout features up top.

## 0.9.1

### Patch Changes

- fe5fad8: `diff` now labels each changed file as "safe to update" (registry moved on, you never touched the file) or "needs review" (you customized it), reusing the same baseline-hash comparison `update` uses, and its summary line points you at `sanring update` to apply the safe ones.

## 0.9.0

### Minor Changes

- 6685a1d: `update` now tells apart files you never touched since installing from ones you customized. Untouched files (registry moved on, your copy still matches what `add`/`update` last wrote) apply silently — only files that actually diverged from that baseline show a diff and ask for confirmation. `add` and `init` now record each file's content hash in `sanring.config.json` to make this possible.

## 0.8.0

### Minor Changes

- acfa713: Add three new commands:

  - `sanring info <component>` — shows a component's description, full file list (including auto-added dependencies), and peer dependencies without installing anything.
  - `sanring remove <components...>` (alias `rm`) — removes installed components. Refuses to remove one that another still-installed component depends on unless `--force` is passed; reports shared files that may no longer be needed instead of deleting them automatically.
  - `sanring update [components...]` — walks installed files that differ from the registry and prompts to apply each change, instead of only reporting drift like `diff` does.

## 0.7.1

### Patch Changes

- fdc764f: `sanring --help` now prints a "Quick start" block with the actual init/add command sequence and a note that no npm install is needed, instead of leaving first-time users to find that in the README.

## 0.7.0

### Minor Changes

- e620e62: Add 10 components that were documented on the docs site but missing from the CLI registry: carousel, combobox, command, dropdown-menu, hover-card, pagination, resizable, select, table, and tree. `npx @sanring/cli add <name>` now works for all of them. Also adds two new shared helpers (`collection-controller`, `collection-state`) used by combobox and command.

### Patch Changes

- 3271557: Fix `sanring --version` reporting a hardcoded `0.0.1` instead of the package's actual version. Fix `scrollArea` being registered under the wrong name — `npx @sanring/cli add scroll-area` (matching its docs page and every other kebab-case component name) now works; it previously only responded to `scrollArea`.

## 0.6.1

### Patch Changes

- d97444e: Fix `sanring add field` and `sanring add input`, both of which produced broken installs. `field`'s registry entry only listed `field/index.ts`, but that file re-exports from 4 other source files that were never shipped — `registry/components/field/` itself was missing everything but an empty `index.ts`. Separately, `input`'s shipped `input.directive.ts` was a stale pre-Field-integration version with no `SanringFieldControl` implementation, ARIA wiring, or Angular Forms validation state, and its registry entry didn't declare `field` as a `componentDeps` even though it imports from it.

  `field` now ships its full source (`field.component.ts`, `field.type.ts`, `label.directive.ts`, `description.directive.ts`, `error-message.component.ts`) and both entries declare the `@angular/forms` peer dependency they actually need. `input` now installs `field` automatically, matching the current `@sanring/ui` implementation.

## 0.6.0

### Minor Changes

- 205c89d: `init` now writes `src/sanring-theme.css` — the full set of `--sanring-*` design tokens every component reads (color scales, semantic colors, radius, progress/badge tokens). Previously these variables only existed inside the docs app itself, so a fresh `sanring init` + `sanring add` produced components with no visible styling. Existing files are left alone by default (protects any brand-color edits); pass `-f/--force` to reset to the shipped defaults. Also adds the `--sanring-primary`/`--sanring-primary-fg` alias needed for Radio and Checkbox's Tailwind-bridged `bg-primary`/`text-primary`/`border-primary` utilities to resolve.

  New `sanring diff [components...]` command. Sanring UI has no version concept — components are copied source, not npm packages — so there was previously no way to know if a local file had drifted from the registry before `add --force` overwrote it. `diff` compares installed components and `sanring-theme.css` against the current registry line by line, printing what's been customized locally versus what changed upstream. Omit component names to check everything currently installed.

## 0.5.1

### Patch Changes

- 5641f88: Sync `registry/shared/utils.ts` with `@sanring/ui`'s `utils.ts`, adding the `uniqueId()` helper. Components with `sharedDeps: ["utils"]` were missing this function, which the in-progress Field/Input `id` generation now depends on.

## 0.5.0

### Minor Changes

- b5211cc: Registry now includes `alert-dialog`, `slider`, `stepper`, and `timeline` components.

  - `sanring add alert-dialog` — a Dialog variant requiring an explicit user choice (cannot be dismissed by backdrop or Escape). Includes `sanringAlertDialogTrigger`, `sanringAlertDialogAction`, and `sanringAlertDialogCancel` directives. Installing it also installs `dialog` as a dependency.
  - `sanring add slider` — a range control with pointer, keyboard, and ARIA slider semantics, plus Angular forms support.
  - `sanring add stepper` — a multi-step workflow built on Angular CDK Stepper, with template labels, custom icons, and solid or dashed connectors.
  - `sanring add timeline` — chronological event/process primitives with vertical and horizontal orientation.

  Also updates the `dialog` component: adds `DialogMedia` for an icon badge above the title, `sanringDialogTrigger` now accepts an optional `sanringDialogConfig` to override CDK `DialogConfig` per-trigger, and `sanringDialogClose` accepts an optional result value (`[sanringDialogClose]="result"`).

## 0.4.0

### Minor Changes

- 20c768d: Registry now includes `aspect-ratio` and `textarea` components (`sanring add aspect-ratio`, `sanring add textarea`). `@sanring/ui`'s `input` directive no longer targets `<textarea>` — use the new `sanringTextarea` directive instead when re-copying the `input` component.

## 0.3.0

### Minor Changes

- 6cc0001: `add` now accepts multiple component names (`sanring add button dialog`) and automatically installs a component's `componentDeps` (e.g. `sanring add tag` also adds `badge`), labeling auto-added components `(dependency)` in the output. Shared files and peer dependencies are deduped and installed once across the whole batch. Single-component usage is unaffected.

## 0.2.1

### Patch Changes

- 5ffb8f9: Fix `packages/cli/registry` (bundled with the published package) silently drifting from the root `registry/` source of truth. `pnpm build` now runs a `sync-registry` step that mirrors root `registry/` into the package and fails the build if `registry.json` references a file that doesn't exist, so a stale/broken registry can no longer ship unnoticed.

  Also fix the version-pinned remote registry fallback (used when the bundled registry is missing, e.g. before a first build): it referenced a `v<version>` git tag and `packages/cli/registry`, neither of which ever existed — Changesets tags releases as `<package-name>@<version>`, and `packages/cli/registry` is gitignored so it's never committed. The fallback now points at the correct tag (URL-encoded `refs/tags/@sanring/cli@<version>`) and the repo-root `registry/` directory, and was verified end-to-end against the real GitHub repo.

  Adds unit tests for package-manager detection, config read/write, and registry source-resolution priority (local path → URL → bundled registry → remote fallback).

## 0.2.0

### Minor Changes

- edee46d: Add `--dry-run` to `add`, previewing which files would be created or overwritten without writing to disk or installing dependencies.

## 0.1.0

### Minor Changes

- db4d79a: Add `init` command, auto-install peer dependencies, and spinner UX

### Patch Changes

- 1d9ef19: feat: 自動偵測 package manager（npm/pnpm/yarn/bun）
