#!/usr/bin/env node
// Mirrors the root `registry/` (source of truth, tracked in git) into
// `packages/cli/registry/` (gitignored build artifact bundled with the npm
// package), then validates that every file referenced in registry.json
// actually exists after the copy.
//
// Root cause this replaces: `packages/cli/registry` used to be populated
// by hand and had no build step keeping it in sync with root `registry/`,
// so published CLI versions could silently ship stale component code.
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = join(__dirname, '../../../registry');
const DEST_DIR = join(__dirname, '../registry');

async function sync() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`✖ Source registry not found at ${SOURCE_DIR}`);
    process.exit(1);
  }

  rmSync(DEST_DIR, { recursive: true, force: true });
  mkdirSync(DEST_DIR, { recursive: true });
  await cp(SOURCE_DIR, DEST_DIR, { recursive: true });

  console.log(`✔ Synced registry: ${SOURCE_DIR} -> ${DEST_DIR}`);
}

function validate() {
  const registryJsonPath = join(DEST_DIR, 'registry.json');
  const registry = JSON.parse(readFileSync(registryJsonPath, 'utf-8'));
  const errors = [];

  for (const shared of registry.shared ?? []) {
    const filePath = join(DEST_DIR, shared.file);
    if (!existsSync(filePath)) {
      errors.push(`shared "${shared.name}" references missing file: ${shared.file}`);
    }
  }

  for (const component of registry.components ?? []) {
    for (const file of component.files ?? []) {
      const filePath = join(DEST_DIR, 'components', file);
      if (!existsSync(filePath)) {
        errors.push(`component "${component.name}" references missing file: components/${file}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`✖ registry.json is out of sync with registry files:\n`);
    for (const err of errors) console.error(`  - ${err}`);
    console.error('');
    process.exit(1);
  }

  console.log(
    `✔ registry.json verified (${registry.components.length} components, ${registry.shared.length} shared files)`,
  );
}

await sync();
validate();
