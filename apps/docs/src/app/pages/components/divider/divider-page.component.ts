import { Component, inject } from '@angular/core';
import { DividerComponent } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { dividerPage, dividerPageExamples } from './divider.docs';

@Component({
  selector: 'app-divider-page',
  imports: [
    ComponentPageApiTableComponent,
    DividerComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
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
          <div previewer class="w-full">
            <sanring-divider />
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="divider"
          manualSnippet="import { DividerComponent } from '@sanring/ui';"
        />
      </app-component-page-section>


      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <div previewer class="w-[min(420px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-5">
                <p class="m-0 text-sm font-semibold">{{ i18n.t('divider.demo.account') }}</p>
                <p class="mb-4 mt-1 text-sm text-[var(--docs-muted)]">
                  {{ i18n.t('divider.demo.profile') }}
                </p>
                <sanring-divider />
                <p class="mb-0 mt-4 text-sm text-[var(--docs-muted)]">
                  {{ i18n.t('divider.demo.billing') }}
                </p>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-inset')">
            <app-component-page-code-previewer [code]="examples.inset" language="angular-html">
              <div previewer class="w-[min(420px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] py-3">
                <div class="flex items-center gap-3 px-5 py-3">
                  <div
                    class="grid size-7 place-items-center rounded-full bg-[var(--docs-elevated)] text-xs font-semibold"
                  >
                    A
                  </div>
                  <span class="text-sm">{{ i18n.t('divider.demo.account') }}</span>
                </div>
                <sanring-divider inset="start" />
                <div class="flex items-center gap-3 px-5 py-3">
                  <div
                    class="grid size-7 place-items-center rounded-full bg-[var(--docs-elevated)] text-xs font-semibold"
                  >
                    B
                  </div>
                  <span class="text-sm">{{ i18n.t('divider.demo.billing') }}</span>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-vertical')">
            <app-component-page-code-previewer [code]="examples.vertical" language="angular-html">
              <div
                previewer
                class="flex h-10 items-center rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-5 text-sm"
              >
                <span>{{ i18n.t('divider.demo.profile') }}</span>
                <sanring-divider class="mx-4" [vertical]="true" />
                <span>{{ i18n.t('divider.demo.billing') }}</span>
                <sanring-divider class="mx-4" [vertical]="true" />
                <span>{{ i18n.t('divider.demo.settings') }}</span>
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
export class DividerPageComponent {
  protected readonly page = dividerPage;
  protected readonly examples = dividerPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
