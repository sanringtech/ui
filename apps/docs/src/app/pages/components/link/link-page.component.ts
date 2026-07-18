import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LinkDirective } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { linkPage, linkPageExamples } from './link.docs';

@Component({
  selector: 'app-link-page',
  imports: [
    ComponentPageApiTableComponent,
    LinkDirective,
    RouterLink,
    RouterLinkActive,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex flex-wrap items-center justify-center gap-3">
            <a sanringLink href="#basic">
              {{ i18n.t('link.demo.basic') }}
            </a>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="link"
          manualSnippet="import { LinkDirective } from './components/ui/link';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-external')">
            <app-component-page-code-previewer [code]="examples.external" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <a sanringLink href="https://sanring.dev" target="_blank">
                  {{ i18n.t('link.demo.external') }}
                </a>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-router')">
            <app-component-page-code-previewer [code]="examples.router" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <a sanringLink routerLink="/components/button">
                  {{ i18n.t('component.button') }}
                </a>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-active')">
            <app-component-page-code-previewer [code]="examples.active" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <a
                  sanringLink
                  routerLink="/components/link"
                  routerLinkActive="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-active)] px-2 py-1 no-underline"
                  [routerLinkActiveOptions]="{ exact: true }"
                >
                  {{ i18n.t('link.demo.active') }}
                </a>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-custom')">
            <app-component-page-code-previewer [code]="examples.custom" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <a
                  sanringLink
                  class="text-[var(--docs-muted)] no-underline hover:text-[var(--docs-fg)]"
                  href="https://sanring.dev"
                  target="_blank"
                >
                  {{ i18n.t('link.demo.custom') }}
                </a>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class LinkPageComponent {
  protected readonly page = linkPage;
  protected readonly examples = linkPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
