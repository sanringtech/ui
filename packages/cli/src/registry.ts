import { existsSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'picocolors';

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

const REGISTRY_BASE = 'https://raw.githubusercontent.com/sanringtech/ui/main/registry';

export const REGISTRY_URL = `${REGISTRY_BASE}/registry.json`;

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

export async function fetchRegistry(registryUrl = REGISTRY_URL): Promise<Registry> {
  try {
    const res = await fetch(registryUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Registry;
  } catch (e) {
    console.error(pc.red(`✖ Cannot fetch registry: ${registryUrl}`));
    console.error(pc.dim(`  ${e instanceof Error ? e.message : String(e)}`));
    process.exit(1);
  }
}

export async function fetchFile(relativePath: string, registryUrl: string): Promise<string> {
  const base = registryUrl.replace('/registry.json', '');
  const url = `${base}/${relativePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}
