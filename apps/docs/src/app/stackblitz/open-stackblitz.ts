import sdk from '@stackblitz/sdk';

interface RegistryShared {
  name: string;
  file: string;
  peerDependencies?: Record<string, string>;
}

interface RegistryComponent {
  name: string;
  files: string[];
  sharedDeps?: string[];
  componentDeps?: string[];
  peerDependencies?: Record<string, string>;
}

interface Registry {
  shared: RegistryShared[];
  components: RegistryComponent[];
  blocks?: RegistryComponent[];
}

const REGISTRY_BASE = '/registry';

function collectInstallSet(name: string, registry: Registry): RegistryComponent[] {
  const byName = new Map([
    ...registry.components.map((item) => [item.name, item] as const),
    ...(registry.blocks ?? []).map((item) => [item.name, item] as const),
  ]);
  const seen = new Set<string>();
  const queue = [name];
  const items: RegistryComponent[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (seen.has(current)) continue;
    seen.add(current);
    const item = byName.get(current);
    if (!item) continue;
    items.push(item);
    for (const dep of item.componentDeps ?? []) queue.push(dep);
  }
  return items;
}

async function fetchText(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${path}`);
  return response.text();
}

function projectFiles(options: {
  componentId: string;
  example: string;
  items: RegistryComponent[];
  shared: RegistryShared[];
  sources: Record<string, string>;
  theme: string;
}): Record<string, string> {
  const files: Record<string, string> = {};
  const peerDependencies: Record<string, string> = {
    '@angular/common': '^22.0.0',
    '@angular/compiler': '^22.0.0',
    '@angular/core': '^22.0.0',
    '@angular/forms': '^22.0.0',
    '@angular/platform-browser': '^22.0.0',
    '@angular/router': '^22.0.0',
    '@angular/cdk': '^22.0.0',
    '@angular/aria': '^22.0.0',
    '@lucide/angular': '^1.18.0',
    clsx: '^2.1.1',
    'tailwind-merge': '^3.6.0',
    rxjs: '~7.8.0',
    tslib: '^2.3.0',
  };

  for (const item of options.items) {
    for (const file of item.files) {
      const sourcePath = options.sources[`components/${file}`]
        ? `components/${file}`
        : `blocks/${file}`;
      files[`src/app/components/ui/${file}`] = options.sources[sourcePath];
    }
    Object.assign(peerDependencies, item.peerDependencies);
    for (const depName of item.sharedDeps ?? []) {
      const shared = options.shared.find((entry) => entry.name === depName);
      if (!shared) continue;
      Object.assign(peerDependencies, shared.peerDependencies);
      const fileName = shared.file.replace(/^shared\//, '');
      files[`src/app/components/ui/shared/${fileName}`] = options.sources[shared.file];
    }
  }

  files['src/app/components/ui/shared/theme.css'] = options.theme;
  files['src/sanring-theme.css'] = options.theme;
  files['src/app/app.ts'] = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Sanring from './components/ui/${options.componentId}';

const sanringImports = Object.values(Sanring).filter((value) => typeof value === 'function');

@Component({
  selector: 'app-root',
  imports: [FormsModule, ...sanringImports],
  template: \`
    <div class="min-h-svh bg-[var(--sanring-background)] p-8 text-[var(--sanring-foreground)]">
${options.example}
    </div>
  \`,
})
export class App {}
`;
  files['src/main.ts'] = `import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

bootstrapApplication(App).catch((error) => console.error(error));
`;
  files['src/index.html'] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sanring ${options.componentId}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`;
  files['src/styles.css'] = `@import "tailwindcss";
@import "./sanring-theme.css";
`;
  files['tsconfig.json'] = JSON.stringify(
    {
      compileOnSave: false,
      compilerOptions: {
        strict: true,
        skipLibCheck: true,
        isolatedModules: true,
        module: 'preserve',
        target: 'ES2022',
        experimentalDecorators: true,
      },
    },
    null,
    2,
  );
  files['tsconfig.app.json'] = JSON.stringify(
    {
      extends: './tsconfig.json',
      compilerOptions: { outDir: './out-tsc/app', types: [] },
      files: ['src/main.ts'],
    },
    null,
    2,
  );
  files['angular.json'] = JSON.stringify(
    {
      version: 1,
      projects: {
        demo: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                browser: 'src/main.ts',
                tsConfig: 'tsconfig.app.json',
                styles: ['src/styles.css'],
              },
            },
            serve: {
              builder: '@angular/build:dev-server',
              defaultConfiguration: 'development',
              options: { buildTarget: 'demo:build' },
            },
          },
        },
      },
    },
    null,
    2,
  );
  files['postcss.config.mjs'] = `export default { plugins: { '@tailwindcss/postcss': {} } };\n`;
  files['package.json'] = JSON.stringify(
    {
      name: `sanring-${options.componentId}`,
      private: true,
      scripts: { start: 'ng serve --host 0.0.0.0' },
      dependencies: peerDependencies,
      devDependencies: {
        '@angular/build': '^22.0.1',
        '@angular/cli': '^22.0.1',
        '@angular/compiler-cli': '^22.0.0',
        '@tailwindcss/postcss': '^4.3.1',
        postcss: '^8.5.15',
        tailwindcss: '^4.3.1',
        typescript: '~6.0.2',
      },
    },
    null,
    2,
  );

  return files;
}

export async function openComponentInStackBlitz(componentId: string, example: string): Promise<void> {
  const registry = (await (await fetch(`${REGISTRY_BASE}/registry.json`)).json()) as Registry;
  const items = collectInstallSet(componentId, registry);
  if (items.length === 0) throw new Error(`Unknown component: ${componentId}`);

  const sharedNeeded = new Set(items.flatMap((item) => item.sharedDeps ?? []));
  const shared = registry.shared.filter((entry) => sharedNeeded.has(entry.name));
  const sources: Record<string, string> = {};

  await Promise.all([
    ...items.flatMap((item) =>
      item.files.map(async (file) => {
        const componentPath = `${REGISTRY_BASE}/components/${file}`;
        const blockPath = `${REGISTRY_BASE}/blocks/${file}`;
        const componentResponse = await fetch(componentPath);
        if (componentResponse.ok) {
          sources[`components/${file}`] = await componentResponse.text();
          return;
        }
        sources[`blocks/${file}`] = await fetchText(blockPath);
      }),
    ),
    ...shared.map(async (entry) => {
      sources[entry.file] = await fetchText(`${REGISTRY_BASE}/${entry.file}`);
    }),
  ]);

  const theme = await fetchText(`${REGISTRY_BASE}/shared/theme.css`);
  const files = projectFiles({ componentId, example, items, shared: registry.shared, sources, theme });

  // StackBlitz WebContainers (`node`) run a real Angular 22 + Tailwind project.
  // Source: https://developer.stackblitz.com/guides/integration/create-with-sdk
  sdk.openProject(
    {
      title: `Sanring ${componentId}`,
      description: `Minimal Angular app with the ${componentId} example from the Sanring docs.`,
      template: 'node',
      files,
    },
    { newWindow: true, openFile: 'src/app/app.ts' },
  );
}
