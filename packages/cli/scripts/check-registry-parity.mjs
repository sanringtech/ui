#!/usr/bin/env node
// Guards against `packages/ui` and `registry/` silently drifting in *behavior*,
// not just file structure (check-registry-sync.mjs already covers structure).
//
// Root cause this replaces: the P14 CVA-base refactor (a9cb0fd) rewrote 9
// form components' registry/ copies by hand and, three separate times, lost
// something packages/ui still had — switch dropped its `ariaLabel`/
// `ariaLabelledBy` inputs and `checkedChange` output entirely; checkbox and
// radio-group both kept the `required` input but rewired their
// `aria-required` binding from `fieldRequired` (which also checks
// `Validators.required`) to a bare `required()` read. All three shipped to
// `sanring add` users for days undetected, because packages/ui's specs
// already had regression tests for exactly these cases — they just never ran
// against registry/, and the golden-fixture test only validates that
// registry.json's file list matches what's on disk, not what the code does.
//
// This script performs a static, no-execution diff so it can catch the same
// class of bug without needing a second Angular test project wired up to
// compile registry/ (attempted and abandoned — TestBed cross-project module
// resolution breaks the extends-SanringCvaBase chain; see DEVLOG P28).
//
// Two checks per matching file pair:
//   1. input()/output()/model() property names must match — catches a field
//      being dropped entirely (the switch case).
//   2. a11y-relevant attribute binding expressions (aria-*, role, disabled,
//      tabindex, id) must match verbatim after normalizing quotes/whitespace
//      — catches a binding being silently rewired to a weaker expression
//      (the checkbox/radio case), even though the input itself still exists.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const UI_COMPONENTS_DIR = join(REPO_ROOT, 'packages/ui/src/lib/components');
const REGISTRY_COMPONENTS_DIR = join(REPO_ROOT, 'registry/components');

// Known, deliberate asymmetries — documented so this doesn't cry wolf.
// key: `${dirName}/${fileName}` -> array of property names or attr names to ignore.
const EXPECTED_INPUT_OUTPUT_GAPS = {
  // packages/ui aliases the input to `disabledInput` (public API stays
  // `[disabled]="..."` via `{ alias: 'disabled' }`) so it doesn't collide with
  // the SanringFieldControl-adapter-style `disabled` getter pattern used
  // elsewhere in this file; registry didn't need the alias. Verified the
  // rendered aria-disabled/data-disabled/tabindex bindings are identical on
  // both sides (2026-08-13) — this is a naming difference only, not drift.
  'select/select-item.component.ts': ['disabledInput', 'disabled'],
  // packages/ui's `id` is a plain generated string (not input()-wrapped), so
  // consumers can't override it with `[id]="..."`; registry's is. Real,
  // pre-existing asymmetry — file-upload hasn't had its Tier 3
  // /audit-component pass yet (see TODOLIST), and fixing packages/ui means
  // changing its public `id` shape from `string` to a signal, which needs
  // that audit's scrutiny rather than a drive-by fix here.
  'file-upload/file-upload.component.ts': ['id'],
};
const EXPECTED_ATTR_GAPS = {};

let hasError = false;

function fail(message, items) {
  hasError = true;
  console.error(`✖ ${message}`);
  for (const item of items) console.error(`  - ${item}`);
  console.error('');
}

function listComponentDirs(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

function listTsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts'))
    .map((e) => e.name);
}

// --- extraction ------------------------------------------------------------

// Strips comments before regex extraction — otherwise example code inside a
// `//` comment (e.g. explaining an aliased input) can be misread as a real
// binding. Heuristic, not a real parser: block comments are removed outright;
// line comments are removed only when the `//` is preceded by whitespace or
// start-of-line, so a `https://` URL inside a string survives.
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
}

function extractInputOutputNames(source) {
  const names = new Set();
  // `readonly foo = input(...)`, `readonly foo = output<...>(...)`, `readonly foo = model(...)`
  const re = /readonly\s+(\w+)\s*=\s*(?:input|output|model)[<(]/g;
  for (const m of source.matchAll(re)) names.add(m[1]);
  return names;
}

// Attributes worth cross-checking: accessibility-relevant, likely to be
// driven by a getter (fieldRequired, errorState, ...) that's easy to silently
// downgrade to a plain input read during a mechanical refactor.
const TRACKED_ATTR_PATTERN = /^(aria-[a-z-]+|role|disabled|tabindex|id)$/;

function extractAttrBindings(source) {
  const bindings = new Map();
  // Template syntax: [attr.aria-required]="expr" or [disabled]="expr" (double-quoted)
  const templateRe = /\[(?:attr\.)?([a-zA-Z-]+)\]="([^"]*)"/g;
  // Host object literal syntax: '[attr.aria-required]': 'expr' (single-quoted both sides)
  const hostRe = /'\[(?:attr\.)?([a-zA-Z-]+)\]':\s*"([^"]*)"|'\[(?:attr\.)?([a-zA-Z-]+)\]':\s*'([^']*)'/g;

  for (const m of source.matchAll(templateRe)) {
    const [, name, expr] = m;
    if (TRACKED_ATTR_PATTERN.test(name)) bindings.set(name, normalizeExpr(expr));
  }
  for (const m of source.matchAll(hostRe)) {
    const name = m[1] ?? m[3];
    const expr = m[2] ?? m[4];
    if (name && TRACKED_ATTR_PATTERN.test(name)) bindings.set(name, normalizeExpr(expr));
  }
  return bindings;
}

function normalizeExpr(expr) {
  // Quote style ('true' vs "true") and incidental whitespace shouldn't count
  // as drift — only the referenced identifiers/logic should.
  return expr.replace(/["']/g, "'").replace(/\s+/g, ' ').trim();
}

// --- compare -----------------------------------------------------------

const uiDirs = new Set(listComponentDirs(UI_COMPONENTS_DIR));
const registryDirs = new Set(listComponentDirs(REGISTRY_COMPONENTS_DIR));
const sharedDirs = [...uiDirs].filter((d) => registryDirs.has(d));

for (const dirName of sharedDirs) {
  const uiDir = join(UI_COMPONENTS_DIR, dirName);
  const registryDir = join(REGISTRY_COMPONENTS_DIR, dirName);
  const uiFiles = new Set(listTsFiles(uiDir));
  const registryFiles = new Set(listTsFiles(registryDir));
  const sharedFiles = [...uiFiles].filter((f) => registryFiles.has(f));

  for (const fileName of sharedFiles) {
    const key = `${dirName}/${fileName}`;
    const uiSource = stripComments(readFileSync(join(uiDir, fileName), 'utf-8'));
    const registrySource = stripComments(readFileSync(join(registryDir, fileName), 'utf-8'));

    // Check 1: input/output/model property names.
    const uiNames = extractInputOutputNames(uiSource);
    const registryNames = extractInputOutputNames(registrySource);
    const ignoredNames = new Set(EXPECTED_INPUT_OUTPUT_GAPS[key] ?? []);
    const missingInRegistry = [...uiNames].filter((n) => !registryNames.has(n) && !ignoredNames.has(n));
    const missingInUi = [...registryNames].filter((n) => !uiNames.has(n) && !ignoredNames.has(n));
    if (missingInRegistry.length > 0) {
      fail(`${key}: input()/output()/model() present in packages/ui but missing in registry/`, missingInRegistry);
    }
    if (missingInUi.length > 0) {
      fail(`${key}: input()/output()/model() present in registry/ but missing in packages/ui`, missingInUi);
    }

    // Check 2: a11y-relevant attribute binding expressions.
    const uiAttrs = extractAttrBindings(uiSource);
    const registryAttrs = extractAttrBindings(registrySource);
    const ignoredAttrs = new Set(EXPECTED_ATTR_GAPS[key] ?? []);
    const mismatches = [];
    for (const [attr, uiExpr] of uiAttrs) {
      if (ignoredAttrs.has(attr)) continue;
      const registryExpr = registryAttrs.get(attr);
      if (registryExpr === undefined) {
        mismatches.push(`[${attr}]: present in packages/ui ("${uiExpr}") but not bound at all in registry/`);
      } else if (registryExpr !== uiExpr) {
        mismatches.push(`[${attr}]: packages/ui="${uiExpr}" vs registry/="${registryExpr}"`);
      }
    }
    for (const [attr] of registryAttrs) {
      if (ignoredAttrs.has(attr)) continue;
      if (!uiAttrs.has(attr)) {
        mismatches.push(`[${attr}]: bound in registry/ ("${registryAttrs.get(attr)}") but not in packages/ui`);
      }
    }
    if (mismatches.length > 0) {
      fail(`${key}: a11y attribute binding drift between packages/ui and registry/`, mismatches);
    }
  }
}

if (hasError) process.exit(1);

console.log(`✔ Registry parity check passed (${sharedDirs.length} shared component directories)`);
