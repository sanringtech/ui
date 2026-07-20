---
"@sanring/cli": minor
---

`calendar`'s header label is now clickable, opening a popover with month/year `<select>` jump controls (±100/50 years from today) instead of only stepping one month at a time. `calendar`'s registry entry now declares `popover` as a `componentDep`, so `sanring add date-picker`/`sanring add calendar` also installs it.

Fixes two bugs surfaced by that feature:
- `popover`: `triggerOrigin` is now a signal instead of a plain property. A trigger nested inside an `OnPush` child component (like the calendar header's label button) gets assigned after the popover content's first change-detection pass, so a plain property read stayed `undefined` forever — the overlay never positioned correctly.
- `tree`: `TreeNodeComponent` implements the no-op `makeFocusable()` the CDK `TreeKeyManager` requires to set the initial roving tab stop, fixing keyboard navigation.
