#!/usr/bin/env node
// tsc only emits compiled .js for the schematics sources; the non-TS files the
// Angular schematics engine also needs (collection.json, each schema.json, and the
// package.json that marks dist/schematics/**/*.js as CommonJS despite the package's
// own "type": "module") have to be copied into dist/schematics by hand.
import { existsSync, mkdirSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = join(__dirname, '../schematics');
const DEST_DIR = join(__dirname, '../dist/schematics');

const ASSETS = ['package.json', 'collection.json', 'ng-add/schema.json'];

async function copyAssets() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`✖ Schematics source not found at ${SOURCE_DIR}`);
    process.exit(1);
  }

  for (const asset of ASSETS) {
    const src = join(SOURCE_DIR, asset);
    const dest = join(DEST_DIR, asset);
    mkdirSync(dirname(dest), { recursive: true });
    await cp(src, dest);
  }

  console.log(`✔ Copied schematics assets: ${ASSETS.join(', ')}`);
}

copyAssets();
