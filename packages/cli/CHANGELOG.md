# @sanring/cli

## 0.11.0

### Minor Changes

- 87a49eb: `calendar`'s header label is now clickable, opening a popover with month/year `<select>` jump controls (±100/50 years from today) instead of only stepping one month at a time. `calendar`'s registry entry now declares `popover` as a `componentDep`, so `sanring add date-picker`/`sanring add calendar` also installs it.

  Fixes two bugs surfaced by that feature:
  - `popover`: `triggerOrigin` is now a signal instead of a plain property. A trigger nested inside an `OnPush` child component (like the calendar header's label button) gets assigned after the popover content's first change-detection pass, so a plain property read stayed `undefined` forever — the overlay never positioned correctly.
  - `tree`: `TreeNodeComponent` implements the no-op `makeFocusable()` the CDK `TreeKeyManager` requires to set the initial roving tab stop, fixing keyboard navigation.

### Patch Changes

- 87a49eb: Internal performance work, no behavior change: `add`/`diff`/`update`/`info`/`remove` now look up components and shared entries through a `createRegistryIndex` map instead of repeated `Array.find`/`.map` scans over the registry, and component/shared file fetches in `add`/`diff`/`update` run through a bounded concurrent worker pool instead of one `await` at a time — noticeable on multi-file components and custom remote registries.
- 87a49eb: Fix `add`/`init` installing peer dependencies via `spawnSync(..., { shell: true })` on a command string split on spaces — a custom `--registry` could supply a package name/version containing shell metacharacters that would be interpreted by the shell. Both commands now build `{ bin, args }` directly and run with `shell: false`.

  `add --shared-path` is now saved to `sanring.config.json`. Previously only the initial install respected it; `diff`/`update`/`remove` always assumed shared utilities lived at `<componentPath>/shared`, so projects using a custom shared path saw drift on every subsequent command.

  `fetchRegistry` now validates the parsed JSON shape (local bundle, `--registry <path>`, and remote fetch) and reports which field is malformed, instead of letting a bad registry fail later inside an unrelated command with a confusing error.

## 0.10.0

### Minor Changes

- 9b04366: `sanring doctor`: new command that checks your environment and project config for common issues. Reports Node.js version, Angular project detection, sanring.config.json validity, theme file presence, per-file hash integrity (untouched / customized / orphaned), and registry reachability. Use `--offline` to skip the network check. Exits with code 1 when hard errors are found so CI pipelines can gate on it.
- b2c1d79: `sanring info` (no argument) now shows project context: CLI version, Angular detection, config path, theme file status, and the full list of installed components. Accepts `--json` for machine-readable output suitable for CI pipelines and coding agents.

  `sanring info <component>` retains its existing behavior (files, peer deps, install status) and also gains `--json` output.

- 9a9b5cf: New `sanring search <query>` command. Searches component names and descriptions (name matches ranked first), highlights the matched substring, and shows a ✔ badge next to already-installed components when run inside an Angular project.

### Patch Changes

- ddc522a: `update` now installs files that were added to a registry component after the user's last `add` — previously these were silently skipped, leaving the component incomplete even after a successful update. `diff` also now surfaces these missing files as "new in registry" so users know to run `sanring update` to pick them up.
- 774f3f7: `sanring update --trust`: users who installed components before v0.9.0 have no recorded hash baseline. Without `--trust` every changed file would show as a conflict even if it was never customised. `--trust` promotes those no-baseline conflicts to silent auto-updates, letting pre-0.9.0 projects catch up cleanly in one pass. A note in the output shows how many files were trusted so the user can audit the assumption afterwards.

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
