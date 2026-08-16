import { Component, effect, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../layouts/component-page';

const INLINE_CODE_CLASS =
  'rounded-[var(--sanring-radius-xs)] bg-[var(--docs-code)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--docs-fg)]';

@Component({
  selector: 'app-registry-page',
  imports: [
    ComponentPageCodeBlock,
    ComponentPageComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.registry')"
        [description]="i18n.t('registry.page.description')"
        eyebrow="docs / registry"
      />

      <section class="mb-4 rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 shadow-[var(--docs-shadow-soft)] sm:p-6" aria-label="Registry model overview">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--docs-border)] pb-5"><div><p class="m-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">REGISTRY MODEL</p><h2 class="m-0 mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--docs-fg)]">One schema, three dependency layers.</h2></div><span class="font-mono text-xs text-[var(--docs-muted)]">registry.json</span></div>
        <div class="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(300px,1.2fr)]">
          <div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-code)] p-4 font-mono text-xs leading-7 text-[var(--docs-code-fg)]"><div class="text-[var(--docs-accent)]">registry.json</div><div class="pl-4 text-[color-mix(in_srgb,var(--docs-code-fg)_76%,transparent)]">├─ components[]</div><div class="pl-8 text-[color-mix(in_srgb,var(--docs-code-fg)_62%,transparent)]">├─ files[]</div><div class="pl-8 text-[color-mix(in_srgb,var(--docs-code-fg)_62%,transparent)]">├─ componentDeps[]</div><div class="pl-8 text-[color-mix(in_srgb,var(--docs-code-fg)_62%,transparent)]">└─ sharedDeps[]</div><div class="pl-4 text-[color-mix(in_srgb,var(--docs-code-fg)_76%,transparent)]">└─ shared[]</div></div>
          <div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"><div class="flex items-center justify-between gap-3"><p class="m-0 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">SOURCE GRAPH</p><span class="font-mono text-[10px] text-[var(--docs-muted)]">resolved locally</span></div><div class="mt-4 grid gap-2 sm:grid-cols-3 sm:items-stretch"><div class="rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_38%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_9%,var(--docs-surface))] p-3"><p class="m-0 font-mono text-[10px] uppercase text-[var(--docs-accent-strong)]">component</p><div class="mt-3 grid gap-2"><div class="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-panel)] px-2.5 py-2 font-mono text-xs text-[var(--docs-fg)]">button.ts</div><div class="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-panel)] px-2.5 py-2 font-mono text-xs text-[var(--docs-fg)]">dialog.ts</div></div></div><div class="relative flex items-center justify-center"><span class="hidden font-mono text-xs text-[var(--docs-accent-strong)] sm:block" aria-hidden="true">→</span><span class="font-mono text-xs text-[var(--docs-accent-strong)] sm:hidden" aria-hidden="true">↓</span></div><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-3"><p class="m-0 font-mono text-[10px] uppercase text-[var(--docs-muted)]">shared</p><div class="mt-3 rounded-[var(--sanring-radius-sm)] bg-[var(--docs-surface)] px-2.5 py-2 font-mono text-xs text-[var(--docs-fg)]">utils.ts</div><div class="mt-2 font-mono text-[10px] text-[var(--docs-muted)]">sharedDeps[]</div></div></div><div class="mt-3 flex items-center gap-3 rounded-[var(--sanring-radius)] border border-dashed border-[color-mix(in_srgb,var(--docs-accent)_42%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_6%,transparent)] p-3"><span class="grid size-7 shrink-0 place-items-center rounded-[var(--sanring-radius-sm)] bg-[var(--docs-accent)] font-mono text-[10px] text-[var(--docs-accent-fg)]">→</span><div><p class="m-0 font-mono text-[10px] uppercase text-[var(--docs-accent-strong)]">block</p><p class="m-0 mt-1 text-sm font-semibold text-[var(--docs-fg)]">account-settings surface</p><p class="m-0 mt-1 text-xs text-[var(--docs-muted)]">the app-owned composition</p></div></div></div>
        </div>
      </section>

      <!-- 1. Overview -->
      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.overview.body') }}
        </p>
      </app-component-page-section>

      <!-- 2. registry.json schema -->
      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.schema.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="examples.schema" language="json" />
      </app-component-page-section>

      <!-- 3. Project structure -->
      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.structure.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="examples.structure" language="bash" />
      </app-component-page-section>

      <!-- 4. sanring build -->
      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.build.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="examples.build" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">--source &lt;dir&gt;</code>
            &mdash; root directory containing your components/ and shared/ folders (default:
            <code [class]="inlineCodeClass">.</code>)
          </li>
          <li>
            <code [class]="inlineCodeClass">--out &lt;file&gt;</code>
            &mdash; output path for registry.json (default:
            <code [class]="inlineCodeClass">registry.json</code>)
          </li>
          <li>
            <code [class]="inlineCodeClass">--name &lt;name&gt;</code>
            &mdash; registry name written into the output file
          </li>
          <li>
            <code [class]="inlineCodeClass">--dry-run</code>
            &mdash; print the generated JSON without writing any files
          </li>
        </ul>
      </app-component-page-section>

      <!-- 5. Hosting -->
      <app-component-page-section [section]="sections[4]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.hosting.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="examples.hosting" language="bash" />
      </app-component-page-section>

      <!-- 6. Using your registry -->
      <app-component-page-section [section]="sections[5]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.consuming.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="examples.config" language="json" />
        <app-component-page-code-block class="mt-4" [code]="examples.consuming" language="bash" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class RegistryPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly inlineCodeClass = INLINE_CODE_CLASS;

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.registry'),
        description: this.i18n.t('registry.page.description'),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'overview', titleKey: 'registry.overview.title' },
    { id: 'schema', titleKey: 'registry.schema.title' },
    { id: 'structure', titleKey: 'registry.structure.title' },
    { id: 'build', titleKey: 'registry.build.title' },
    { id: 'hosting', titleKey: 'registry.hosting.title' },
    { id: 'consuming', titleKey: 'registry.consuming.title' },
  ];

  protected readonly examples = {
    schema: `{
  "components": [
    {
      "name": "my-button",
      "description": "A custom button variant",
      "files": [
        "my-button/my-button.component.ts",
        "my-button/my-button.component.html"
      ],
      "componentDeps": [],
      "sharedDeps": ["utils"],
      "peerDependencies": {
        "@angular/core": "^22.0.0",
        "@angular/cdk": "^22.0.0"
      }
    }
  ],
  "shared": [
    {
      "name": "utils",
      "description": "Shared utility functions",
      "file": "shared/utils.ts",
      "peerDependencies": {}
    }
  ]
}`,
    structure: `my-lib/
├── components/
│   ├── my-button/
│   │   ├── my-button.component.ts
│   │   └── my-button.component.html
│   └── my-card/
│       ├── my-card.component.ts
│       └── my-card.component.html
├── shared/
│   └── utils.ts
├── package.json
└── registry.json          # generated by sanring build`,
    build: `# generate registry.json from ./components and ./shared
npx @sanring/cli@latest build

# specify source root and output path
npx @sanring/cli@latest build --source ./src --out ./dist/registry.json

# preview output without writing any files
npx @sanring/cli@latest build --dry-run`,
    hosting: `# serve locally during development (any static file server)
npx serve .

# or point the CLI directly at a local path — no server needed
npx @sanring/cli@latest add mylib:my-button --registry ./registry.json`,
    config: `{
  "registries": {
    "mylib": "https://your-org.github.io/my-lib/registry.json"
  }
}`,
    consuming: `# install a component from your registry
npx @sanring/cli@latest add mylib:my-button

# works with all CLI commands
npx @sanring/cli@latest info mylib:my-button
npx @sanring/cli@latest diff mylib:my-button
npx @sanring/cli@latest update mylib:my-button`,
  };
}
