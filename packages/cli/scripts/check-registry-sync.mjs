#!/usr/bin/env node
// Guards against the docs site documenting a component whose source was never
// added to the registry — `npx @sanring/cli add <name>` would fail for it.
// Root cause this replaces: apps/docs/.../docs-navigation.ts once listed 10
// components (carousel, combobox, command, dropdown-menu, hover-card,
// pagination, resizable, select, table, tree) that had docs pages but no
// registry entry, and nothing caught it until a user actually ran the CLI.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const DOCS_NAV_PATH = join(
  REPO_ROOT,
  'apps/docs/src/app/navigation/docs-navigation.ts',
);
const REGISTRY_JSON_PATH = join(REPO_ROOT, 'registry/registry.json');

function getDocumentedComponentIds() {
  const source = readFileSync(DOCS_NAV_PATH, 'utf-8');
  const typeMatch = source.match(
    /export type DocsComponentId =\s*([\s\S]*?);/,
  );
  if (!typeMatch) {
    console.error('✖ Could not find "export type DocsComponentId" in docs-navigation.ts');
    process.exit(1);
  }
  return [...typeMatch[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
}

function getRegistryComponentNames() {
  const registry = JSON.parse(readFileSync(REGISTRY_JSON_PATH, 'utf-8'));
  return registry.components.map((c) => c.name);
}

// Documented components that intentionally have no registry entry, with why.
const EXPECTED_GAPS = {
  'date-picker': 'real published npm package (@sanring/date-picker), not CLI-copied source',
};

const documented = getDocumentedComponentIds();
const registered = getRegistryComponentNames();
const registeredSet = new Set(registered);
const documentedSet = new Set(documented);

const missingFromRegistry = documented.filter(
  (id) => !registeredSet.has(id) && !(id in EXPECTED_GAPS),
);
const missingFromDocs = registered.filter((name) => !documentedSet.has(name));

if (missingFromRegistry.length > 0) {
  console.error(
    `✖ ${missingFromRegistry.length} component(s) are documented on the docs site but missing from the registry — "sanring add" would fail for them:\n`,
  );
  for (const id of missingFromRegistry) console.error(`  - ${id}`);
  console.error(
    '\n  Add the component source under registry/components/<name>/ and register it in registry/registry.json.\n',
  );
}

if (missingFromDocs.length > 0) {
  console.warn(
    `⚠ ${missingFromDocs.length} component(s) are installable via the CLI but have no docs page (informational, not a failure):\n`,
  );
  for (const name of missingFromDocs) console.warn(`  - ${name}`);
  console.warn('');
}

if (missingFromRegistry.length > 0) {
  process.exit(1);
}

console.log(
  `✔ Registry sync check passed (${documented.length} documented, ${registered.length} registered)`,
);
