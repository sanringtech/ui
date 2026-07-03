import { Component, inject } from '@angular/core';
import { TagComponent } from '@sanring/ui';
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
import { tagPage, tagPageExamples } from './tag.docs';

@Component({
  selector: 'app-tag-page',
  imports: [
    ComponentPageApiTableComponent,
    TagComponent,
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
            <sanring-tag>{{ i18n.t('tag.demo.default') }}</sanring-tag>
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
          componentName="tag"
          manualSnippet="import { TagComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-default')">
            <app-component-page-code-previewer
              [code]="examples.defaultVariant"
              language="angular-html"
            >
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <sanring-tag>{{ i18n.t('tag.demo.default') }}</sanring-tag>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-closable')">
            <app-component-page-code-previewer [code]="examples.closable" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <sanring-tag closable>{{ i18n.t('tag.demo.closable') }}</sanring-tag>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-variants')">
            <app-component-page-code-previewer [code]="examples.variants" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <sanring-tag variant="secondary">{{ i18n.t('tag.demo.secondary') }}</sanring-tag>
                <sanring-tag variant="outline">{{ i18n.t('tag.demo.outline') }}</sanring-tag>
                <sanring-tag variant="destructive">
                  {{ i18n.t('tag.demo.destructive') }}
                </sanring-tag>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-list')">
            <app-component-page-code-previewer [code]="examples.list" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-2">
                <sanring-tag closable>{{ i18n.t('tag.demo.frontend') }}</sanring-tag>
                <sanring-tag closable>Angular</sanring-tag>
                <sanring-tag closable>UI/UX</sanring-tag>
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
export class TagPageComponent {
  protected readonly page = tagPage;
  protected readonly examples = tagPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
