# @sanring/cli

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
