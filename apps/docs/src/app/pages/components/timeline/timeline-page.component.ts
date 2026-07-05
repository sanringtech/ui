import { Component, inject } from '@angular/core';
import {
  TimelineContentDirective,
  TimelineDirective,
  TimelineItemDirective,
  TimelineSeparatorDirective,
} from '@sanring/ui';
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
import { timelinePage, timelinePageExamples } from './timeline.docs';

@Component({
  selector: 'app-timeline-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    TimelineContentDirective,
    TimelineDirective,
    TimelineItemDirective,
    TimelineSeparatorDirective,
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
          <ul previewer sanringTimeline class="max-w-xl">
            @for (event of events; track event.titleKey; let last = $last) {
              <li sanringTimelineItem>
                <span sanringTimelineSeparator class="pt-1">
                  <span class="size-3 rounded-full bg-[var(--sanring-foreground)]"></span>
                  @if (!last) {
                    <span class="mt-2 h-full min-h-12 w-px bg-[var(--sanring-border-strong)]"></span>
                  }
                </span>
                <div sanringTimelineContent class="pb-1">
                  <p class="font-medium text-[var(--docs-foreground)]">
                    {{ i18n.t(event.titleKey) }}
                  </p>
                  <p class="mt-1 text-sm text-[var(--docs-foreground-muted)]">
                    {{ i18n.t(event.descriptionKey) }}
                  </p>
                </div>
              </li>
            }
          </ul>
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
          componentName="timeline"
          manualSnippet="import { TimelineDirective } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <ul
                previewer
                sanringTimeline
                orientation="horizontal"
                class="w-full max-w-2xl overflow-x-auto pb-2"
              >
                @for (event of compactEvents; track event.titleKey; let last = $last) {
                  <li sanringTimelineItem class="min-w-36">
                    <span sanringTimelineSeparator class="w-full">
                      <span class="size-3 rounded-full bg-[var(--sanring-foreground)]"></span>
                      @if (!last) {
                        <span class="ml-2 h-px min-w-16 flex-1 bg-[var(--sanring-border-strong)]"></span>
                      }
                    </span>
                    <div sanringTimelineContent>
                      <p class="text-sm font-medium text-[var(--docs-foreground)]">
                        {{ i18n.t(event.titleKey) }}
                      </p>
                    </div>
                  </li>
                }
              </ul>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-div')">
            <app-component-page-code-previewer [code]="examples.divBased" language="angular-html">
              <div previewer sanringTimeline class="max-w-xl">
                <div sanringTimelineItem>
                  <div sanringTimelineContent class="rounded-md border border-[var(--docs-border)] p-4">
                    <p class="font-medium text-[var(--docs-foreground)]">
                      {{ i18n.t('timeline.demo.divTitle') }}
                    </p>
                    <p class="mt-1 text-sm text-[var(--docs-foreground-muted)]">
                      {{ i18n.t('timeline.demo.divDescription') }}
                    </p>
                  </div>
                </div>
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
export class TimelinePageComponent {
  protected readonly page = timelinePage;
  protected readonly examples = timelinePageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly events = [
    {
      titleKey: 'timeline.demo.created',
      descriptionKey: 'timeline.demo.createdDescription',
    },
    {
      titleKey: 'timeline.demo.reviewed',
      descriptionKey: 'timeline.demo.reviewedDescription',
    },
    {
      titleKey: 'timeline.demo.shipped',
      descriptionKey: 'timeline.demo.shippedDescription',
    },
  ] as const;

  protected readonly compactEvents = [
    { titleKey: 'timeline.demo.plan' },
    { titleKey: 'timeline.demo.build' },
    { titleKey: 'timeline.demo.release' },
  ] as const;

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
