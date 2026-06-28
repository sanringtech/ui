import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'picocolors';

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
  peerDependencies?: Record<string, string>;
  files: string[];
}

export interface Registry {
  name: string;
  shared: RegistryShared[];
  components: RegistryComponent[];
}

export function getDefaultRegistryPath(importMetaUrl: string): string {
  const selfDir = new URL('.', importMetaUrl).pathname;
  // dist/commands/ → ../../registry/registry.json
  return join(selfDir, '../../registry/registry.json');
}

export function loadRegistry(registryPath: string): Registry {
  try {
    return JSON.parse(readFileSync(registryPath, 'utf-8')) as Registry;
  } catch {
    console.error(pc.red(`✖ Cannot read registry: ${registryPath}`));
    process.exit(1);
  }
}
