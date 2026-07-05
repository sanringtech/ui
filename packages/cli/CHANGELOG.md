# @sanring/cli

## 0.4.0

### Minor Changes

- Registry now includes `alert-dialog` (`sanring add alert-dialog`) — a Dialog variant that cannot be dismissed by backdrop click or Escape, for confirmations that require an explicit choice. Installing it also installs `dialog`, which it depends on. `sanringAlertDialogAction`/`sanringAlertDialogCancel` close with a result value (`true`/`false` by default, or a custom value), and `sanringAlertDialogTrigger` opens it declaratively, mirroring `sanringDialogTrigger`.

  Also updates the `dialog` component it depends on: adds `DialogMedia` for an icon badge above the title, `sanringDialogTrigger` now accepts an optional `sanringDialogConfig` (CDK `DialogConfig`) to override defaults per-trigger, and `sanringDialogClose` accepts an optional result value (`[sanringDialogClose]="result"`).

- Registry now includes `slider` (`sanring add slider`) — a range control for selecting a numeric value, with pointer, keyboard, ARIA slider semantics, and Angular forms support.
- Registry now includes `stepper` (`sanring add stepper`) — a multi-step workflow built on Angular CDK Stepper, with template labels, custom icons, and solid or dashed connectors.
- Registry now includes `timeline` (`sanring add timeline`) — chronological event/process primitives with vertical and horizontal orientation support.
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
