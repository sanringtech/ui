import { defineConfig } from 'vitest/config';

// `axe-core` (used by src/testing/axe-a11y.ts) ships as a large UMD/CJS
// bundle. Pre-bundling it explicitly avoids Vite's dev server discovering it
// lazily at request time.
//
// It must ALSO be listed in the workspace root package.json, not only here
// in packages/ui's — this is not redundancy to clean up. `@angular/build`'s
// test bundler runs Vitest with `root: <workspace root>`, and when 2+ spec
// files import this helper, its esbuild step code-splits axe-a11y.ts into a
// shared chunk whose synthetic resolution base is the workspace root, not
// packages/ui. Since pnpm doesn't hoist package-local deps by default,
// axe-core only being resolvable from packages/ui/node_modules (not the
// workspace root) makes that shared chunk's `import axe from 'axe-core'`
// unresolvable — every spec importing this helper fails with "Failed to
// resolve import axe-core", but ONLY when 2+ such specs run in the same
// Vitest process (a single spec gets inlined into its own chunk instead of
// code-split, so it never hits this path — which is what made this so
// confusing to track down: it reproduced 100% of the time on a full `ng
// test` run and 0% of the time on any single-file `--include` run).
export default defineConfig({
  optimizeDeps: {
    include: ['axe-core'],
  },
});
