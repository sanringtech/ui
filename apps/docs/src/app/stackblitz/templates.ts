// StackBlitz's WebContainers npm install runs strict peer-dependency
// resolution first and, per their own docs, only falls back to
// --legacy-peer-deps after that attempt fails — a full extra install pass.
// Declaring it upfront skips the failing first attempt entirely. With every
// @angular/* version now pinned exactly (see packageJson()) this is mostly
// a defensive belt-and-suspenders measure, not the primary fix.
export function npmrc(): string {
  return 'legacy-peer-deps=true\n';
}

export function appComponentTs(
  imports: readonly string[],
  componentImports: readonly string[],
  template: string,
  componentBody = '',
): string {
  return `${imports.join('\n')}
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [${componentImports.join(', ')}],
  template: \`
${indent(template, 4)}
  \`,
})
export class AppComponent {
${indent(componentBody, 2)}
}
`;
}

export function packageJson(): string {
  return JSON.stringify(
    {
      scripts: {
        start: 'ng serve --host 0.0.0.0',
      },
      // Every @angular/* version below is pinned exactly (no ^/~), matching
      // this monorepo's own tested pnpm-lock.yaml versions — Angular's
      // packages are released in lockstep and peer-depend on each other with
      // EXACT version pins internally (e.g. @angular/compiler-cli@22.0.1
      // requires @angular/compiler at exactly 22.0.1, not a range). Loose
      // ranges here let npm resolve mismatched patch versions across the
      // @angular/* family independently, which is slow (npm has to
      // backtrack through peer-dependency conflicts) and can produce a
      // broken/inconsistent install even when it does finish. Exact pins
      // make the resolution trivial and deterministic.
      dependencies: {
        '@angular/common': '22.0.1',
        '@angular/compiler': '22.0.1',
        '@angular/core': '22.0.1',
        '@angular/platform-browser': '22.0.1',
        '@lucide/angular': '1.18.0',
        '@tailwindcss/postcss': '4.3.1',
        tailwindcss: '4.3.1',
        tslib: '2.8.1',
        typescript: '6.0.3',
      },
      devDependencies: {
        '@angular/build': '22.0.1',
        '@angular/cli': '22.0.1',
        '@angular/compiler-cli': '22.0.1',
      },
    },
    null,
    2,
  );
}

export function angularJson(): string {
  return JSON.stringify(
    {
      version: 1,
      projects: {
        app: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                browser: 'src/main.ts',
                index: 'src/index.html',
                styles: ['src/styles.css'],
                tsConfig: 'tsconfig.json',
              },
            },
            serve: {
              builder: '@angular/build:dev-server',
              options: {
                buildTarget: 'app:build',
              },
            },
          },
        },
      },
    },
    null,
    2,
  );
}

export function tsconfigJson(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        experimentalDecorators: true,
        importHelpers: true,
        skipLibCheck: true,
        lib: ['ES2022', 'DOM'],
      },
      angularCompilerOptions: {
        strictTemplates: true,
      },
      files: ['src/main.ts'],
    },
    null,
    2,
  );
}

export function indexHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sanring UI Example</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`;
}

export function mainTs(): string {
  return `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((error) => console.error(error));
`;
}

export function stylesCss(): string {
  return `@import 'tailwindcss';
@import './sanring-theme.css';

@source './app';

html {
  background: var(--sanring-background);
  color: var(--sanring-foreground);
  font-family: var(--sanring-font-sans);
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  background: var(--sanring-background);
  color: var(--sanring-foreground);
}
`;
}

function indent(value: string, spaces: number): string {
  const prefix = ' '.repeat(spaces);
  return value
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
}
