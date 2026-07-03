import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';

// ---------------------------------------------------------------------------
// Package manager detection
// ---------------------------------------------------------------------------

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export function detectPackageManager(cwd = process.cwd()): PackageManager {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
}

export function installCommand(pm: PackageManager, packages: string[]): string {
  const pkgs = packages.join(' ');
  switch (pm) {
    case 'pnpm': return `pnpm add ${pkgs}`;
    case 'yarn': return `yarn add ${pkgs}`;
    case 'bun':  return `bun add ${pkgs}`;
    default:     return `npm install ${pkgs}`;
  }
}

// ---------------------------------------------------------------------------
// Registry source resolution
//
// Priority (highest → lowest):
//   1. --registry <local-path>   e.g. --registry ./packages/cli/registry
//   2. --registry <https://...>  custom remote
//   3. Local files bundled in this npm package  (default, works offline)
//   4. Version-pinned GitHub fallback            (if local bundle missing)
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));

// Local registry bundled alongside the compiled CLI (dist/ → ../registry/)
const LOCAL_REGISTRY_DIR = join(__dirname, '../registry');
const LOCAL_REGISTRY_JSON = join(LOCAL_REGISTRY_DIR, 'registry.json');

// Changesets tags releases as `<package-name>@<version>` (e.g. `@sanring/cli@0.2.0`),
// not `v<version>` — and the ref must be URL-encoded since it contains `/` and `@`.
function getRemoteRef(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
    return `refs/tags/${encodeURIComponent(`${pkg.name}@${pkg.version}`)}`;
  } catch {
    return 'main';
  }
}

// Version-pinned remote URL — used only when the local bundle is absent
// (e.g. in monorepo dev before the package is built/published). Points at
// the repo-root `registry/` (source of truth), not `packages/cli/registry`,
// since the latter is gitignored and never exists in any git tag.
const REMOTE_BASE =
  `https://raw.githubusercontent.com/sanringtech/ui/${getRemoteRef()}/registry`;

function isUrl(s: string): boolean {
  return s.startsWith('http://') || s.startsWith('https://');
}

function die(message: string, detail?: unknown): never {
  console.error(pc.red(`✖ ${message}`));
  if (detail !== undefined) {
    console.error(pc.dim(`  ${detail instanceof Error ? detail.message : String(detail)}`));
  }
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Registry types
// ---------------------------------------------------------------------------

export interface RegistryShared {
  name: string;
  description: string;
  file: string;
  peerDependencies?: Record<string, string>;
}

export interface RegistryComponent {
  name: string;
  description: string;
  sharedDeps?: string[];
  componentDeps?: string[];
  peerDependencies?: Record<string, string>;
  files: string[];
}

export interface Registry {
  name: string;
  shared: RegistryShared[];
  components: RegistryComponent[];
}

// ---------------------------------------------------------------------------
// fetchRegistry
//   source = undefined          → local bundle → remote fallback
//   source = '/path/to/dir'     → read <dir>/registry.json from disk
//   source = 'https://...'      → HTTP fetch
// ---------------------------------------------------------------------------

export async function fetchRegistry(source?: string): Promise<Registry> {
  // 1. Explicit local path
  if (source && !isUrl(source)) {
    const localJson = join(source, 'registry.json');
    try {
      return JSON.parse(readFileSync(localJson, 'utf-8')) as Registry;
    } catch {
      die(`Cannot read registry at: ${localJson}`);
    }
  }

  // 2. Explicit URL
  if (source && isUrl(source)) {
    return fetchRegistryFromUrl(source);
  }

  // 3. Default: local bundle
  if (existsSync(LOCAL_REGISTRY_JSON)) {
    try {
      return JSON.parse(readFileSync(LOCAL_REGISTRY_JSON, 'utf-8')) as Registry;
    } catch {
      console.warn(pc.yellow('⚠ Local registry unreadable, falling back to network...'));
    }
  }

  // 4. Version-pinned remote fallback
  console.warn(pc.dim(`  Fetching registry from ${REMOTE_BASE}/registry.json`));
  return fetchRegistryFromUrl(`${REMOTE_BASE}/registry.json`);
}

async function fetchRegistryFromUrl(url: string): Promise<Registry> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Registry;
  } catch (e) {
    die(`Cannot fetch registry: ${url}`, e);
  }
}

// ---------------------------------------------------------------------------
// fetchFile
//   source = undefined          → local bundle → remote fallback
//   source = '/path/to/dir'     → read from that dir
//   source = 'https://...'      → HTTP
// ---------------------------------------------------------------------------

export async function fetchFile(relativePath: string, source?: string): Promise<string> {
  // Explicit local path
  if (source && !isUrl(source)) {
    return readFileSync(join(source, relativePath), 'utf-8');
  }

  // Explicit URL
  if (source && isUrl(source)) {
    return fetchFileFromUrl(relativePath, source);
  }

  // Default: local bundle
  const localPath = join(LOCAL_REGISTRY_DIR, relativePath);
  if (existsSync(localPath)) {
    return readFileSync(localPath, 'utf-8');
  }

  // Remote fallback
  return fetchFileFromUrl(relativePath, REMOTE_BASE);
}

async function fetchFileFromUrl(relativePath: string, base: string): Promise<string> {
  const url = `${base.replace(/\/registry\.json$/, '')}/${relativePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}
