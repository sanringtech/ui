import type { Project } from '@stackblitz/sdk';
import { extractImportedSymbols, inferLucideImports, parseExample, unique } from './example-parser';
import { registryFilesForComponent } from './registry-source';
import {
  angularJson,
  appComponentTs,
  indexHtml,
  mainTs,
  npmrc,
  packageJson,
  stylesCss,
  tsconfigJson,
} from './templates';

export interface SanringStackBlitzConfig {
  componentName: string;
  code: string;
  componentBody?: string;
  imports?: string;
  title?: string;
}

export function createSanringStackBlitzProject(config: SanringStackBlitzConfig): Project {
  const componentName = safeComponentName(config.componentName);
  const parsed = parseExample([config.imports, config.code].filter(Boolean).join('\n\n'));
  const lucideImports = inferLucideImports(parsed.template);
  const imports = unique([...parsed.imports, ...lucideImports]);
  const componentImports = extractImportedSymbols(imports);

  return {
    title: config.title ?? `Sanring UI ${titleCase(componentName)}`,
    description: `Live Sanring UI ${componentName} example generated from the docs.`,
    template: 'node',
    files: {
      '.npmrc': npmrc(),
      'package.json': packageJson(),
      'angular.json': angularJson(),
      'tsconfig.json': tsconfigJson(),
      'src/index.html': indexHtml(),
      'src/main.ts': mainTs(),
      'src/styles.css': stylesCss(),
      'src/app/app.component.ts': appComponentTs(
        imports,
        componentImports,
        parsed.template,
        config.componentBody,
      ),
      ...registryFilesForComponent(componentName),
    },
  };
}

function safeComponentName(value: string): string {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Invalid Sanring component name: ${value}`);
  }

  return value;
}

function titleCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
