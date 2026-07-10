---
"@sanring/cli": patch
---

Fix `sanring add field` and `sanring add input`, both of which produced broken installs. `field`'s registry entry only listed `field/index.ts`, but that file re-exports from 4 other source files that were never shipped — `registry/components/field/` itself was missing everything but an empty `index.ts`. Separately, `input`'s shipped `input.directive.ts` was a stale pre-Field-integration version with no `SanringFieldControl` implementation, ARIA wiring, or Angular Forms validation state, and its registry entry didn't declare `field` as a `componentDeps` even though it imports from it.

`field` now ships its full source (`field.component.ts`, `field.type.ts`, `label.directive.ts`, `description.directive.ts`, `error-message.component.ts`) and both entries declare the `@angular/forms` peer dependency they actually need. `input` now installs `field` automatically, matching the current `@sanring/ui` implementation.
