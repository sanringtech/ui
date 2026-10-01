#!/usr/bin/env node
// Copies registry/ into apps/docs/src/registry-stage/ in the layout `sanring add`
// produces in a consumer app:
//
//   registry-stage/<component>/   ← registry/components/<component>/
//   registry-stage/<block>/       ← registry/blocks/<block>/
//   registry-stage/shared/        ← registry/shared/
//
// Blocks import siblings relatively (`'../card'`), which only resolves in that
// layout — so this is what lets the docs app compile (and type-check) blocks
// and render live previews. The output is gitignored; it is refreshed on
// `pnpm install` (postinstall) and before start/build/test. Pass `--watch` to
// keep it in sync while editing registry files.
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, watch } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const REGISTRY = join(ROOT, 'registry');
const DEST = join(ROOT, 'apps/docs/src/registry-stage');
const TMP = `${DEST}.tmp`;

function stage() {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  for (const group of ['components', 'blocks']) {
    const dir = join(REGISTRY, group);
    for (const name of readdirSync(dir)) {
      if (existsSync(join(TMP, name))) throw new Error(`registry-stage: "${name}" exists in more than one group`);
      cpSync(join(dir, name), join(TMP, name), { recursive: true });
    }
  }
  cpSync(join(REGISTRY, 'shared'), join(TMP, 'shared'), { recursive: true });
  rmSync(DEST, { recursive: true, force: true });
  renameSync(TMP, DEST);
}

stage();
console.log(`✔ Staged registry → ${DEST}`);

if (process.argv.includes('--watch')) {
  let timer;
  watch(REGISTRY, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      stage();
      console.log('✔ Re-staged registry');
    }, 100);
  });
  console.log('… watching registry/ for changes');
}
