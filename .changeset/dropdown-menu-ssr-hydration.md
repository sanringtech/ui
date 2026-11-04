---
'@sanring/cli': patch
---

Fix `dropdown-menu` with server-side rendering: hydration failed with NG0500 because the menu content was moved into the CDK overlay on the server too. The content now moves into the overlay only in the browser, after hydration. `rich-text-editor`'s heading menu no longer needs `ngSkipHydration`.
