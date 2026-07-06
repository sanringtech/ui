---
"@sanring/cli": minor
---

Registry now includes `alert-dialog`, `slider`, `stepper`, and `timeline` components.

- `sanring add alert-dialog` — a Dialog variant requiring an explicit user choice (cannot be dismissed by backdrop or Escape). Includes `sanringAlertDialogTrigger`, `sanringAlertDialogAction`, and `sanringAlertDialogCancel` directives. Installing it also installs `dialog` as a dependency.
- `sanring add slider` — a range control with pointer, keyboard, and ARIA slider semantics, plus Angular forms support.
- `sanring add stepper` — a multi-step workflow built on Angular CDK Stepper, with template labels, custom icons, and solid or dashed connectors.
- `sanring add timeline` — chronological event/process primitives with vertical and horizontal orientation.

Also updates the `dialog` component: adds `DialogMedia` for an icon badge above the title, `sanringDialogTrigger` now accepts an optional `sanringDialogConfig` to override CDK `DialogConfig` per-trigger, and `sanringDialogClose` accepts an optional result value (`[sanringDialogClose]="result"`).
