import { Component, inject } from '@angular/core';
import { TagComponent } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { tagPage, tagPageExamples } from './tag.docs';

@Component({
  selector: 'app-tag-page',
  imports: [
    TagComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
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
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')" />


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
        <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
          <table class="w-full border-collapse text-left text-sm">
            <thead class="bg-[var(--docs-elevated)] text-[var(--docs-muted)]">
              <tr>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.property') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.type') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.default') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.descriptionLabel') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">class</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">string</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">''</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('tag.api.class.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">variant</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">BadgeVariant</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">'secondary'</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('tag.api.variant.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">closable</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">boolean</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">false</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('tag.api.closable.description') }}
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">remove</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">
                  EventEmitter&lt;MouseEvent&gt;
                </td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">-</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('tag.api.remove.description') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
