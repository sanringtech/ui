export interface ParsedExample {
  imports: string[];
  template: string;
}

export function parseExample(source: string): ParsedExample {
  const imports: string[] = [];
  const templateLines: string[] = [];

  for (const line of source.trim().split('\n')) {
    if (/^\s*import\s.+;?\s*$/.test(line)) {
      imports.push(normalizeImport(line));
    } else {
      templateLines.push(line);
    }
  }

  return {
    imports,
    template: templateLines.join('\n').trim(),
  };
}

export function inferLucideImports(template: string): string[] {
  const directiveNames = Array.from(
    template.matchAll(/\blucide([A-Z][A-Za-z0-9]*)\b/g),
    (match) => match[1],
  );

  if (!directiveNames.length) {
    return [];
  }

  const symbols = unique(directiveNames.map((name) => `Lucide${name}`)).sort();
  return [`import { ${symbols.join(', ')} } from '@lucide/angular';`];
}

export function extractImportedSymbols(imports: readonly string[]): string[] {
  return unique(
    imports.flatMap((line) => {
      const namedMatch = line.match(/import\s+\{([^}]+)\}\s+from/);
      if (!namedMatch) {
        return [];
      }

      return namedMatch[1]
        .split(',')
        .map(
          (name) =>
            name
              .trim()
              .split(/\s+as\s+/)
              .pop() ?? '',
        )
        .filter(Boolean);
    }),
  );
}

export function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function normalizeImport(line: string): string {
  const trimmed = line.trim();
  return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
}
