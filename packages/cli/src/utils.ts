import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import type { Dirent } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import pc from 'picocolors';

export const CONFIG_FILE = 'sanring.config.json';
export const DEFAULT_COMPONENT_PATH = 'src/app/components/ui';

export interface SanringConfig {
  componentPath: string;
  sharedPath?: string;
  // Baseline hash of each installed file's content at the last point we wrote
  // it (via `add` or `update`), keyed by the same label used in diff/update
  // output (e.g. "calendar/calendar.component.ts", "shared/utils.ts").
  // Lets `update` tell "untouched since install" apart from "user edited it"
  // without needing to keep a full copy of the original file around.
  installedHashes?: Record<string, string>;
}

export function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// True when `local` still matches the hash recorded at the last add/update —
// i.e. nothing has touched the file since. Shared by `update` (decides what
// can be applied without a prompt) and `diff` (labels drift as "registry
// moved, safe to update" vs. "you customized this, review it").
export function isUntouchedSinceInstall(local: string, recordedHash: string | undefined): boolean {
  return recordedHash !== undefined && recordedHash === hashContent(local);
}

export function readConfig(cwd: string): SanringConfig | null {
  const configPath = join(cwd, CONFIG_FILE);
  if (!existsSync(configPath)) return null;
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8')) as SanringConfig;
  } catch {
    return null;
  }
}

export function writeConfig(cwd: string, config: SanringConfig): void {
  const configPath = join(cwd, CONFIG_FILE);
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

export function getInstalledPackageSpecs(cwd: string): Map<string, string> {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return new Map();
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return new Map([
      ...Object.entries<string>(pkg.dependencies ?? {}),
      ...Object.entries<string>(pkg.devDependencies ?? {}),
      ...Object.entries<string>(pkg.peerDependencies ?? {}),
    ]);
  } catch {
    return new Map();
  }
}

export function getInstalledPackages(cwd: string): Set<string> {
  return new Set(getInstalledPackageSpecs(cwd).keys());
}

type VersionTuple = [major: number, minor: number, patch: number];

function parseMinimumVersion(spec: string): VersionTuple | null {
  const match = spec.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareVersions(a: VersionTuple, b: VersionTuple): number {
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    if (diff !== 0) return diff;
  }
  return 0;
}

export function satisfiesMinimumPackageSpec(installedSpec: string, requiredSpec: string): boolean {
  if (installedSpec === requiredSpec) return true;

  const installed = parseMinimumVersion(installedSpec);
  const required = parseMinimumVersion(requiredSpec);
  if (!installed || !required) return false;
  if (compareVersions(installed, required) < 0) return false;

  if (requiredSpec.startsWith('^')) {
    if (required[0] > 0) return installed[0] === required[0];
    if (required[1] > 0) return installed[0] === required[0] && installed[1] === required[1];
    return installed[0] === required[0] && installed[1] === required[1] && installed[2] === required[2];
  }

  if (requiredSpec.startsWith('~')) {
    return installed[0] === required[0] && installed[1] === required[1];
  }

  if (requiredSpec.startsWith('>=')) {
    return true;
  }

  return installed[0] === required[0] && installed[1] === required[1] && installed[2] === required[2];
}

export function isAngularProject(cwd: string): boolean {
  return existsSync(join(cwd, 'angular.json'));
}

// ─── Monorepo detection ──────────────────────────────────────────────────────

export type MonorepoType = 'pnpm' | 'nx' | 'lerna' | 'turbo' | 'npm-workspaces';

export interface MonorepoInfo {
  type: MonorepoType;
  root: string;
}

// Checks a single directory for monorepo signals. Does NOT walk up.
// nx.json is only treated as a monorepo signal when angular.json is absent,
// because a single-project Nx setup has both at the same root.
export function detectMonorepoRoot(dir: string): MonorepoInfo | null {
  if (existsSync(join(dir, 'pnpm-workspace.yaml'))) return { type: 'pnpm', root: dir };
  if (existsSync(join(dir, 'lerna.json'))) return { type: 'lerna', root: dir };
  if (existsSync(join(dir, 'turbo.json'))) return { type: 'turbo', root: dir };
  if (existsSync(join(dir, 'nx.json')) && !existsSync(join(dir, 'angular.json'))) {
    return { type: 'nx', root: dir };
  }
  try {
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8')) as {
      workspaces?: unknown;
    };
    const ws = pkg.workspaces;
    if (Array.isArray(ws) || (ws && typeof ws === 'object' && Array.isArray((ws as Record<string, unknown>).packages))) {
      return { type: 'npm-workspaces', root: dir };
    }
  } catch {
    // Not a workspace package.json
  }
  return null;
}

// Walks up from startDir until it finds a monorepo root or hits the filesystem
// root. Returns null when the caller is not inside any known workspace.
export function findMonorepoAncestor(startDir: string): MonorepoInfo | null {
  let dir = startDir;
  for (;;) {
    const info = detectMonorepoRoot(dir);
    if (info) return info;
    const parent = dirname(dir);
    if (parent === dir) return null; // filesystem root
    dir = parent;
  }
}

const WORKSPACE_SKIP = new Set([
  'node_modules', '.git', 'dist', 'out', 'build', '.nx', '.angular', '.cache',
]);

// Searches workspaceRoot (up to 2 directory levels deep) for subdirectories
// that contain an angular.json. Stops recursing into a found Angular project.
export function findAngularProjectsInWorkspace(workspaceRoot: string): string[] {
  const found: string[] = [];

  function search(dir: string, depth: number): void {
    if (depth > 2) return;
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || WORKSPACE_SKIP.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      const child = join(dir, entry.name);
      if (existsSync(join(child, 'angular.json'))) {
        found.push(child);
        // Don't recurse further inside an Angular project
      } else {
        search(child, depth + 1);
      }
    }
  }

  search(workspaceRoot, 0);
  return found;
}

// Hard guard used by commands that need an Angular project to do anything
// useful (add/update/remove/diff/list --installed/init) — prints the same
// error shape and exits. `hint` overrides the default second line for
// commands that want to point at a specific next step (e.g. `sanring init`).
export function requireAngularProject(
  cwd: string,
  hint = 'Run from the root of an Angular project.',
): void {
  if (isAngularProject(cwd)) return;
  console.error(pc.red('✖ No angular.json found.'));
  console.error(pc.dim(`  ${hint}`));
  process.exit(1);
}

// Resolves the component install path the same way every command does:
// explicit --path flag > sanring.config.json > the library default.
export function resolveComponentPath(
  optionsPath: string | undefined,
  config: SanringConfig | null,
): string {
  return optionsPath ?? config?.componentPath ?? DEFAULT_COMPONENT_PATH;
}

export function resolveComponentBasePath(
  cwd: string,
  optionsPath: string | undefined,
  config: SanringConfig | null,
): string {
  return resolve(cwd, resolveComponentPath(optionsPath, config));
}

export interface ConfirmPromptOptions {
  yes: boolean;
  question: string;
  // Printed instead of silently refusing when stdin isn't a TTY (so scripted/
  // CI invocations get a next step instead of a silent no-op). Omit for
  // prompts where silently declining is the right non-interactive default.
  nonTtyRefusal?: { title: string; hint: string };
}

// Shared y/N confirmation prompt — `add`, `update`, and `remove` each used to
// hand-roll this (create readline interface, ask, parse y/yes) with slightly
// different non-TTY handling; this keeps that behavior configurable per call
// site instead of triplicated.
export async function confirmPrompt(options: ConfirmPromptOptions): Promise<boolean> {
  if (options.yes) return true;

  if (!process.stdin.isTTY) {
    if (options.nonTtyRefusal) {
      console.error(pc.red(`\n✖ ${options.nonTtyRefusal.title}`));
      console.error(pc.dim(`  ${options.nonTtyRefusal.hint}\n`));
    }
    return false;
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(options.question);
  rl.close();

  const normalized = answer.trim().toLowerCase();
  return normalized === 'y' || normalized === 'yes';
}

export async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const concurrency = Math.max(1, Math.min(limit, items.length));
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => runWorker()));
  return results;
}

export type TextFetchResult<T extends { remotePath: string }> =
  | (T & { ok: true; content: string })
  | (T & { ok: false; error: unknown });

export function fetchTextTargetsConcurrent<T extends { remotePath: string }>(
  targets: T[],
  limit: number,
  fetcher: (remotePath: string) => Promise<string>,
): Promise<TextFetchResult<T>[]> {
  return mapConcurrent(targets, limit, async (target) => {
    try {
      return { ...target, ok: true, content: await fetcher(target.remotePath) };
    } catch (error) {
      return { ...target, ok: false, error };
    }
  });
}
