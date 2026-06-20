import { Component, inject } from '@angular/core';
import { LucideAlertTriangle, LucideInfo, LucideLightbulb } from '@lucide/angular';
import {
  AlertComponent,
  AlertDescriptionDirective,
  AlertTitleDirective,
  CardComponent,
  CardContentComponent,
  CardDescriptionDirective,
  CardHeaderComponent,
  CardTitleDirective,
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { alertPage, alertPageExamples } from './alert.docs';

@Component({
  selector: 'app-alert-page',
  imports: [
    AlertComponent,
    AlertDescriptionDirective,
    AlertTitleDirective,
    CardComponent,
    CardContentComponent,
    CardDescriptionDirective,
    CardHeaderComponent,
    CardTitleDirective,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageSectionComponent,
    LucideAlertTriangle,
    LucideInfo,
    LucideLightbulb,
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
            <sanring-alert>
              <svg lucideInfo class="size-4"></svg>
              <h5 sanringAlertTitle>系統維護通知</h5>
              <p sanringAlertDescription>
                系統將於本週日凌晨 02:00 進行升級，屆時將暫停服務 30 分鐘。
              </p>
            </sanring-alert>
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
          <app-component-page-section [section]="section('example-banner')">
            <app-component-page-code-previewer [code]="examples.banner" language="angular-html">
              <div previewer class="w-full overflow-hidden rounded-lg border border-[var(--docs-border)]">
                <sanring-alert class="mb-0 rounded-none border-x-0 border-t-0">
                  <svg lucideInfo class="size-4"></svg>
                  <h5 sanringAlertTitle>系統維護通知</h5>
                  <p sanringAlertDescription>
                    系統將於本週日凌晨 02:00 進行升級，屆時將暫停服務 30 分鐘。
                  </p>
                </sanring-alert>
                <div class="p-5 text-sm text-[var(--docs-muted)]">Dashboard content</div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-destructive')">
            <app-component-page-code-previewer [code]="examples.destructive" language="angular-html">
              <div previewer class="w-full">
                <sanring-card>
                  <sanring-card-header>
                    <h3 sanringCardTitle>刪除 API 金鑰</h3>
                    <p sanringCardDescription>此操作將立即影響正在使用中的應用程式。</p>
                  </sanring-card-header>
                  <sanring-card-content class="space-y-4">
                    <sanring-alert variant="destructive">
                      <svg lucideAlertTriangle class="size-4"></svg>
                      <h5 sanringAlertTitle>危險操作</h5>
                      <p sanringAlertDescription>
                        刪除此金鑰將導致正在使用此金鑰的應用程式立刻失效，請再三確認。
                      </p>
                    </sanring-alert>
                  </sanring-card-content>
                </sanring-card>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-empty')">
            <app-component-page-code-previewer [code]="examples.empty" language="angular-html">
              <div previewer class="w-full">
                <sanring-alert>
                  <svg lucideLightbulb class="size-4"></svg>
                  <h5 sanringAlertTitle>尚無 API 金鑰</h5>
                  <p sanringAlertDescription>
                    您尚未建立任何金鑰。請點擊右上方「建立金鑰」開始串接您的應用服務。
                  </p>
                </sanring-alert>
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
                  {{ i18n.t('alert.api.class.description') }}
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">variant</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">AlertVariant</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">'default'</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('alert.api.variant.description') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class AlertPageComponent {
  protected readonly page = alertPage;
  protected readonly examples = alertPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
