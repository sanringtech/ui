import { Component, inject } from '@angular/core';
import { LucideBadgeCheck, LucideMoveUpRight } from '@lucide/angular';
import { BadgeDirective } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { badgePage, badgePageExamples } from './badge.docs';

@Component({
  selector: 'app-badge-page',
  imports: [
    ComponentPageApiTableComponent,
    BadgeDirective,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageSectionComponent,
    LucideBadgeCheck,
    LucideMoveUpRight,
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
            <span sanringBadge>{{ i18n.t('badge.demo.default') }}</span>
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
          <app-component-page-section [section]="section('example-variants')">
            <app-component-page-code-previewer [code]="examples.variants" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <span sanringBadge>{{ i18n.t('badge.demo.default') }}</span>
                <span sanringBadge variant="secondary">
                  {{ i18n.t('badge.demo.secondary') }}
                </span>
                <span sanringBadge variant="outline">{{ i18n.t('badge.demo.outline') }}</span>
                <span sanringBadge variant="ghost">{{ i18n.t('badge.demo.ghost') }}</span>
                <span sanringBadge variant="destructive">
                  {{ i18n.t('badge.demo.destructive') }}
                </span>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-link')">
            <app-component-page-code-previewer [code]="examples.link" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <a
                  sanringBadge
                  class="transition-transform hover:-translate-y-0.5 hover:border-[var(--docs-fg)] hover:bg-[var(--docs-elevated)]"
                  href="/components/badge"
                  variant="outline"
                >
                  {{ i18n.t('badge.demo.link') }}
                  <svg class="size-3" lucideMoveUpRight></svg>
                </a>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-with-icon')">
            <app-component-page-code-previewer [code]="examples.withIcon" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <span sanringBadge variant="outline">
                  <span class="size-2 shrink-0 rounded-full bg-green-500"></span>
                  {{ i18n.t('badge.demo.running') }}
                </span>
                <span sanringBadge variant="secondary">
                  <svg class="size-3" lucideBadgeCheck></svg>
                  {{ i18n.t('badge.demo.verified') }}
                </span>
                <span sanringBadge variant="outline">
                  {{ i18n.t('badge.demo.synced') }}
                  <svg class="size-3" lucideBadgeCheck></svg>
                </span>
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
export class BadgePageComponent {
  protected readonly page = badgePage;
  protected readonly examples = badgePageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
