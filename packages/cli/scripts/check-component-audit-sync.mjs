#!/usr/bin/env node
// COMPONENT_AUDIT.md's "Specs" column is a hand-maintained snapshot of how
// many .spec.ts files each component has. Nothing forced it to stay in sync
// with the filesystem — exactly the kind of drift this repo has already hit
// with stale "current state" claims elsewhere. This script re-derives the
// real count from disk and fails if the table disagrees, and makes sure the
// table covers exactly the current set of official components (no missing
// rows for new components, no leftover rows for removed ones).
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const AUDIT_PATH = join(REPO_ROOT, 'COMPONENT_AUDIT.md');
const UI_COMPONENTS_DIR = join(REPO_ROOT, 'packages/ui/src/lib/components');

const UI_NON_COMPONENT_ENTRIES = new Set(['shared']);

let hasError = false;

function fail(message, items) {
  hasError = true;
  console.error(`✖ ${message}`);
  for (const item of items) console.error(`  - ${item}`);
  console.error('');
}

function getUiComponentDirNames() {
  return readdirSync(UI_COMPONENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !UI_NON_COMPONENT_ENTRIES.has(e.name))
    .map((e) => e.name);
}

function getActualSpecCount(name) {
  return readdirSync(join(UI_COMPONENTS_DIR, name)).filter((f) => f.endsWith('.spec.ts')).length;
}

// Parses `| name | batch | risk | surface | specs | ... |` rows from the
// "## Matrix" table. Deliberately only reads the columns this script checks
// (name, specs) — the rest (a11y/keyboard/api/ssr/docs/next) are free-form
// judgment calls this script has no way to verify.
function getAuditRows() {
  const source = readFileSync(AUDIT_PATH, 'utf-8');
  const rows = [];
  for (const line of source.split('\n')) {
    const m = line.match(/^\| ([a-z0-9-]+) \| [\w-]+ \| \w+ \| \w+ \| (\d+) \|/);
    if (m) rows.push({ name: m[1], specs: Number(m[2]) });
  }
  return rows;
}

const uiComponents = getUiComponentDirNames();
const uiComponentSet = new Set(uiComponents);
const auditRows = getAuditRows();
const auditedSet = new Set(auditRows.map((r) => r.name));

const missingFromAudit = uiComponents.filter((name) => !auditedSet.has(name));
if (missingFromAudit.length > 0) {
  fail(
    `${missingFromAudit.length} component(s) exist in packages/ui but have no row in COMPONENT_AUDIT.md's Matrix table`,
    missingFromAudit,
  );
}

const staleAuditRows = auditRows.filter((r) => !uiComponentSet.has(r.name));
if (staleAuditRows.length > 0) {
  fail(
    `${staleAuditRows.length} row(s) in COMPONENT_AUDIT.md's Matrix table reference a component that no longer exists in packages/ui`,
    staleAuditRows.map((r) => r.name),
  );
}

const staleSpecCounts = [];
for (const row of auditRows) {
  if (!uiComponentSet.has(row.name)) continue; // already reported above
  const actual = getActualSpecCount(row.name);
  if (actual !== row.specs) {
    staleSpecCounts.push(`${row.name}: table says ${row.specs}, actually has ${actual}`);
  }
}
if (staleSpecCounts.length > 0) {
  fail(
    `${staleSpecCounts.length} component(s) have a stale "Specs" count in COMPONENT_AUDIT.md — update the row to match reality`,
    staleSpecCounts,
  );
}

if (hasError) process.exit(1);

console.log(`✔ COMPONENT_AUDIT.md sync check passed (${auditRows.length} rows, specs counts match disk)`);
