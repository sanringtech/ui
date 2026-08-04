#!/usr/bin/env node
// Guards against a "official" component drifting out of sync across the four
// surfaces that all have to agree for it to actually work end-to-end:
//   registry/registry.json      — what `sanring add <name>` can install
//   registry/components/<name>/ — the source files that entry points at
//   packages/ui/.../<name>/     — the real library implementation
//   public-api.ts               — whether consumers of @sanring/ui can import it
//   docs navigation/pages       — what the docs site claims exists
//
// Root cases this replaces (both bit us before there was any automated check):
// - docs-navigation.ts once listed 10 components with docs pages but no
//   registry entry, so `npx @sanring/cli add <name>` failed for them.
// - a leftover `menu` registry entry (source + registry.json) had no
//   packages/ui implementation, no public API export, and no docs page —
//   `sanring add menu` would have installed source for a component that was
//   never actually part of the library.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const DOCS_NAV_PATH = join(REPO_ROOT, 'apps/docs/src/app/navigation/docs-navigation.ts');
const DOCS_ROUTES_PATH = join(REPO_ROOT, 'apps/docs/src/app/app.routes.ts');
const DOCS_PAGES_DIR = join(REPO_ROOT, 'apps/docs/src/app/pages/components');
const REGISTRY_JSON_PATH = join(REPO_ROOT, 'registry/registry.json');
const REGISTRY_COMPONENTS_DIR = join(REPO_ROOT, 'registry/components');
const UI_COMPONENTS_DIR = join(REPO_ROOT, 'packages/ui/src/lib/components');
const PUBLIC_API_PATH = join(REPO_ROOT, 'packages/ui/src/public-api.ts');

// Directories under packages/ui/src/lib/components that are shared code, not
// a component with its own registry/docs entry.
const UI_NON_COMPONENT_ENTRIES = new Set(['shared']);

let hasError = false;
let hasWarning = false;

function fail(message, items) {
  hasError = true;
  console.error(`✖ ${message}`);
  for (const item of items) console.error(`  - ${item}`);
  console.error('');
}

function warn(message, items) {
  hasWarning = true;
  console.warn(`⚠ ${message}`);
  for (const item of items) console.warn(`  - ${item}`);
  console.warn('');
}

// --- gather each surface -----------------------------------------------

function getRegistry() {
  return JSON.parse(readFileSync(REGISTRY_JSON_PATH, 'utf-8'));
}

function getRegistryComponentNames(registry) {
  return registry.components.map((c) => c.name);
}

function getRegistryDirNames() {
  return readdirSync(REGISTRY_COMPONENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

function getUiComponentDirNames() {
  return readdirSync(UI_COMPONENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !UI_NON_COMPONENT_ENTRIES.has(e.name))
    .map((e) => e.name);
}

function getPublicApiExportedNames() {
  const source = readFileSync(PUBLIC_API_PATH, 'utf-8');
  // Anchored to the start of the line (ignoring leading whitespace) so a
  // commented-out `// export * from ...` isn't picked up as still exported.
  return [...source.matchAll(/^\s*export \* from '\.\/lib\/components\/([a-z0-9-]+)';/gm)].map(
    (m) => m[1],
  );
}

function getDocsComponentIds() {
  const source = readFileSync(DOCS_NAV_PATH, 'utf-8');
  const typeMatch = source.match(/export type DocsComponentId =\s*([\s\S]*?);/);
  if (!typeMatch) {
    console.error('✖ Could not find "export type DocsComponentId" in docs-navigation.ts');
    process.exit(1);
  }
  return [...typeMatch[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
}

function getDocsPageDirNames() {
  if (!existsSync(DOCS_PAGES_DIR)) return [];
  return readdirSync(DOCS_PAGES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((id) => existsSync(join(DOCS_PAGES_DIR, id, `${id}-page.component.ts`)));
}

// Extract `path: '<slug>'` entries scoped to the `path: 'components'` route's
// own `children: [...]` array — bracket-matched so it doesn't pick up
// unrelated top-level routes (introduction, theming, ...).
function getRoutedComponentIds() {
  const source = readFileSync(DOCS_ROUTES_PATH, 'utf-8');
  const anchor = source.indexOf(`path: 'components'`);
  if (anchor === -1) {
    console.error('✖ Could not find the components route in app.routes.ts');
    process.exit(1);
  }
  const childrenStart = source.indexOf('children: [', anchor);
  let depth = 0;
  let end = -1;
  for (let i = childrenStart; i < source.length; i++) {
    if (source[i] === '[') depth++;
    else if (source[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const block = source.slice(childrenStart, end === -1 ? undefined : end);
  return [...block.matchAll(/path: '([a-z0-9-]+)'/g)].map((m) => m[1]).filter((id) => id !== '');
}

// --- compare two surfaces -------------------------------------------------

// EXPECTED_GAPS[key] documents an intentional asymmetry between two surfaces,
// with why, so the check doesn't flag it every run.
const EXPECTED_GAPS = {};

function diffSurfaces({ a, aLabel, b, bLabel, onlyInAFails, onlyInBFails, gapKey }) {
  const aSet = new Set(a);
  const bSet = new Set(b);
  const expected = new Set(EXPECTED_GAPS[gapKey] ?? []);

  const onlyInA = a.filter((id) => !bSet.has(id) && !expected.has(id));
  const onlyInB = b.filter((id) => !aSet.has(id) && !expected.has(id));

  if (onlyInA.length > 0) {
    const report = onlyInA.map((id) => `${id} (in ${aLabel}, missing from ${bLabel})`);
    if (onlyInAFails) fail(`${onlyInA.length} component(s) out of sync: ${aLabel} → ${bLabel}`, report);
    else warn(`${onlyInA.length} component(s) out of sync: ${aLabel} → ${bLabel}`, report);
  }
  if (onlyInB.length > 0) {
    const report = onlyInB.map((id) => `${id} (in ${bLabel}, missing from ${aLabel})`);
    if (onlyInBFails) fail(`${onlyInB.length} component(s) out of sync: ${bLabel} → ${aLabel}`, report);
    else warn(`${onlyInB.length} component(s) out of sync: ${bLabel} → ${aLabel}`, report);
  }
}

// --- run ---------------------------------------------------------------

const registry = getRegistry();
const registryNames = getRegistryComponentNames(registry);
const registryDirs = getRegistryDirNames();
const uiDirs = getUiComponentDirNames();
const publicApiNames = getPublicApiExportedNames();
const docsIds = getDocsComponentIds();
const docsPageDirs = getDocsPageDirNames();
const routedIds = getRoutedComponentIds();

// 1. registry.json entries must point at files that actually exist —
//    otherwise `sanring add <name>` fails at install time, not at CI time.
for (const component of registry.components) {
  const missingFiles = component.files.filter(
    (relativePath) => !existsSync(join(REGISTRY_COMPONENTS_DIR, relativePath)),
  );
  if (missingFiles.length > 0) {
    fail(
      `registry.json component "${component.name}" lists file(s) that don't exist under registry/components/`,
      missingFiles,
    );
  }
}

// 2. registry.json name ↔ registry/components/<name>/ directory.
diffSurfaces({
  a: registryNames,
  aLabel: 'registry.json',
  b: registryDirs,
  bLabel: 'registry/components/',
  onlyInAFails: true, // entry with no source dir — sanring add would fail
  onlyInBFails: false, // orphan source dir nothing points at — dead code, not a user-facing break
  gapKey: 'registryJsonVsRegistryDir',
});

// 3. registry.json name ↔ packages/ui component dir — this is the exact
//    "menu" bug class: a registry entry with no real library implementation.
diffSurfaces({
  a: registryNames,
  aLabel: 'registry.json',
  b: uiDirs,
  bLabel: 'packages/ui/src/lib/components/',
  onlyInAFails: true,
  onlyInBFails: false, // implemented but not yet CLI-installable — normal WIP state
  gapKey: 'registryJsonVsUiLib',
});

// 4. packages/ui component dir ↔ public-api.ts export — an unexported
//    component can't actually be imported by consumers of @sanring/ui.
diffSurfaces({
  a: uiDirs,
  aLabel: 'packages/ui/src/lib/components/',
  b: publicApiNames,
  bLabel: 'public-api.ts',
  onlyInAFails: true,
  onlyInBFails: true, // an export pointing at a non-existent dir would break `ng build` anyway
  gapKey: 'uiLibVsPublicApi',
});

// 5. docs nav id ↔ registry.json name — documented but not installable.
diffSurfaces({
  a: docsIds,
  aLabel: 'docs-navigation.ts',
  b: registryNames,
  bLabel: 'registry.json',
  onlyInAFails: true,
  onlyInBFails: false, // installable but undocumented yet — informational
  gapKey: 'docsVsRegistryJson',
});

// 6. docs nav id ↔ packages/ui component dir — docs describing something
//    that was never actually implemented.
diffSurfaces({
  a: docsIds,
  aLabel: 'docs-navigation.ts',
  b: uiDirs,
  bLabel: 'packages/ui/src/lib/components/',
  onlyInAFails: true,
  onlyInBFails: false, // implemented but not documented yet — normal WIP state
  gapKey: 'docsVsUiLib',
});

// 7. docs nav id ↔ actual <id>-page.component.ts file under pages/components.
diffSurfaces({
  a: docsIds,
  aLabel: 'docs-navigation.ts',
  b: docsPageDirs,
  bLabel: 'pages/components/<id>/<id>-page.component.ts',
  onlyInAFails: true,
  onlyInBFails: false, // an orphan page file nothing links to — dead code, not a user-facing break
  gapKey: 'docsVsPageFile',
});

// 8. docs nav id ↔ route actually registered in app.routes.ts — otherwise the
//    sidebar/search link 404s.
diffSurfaces({
  a: docsIds,
  aLabel: 'docs-navigation.ts',
  b: routedIds,
  bLabel: 'app.routes.ts',
  onlyInAFails: true,
  onlyInBFails: true, // a route with no nav entry is reachable but silently orphaned — worth flagging too
  gapKey: 'docsVsRoutes',
});

if (hasError) process.exit(1);

console.log(
  `✔ Registry sync check passed (${docsIds.length} documented, ${registryNames.length} registered, ${uiDirs.length} implemented, ${publicApiNames.length} exported, ${routedIds.length} routed)${hasWarning ? ' — with warnings above' : ''}`,
);
