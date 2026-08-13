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
        <div
          class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.schema" language="json" />
        </div>
      </app-component-page-section>

      <!-- 3. Project structure -->
      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.structure.body') }}
        </p>
        <div
          class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.structure" language="bash" />
        </div>
      </app-component-page-section>

      <!-- 4. sanring build -->
      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.build.body') }}
        </p>
        <div
          class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.build" language="bash" />
        </div>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">--source &lt;dir&gt;</code>
            &mdash; root directory containing your components/ and shared/ folders
            (default: <code [class]="inlineCodeClass">.</code>)
          </li>
          <li>
            <code [class]="inlineCodeClass">--out &lt;file&gt;</code>
            &mdash; output path for registry.json
            (default: <code [class]="inlineCodeClass">registry.json</code>)
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
        <div
          class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.hosting" language="bash" />
        </div>
      </app-component-page-section>

      <!-- 6. Using your registry -->
      <app-component-page-section [section]="sections[5]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('registry.consuming.body') }}
        </p>
        <div
          class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.config" language="json" />
        </div>
        <div
          class="mt-4 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.consuming" language="bash" />
        </div>
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
