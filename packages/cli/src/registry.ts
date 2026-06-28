import pc from 'picocolors';

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
