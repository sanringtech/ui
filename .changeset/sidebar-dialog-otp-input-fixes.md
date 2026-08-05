---
"@sanring/cli": patch
---

`sidebar`: `SidebarProviderComponent` had no `host` styling, so the browser rendered it `display: inline` by default. Inside a flex/grid layout that broke the width it was supposed to pass through to its child, throwing off the sidebar/main-content ratio in any app shell wrapping the provider. Fixed with `display: contents`.

`dialog`: `DialogFooterComponent` only applied `space-x-2` at the `sm:` breakpoint, so stacked buttons on mobile (`flex-col-reverse`) had no gap between them. Added `gap-2` (cancelled back out to `sm:gap-0` where `space-x-2` takes over).

`otp-input`: slots could get compressed or overflow their container on narrow viewports. Host now caps at `max-w-full overflow-x-auto`; each slot is `shrink-0` so it keeps its configured size instead of being squeezed.
