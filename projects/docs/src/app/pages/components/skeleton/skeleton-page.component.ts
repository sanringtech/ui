import { Component, inject } from '@angular/core';
import { Skeleton } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { skeletonPage, skeletonPageExamples } from './skeleton.docs';

@Component({
  selector: 'app-skeleton-page',
  imports: [
    Skeleton,
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
          <div previewer class="flex w-full justify-center">
            <div class="flex items-center gap-4">
              <div sanringSkeleton class="size-12 rounded-full"></div>
              <div class="grid gap-2">
                <div sanringSkeleton class="h-4 w-[180px]"></div>
                <div sanringSkeleton class="h-4 w-[140px]"></div>
              </div>
            </div>
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
          <app-component-page-section [section]="section('example-avatar')">
            <app-component-page-code-previewer [code]="examples.avatar" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <div class="flex items-center gap-4">
                  <div sanringSkeleton class="size-12 rounded-full"></div>
                  <div class="grid gap-2">
                    <div sanringSkeleton class="h-4 w-[160px]"></div>
                    <div sanringSkeleton class="h-3 w-[120px]"></div>
                  </div>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-card')">
            <app-component-page-code-previewer [code]="examples.card" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <div class="w-[min(360px,100%)] rounded-lg border border-[var(--docs-border)] p-5">
                  <div sanringSkeleton class="h-40 w-full"></div>
                  <div class="mt-4 grid gap-2">
                    <div sanringSkeleton class="h-4 w-3/4"></div>
                    <div sanringSkeleton class="h-4 w-1/2"></div>
                  </div>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-text')">
            <app-component-page-code-previewer [code]="examples.text" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <div class="grid w-[min(420px,100%)] gap-2">
                  <div sanringSkeleton class="h-4 w-full"></div>
                  <div sanringSkeleton class="h-4 w-11/12"></div>
                  <div sanringSkeleton class="h-4 w-2/3"></div>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-form')">
            <app-component-page-code-previewer [code]="examples.form" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <div class="grid w-[min(360px,100%)] gap-4">
                  <div class="grid gap-2">
                    <div sanringSkeleton class="h-4 w-24"></div>
                    <div sanringSkeleton class="h-10 w-full"></div>
                  </div>
                  <div class="grid gap-2">
                    <div sanringSkeleton class="h-4 w-20"></div>
                    <div sanringSkeleton class="h-10 w-full"></div>
                  </div>
                  <div sanringSkeleton class="h-10 w-28"></div>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-table')">
            <app-component-page-code-previewer [code]="examples.table" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <div class="grid w-[min(520px,100%)] gap-3">
                  <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
                    <div sanringSkeleton class="h-4 w-20"></div>
                    <div sanringSkeleton class="h-4 w-16"></div>
                    <div sanringSkeleton class="h-4 w-14"></div>
                  </div>
                  <div class="grid gap-3">
                    <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
                      <div sanringSkeleton class="h-4 w-full"></div>
                      <div sanringSkeleton class="h-4 w-20"></div>
                      <div sanringSkeleton class="h-4 w-16"></div>
                    </div>
                    <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
                      <div sanringSkeleton class="h-4 w-10/12"></div>
                      <div sanringSkeleton class="h-4 w-24"></div>
                      <div sanringSkeleton class="h-4 w-12"></div>
                    </div>
                    <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
                      <div sanringSkeleton class="h-4 w-11/12"></div>
                      <div sanringSkeleton class="h-4 w-16"></div>
                      <div sanringSkeleton class="h-4 w-20"></div>
                    </div>
                  </div>
                </div>
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
              <tr>
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">class</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">string</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">''</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('skeleton.api.class.description') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class SkeletonPageComponent {
  protected readonly page = skeletonPage;
  protected readonly examples = skeletonPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
