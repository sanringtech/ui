# Component Roadmap

Prioritized by leverage (how much existing code it reuses) and value (how often
it's actually needed in a real app), not just by how visually impressive it is.
Also shown on the docs site under **Roadmap**.

## Tier 1 — Do next (cheap, high leverage)

- [ ] **Field** (`sanringFormField` / `sanringFormItem` / `sanringFormLabel` /
      `sanringFormControl` / `sanringFormDescription` / `sanringFormMessage`)
      — glue between `Input`/`Select`/`Checkbox`/`Radio` and Angular
      `ReactiveFormsModule`: label + control + description + error message
      layout, `ng-invalid`/`ng-touched` state, `aria-describedby` wiring.
      `packages/ui/src/lib/components/field/` already exists as an empty
      stub — this is the natural next build, everything else in forms
      depends on it.
- [ ] **Textarea** — effectively a multi-line `Input`, optional auto-resize.
      Trivial cost, very high usage frequency — don't lump this in with
      Combobox/Date Picker difficulty-wise.
- [ ] **Aspect Ratio** — wrapper div + CSS `aspect-ratio`. Near-zero cost.
      Already anticipated as a commented-out placeholder in
      `apps/docs/src/app/navigation/docs-navigation.ts`.
- [ ] **Alert Dialog** — a specialized `Dialog` with default
      confirm/cancel actions for destructive-action confirmations (delete,
      etc.). `Dialog` already exists, so this is mostly composition, not new
      infrastructure. Also already a commented-out placeholder in
      `docs-navigation.ts`.

## Tier 2 — Moderate cost, reuses existing overlay infra

- [ ] **Context Menu** — same shape as `Dropdown Menu` (already built), just
      triggered by `contextmenu` (right-click) at cursor coordinates instead
      of a button anchor. Cheaper than it looks given `dropdown-menu`
      already exists.
- [ ] **Hover Card** — `Popover` (already built) with a hover+delay trigger
      instead of click.
- [ ] **File Upload** — drag-and-drop zone + file list, reusing existing
      `Progress` (upload progress) and `Button` (remove/retry). New surface
      is the dropzone and file list only. Pair with Field — file inputs are
      usually part of a form.
- [ ] **Slider** — self-contained, no dependency on other components.

## Tier 3 — Standalone new infrastructure

- [ ] **Combobox** — keyboard focus management + filtering logic, genuinely
      hard. Build before Command since Command reuses the same filtering
      pattern.
- [ ] **Date Picker / Calendar** — needs date math + a calendar grid
      component, not just gluing existing primitives together.
- [ ] **Command (Cmd+K palette)** — build after Combobox; shares its
      filtering/keyboard-nav logic, layered on the existing `Dialog`.

## Tier 4 — Defer / reconsider need

These lean toward marketing/media sites rather than the app-UI (dashboards,
forms, data tables) this library has been built for so far. Revisit if that
target audience changes.

- [ ] **Resizable** (drag-to-resize split panes) — useful for IDE-like
      layouts, narrower audience.
- [ ] **Navigation Menu** (mega menu) — marketing-site top nav, high effort,
      low reuse of existing pieces.
- [ ] **Carousel** — media/marketing use case, high effort (touch/drag,
      autoplay, indicators), limited value for dashboard/form-heavy apps.
