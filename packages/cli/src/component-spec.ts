import { fetchFile } from './registry.js';

export interface ComponentSpecApiRow {
  property: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ComponentSpecKeyboardRow {
  keys: string;
  action: string;
}

export interface ComponentSpec {
  name: string;
  title?: string;
  description?: string;
  aliases?: string[];
  anatomy?: string;
  example?: string;
  usageImport?: string;
  api?: ComponentSpecApiRow[];
  keyboard?: ComponentSpecKeyboardRow[];
  accessibility?: string[];
  stateModel?: string[];
}

export type ComponentSpecCatalog = Record<string, ComponentSpec>;

export async function fetchComponentSpecs(source?: string): Promise<ComponentSpecCatalog> {
  try {
    const raw = await fetchFile('specs.json', source);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as ComponentSpecCatalog;
  } catch {
    return {};
  }
}

export function rankRegistryItems<T extends { name: string; description: string }>(
  items: readonly T[],
  query: string,
  specs: ComponentSpecCatalog,
): T[] {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);

  return items
    .map((item) => {
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      const aliases = (specs[item.name]?.aliases ?? []).map((alias) => alias.toLowerCase());
      let score = 0;
      if (name === q) score += 100;
      if (name.startsWith(q)) score += 40;
      if (name.includes(q)) score += 20;
      if (description.includes(q)) score += 8;
      if (aliases.some((alias) => alias === q || alias.includes(q))) score += 50;
      for (const token of tokens) {
        if (name.includes(token)) score += 10;
        if (description.includes(token)) score += 3;
        if (aliases.some((alias) => alias.includes(token))) score += 15;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .map((entry) => entry.item);
}

export function formatComponentSpec(spec: ComponentSpec): string {
  const lines: string[] = [
    `${spec.name}${spec.title && spec.title !== spec.name ? ` — ${spec.title}` : ''}`,
  ];
  if (spec.description) lines.push('', spec.description);
  if (spec.aliases?.length) lines.push('', `Aliases: ${spec.aliases.join(', ')}`);
  if (spec.anatomy) lines.push('', 'Anatomy:', spec.anatomy);
  if (spec.usageImport) lines.push('', 'Import:', spec.usageImport);
  if (spec.example) lines.push('', 'Example:', spec.example);
  if (spec.api?.length) {
    lines.push('', 'API:');
    for (const row of spec.api) {
      lines.push(`  ${row.property}: ${row.type} (default ${row.defaultValue}) — ${row.description}`);
    }
  }
  if (spec.keyboard?.length) {
    lines.push('', 'Keyboard:');
    for (const row of spec.keyboard) {
      lines.push(`  ${row.keys}: ${row.action}`);
    }
  }
  if (spec.accessibility?.length) {
    lines.push('', 'Accessibility:');
    for (const item of spec.accessibility) lines.push(`  - ${item}`);
  }
  if (spec.stateModel?.length) {
    lines.push('', 'State model:');
    for (const item of spec.stateModel) lines.push(`  - ${item}`);
  }
  lines.push(
    '',
    'Use only the selectors, inputs, and nesting shown above. Do not invent APIs.',
  );
  return lines.join('\n');
}
