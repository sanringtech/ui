import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const CONFIG_FILE = 'sanring.config.json';

export interface SanringConfig {
  componentPath: string;
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

export function getInstalledPackages(cwd: string): Set<string> {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return new Set();
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ]);
  } catch {
    return new Set();
  }
}

export function isAngularProject(cwd: string): boolean {
  return existsSync(join(cwd, 'angular.json'));
}
