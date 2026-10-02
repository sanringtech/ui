import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../layouts/component-page';
import { docsBlockCatalog } from './blocks.catalog';

@Component({
  selector: 'app-blocks-page',
  imports: [
    RouterLink,
    ComponentPageCodeBlock,
    ComponentPageComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.blocks')"
        [description]="i18n.t('blocks.page.description')"
        eyebrow="docs / blocks"
      />

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('blocks.overview.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="installAll" language="bash" />
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
        <nav class="mt-2 grid gap-4 sm:grid-cols-2" [attr.aria-label]="i18n.t('blocks.catalog.title')">
          @for (block of blocks; track block.id) {
            <a
              class="docs-panel block rounded-[var(--sanring-radius-lg)] p-5 no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)]"
              [routerLink]="block.path"
            >
              <h3 class="m-0 text-lg font-semibold text-[var(--docs-fg)]">
                {{ i18n.t(block.titleKey) }}
              </h3>
              <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                {{ i18n.t(block.descriptionKey) }}
              </p>
              <p class="mb-0 mt-3 font-mono text-xs text-[var(--docs-muted)]">
                {{ block.installName }}
              </p>
            </a>
          }
        </nav>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class BlocksPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly blocks = docsBlockCatalog;

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.blocks'),
        description: this.i18n.t('blocks.page.description'),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'overview', titleKey: 'blocks.overview.title' },
    { id: 'catalog', titleKey: 'blocks.catalog.title' },
  ];

  protected readonly installAll = docsBlockCatalog
    .map((block) => `npx @sanring/cli@latest add ${block.installName}`)
    .join('\n');
}
