export interface StackBlitzRegistryEntry {
  componentName: string;
  files: Record<string, string>;
}

import { generatedStackBlitzRegistryEntries } from './registry-source.generated';

export const stackBlitzRegistryEntries: readonly StackBlitzRegistryEntry[] =
  generatedStackBlitzRegistryEntries;

export function registryFilesForComponent(componentName: string): Record<string, string> {
  const entry = stackBlitzRegistryEntries.find((item) => item.componentName === componentName);
  if (!entry) {
    throw new Error(`No StackBlitz registry source configured for ${componentName}`);
  }

  return entry.files;
}
