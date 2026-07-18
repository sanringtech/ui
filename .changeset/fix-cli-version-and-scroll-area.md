---
"@sanring/cli": patch
---

Fix `sanring --version` reporting a hardcoded `0.0.1` instead of the package's actual version. Fix `scrollArea` being registered under the wrong name — `npx @sanring/cli add scroll-area` (matching its docs page and every other kebab-case component name) now works; it previously only responded to `scrollArea`.
