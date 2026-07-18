import { Component, inject } from '@angular/core';
import {
  BadgeDirective,
  SANRING_AVATAR_IMPORTS,
  SANRING_CARD_IMPORTS,
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
    BadgeDirective,
    SANRING_AVATAR_IMPORTS,
    SANRING_CARD_IMPORTS,
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

      <!-- Basic vertical timeline -->
      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <ul previewer sanringTimeline class="w-full max-w-md">
            @for (event of events; track event.titleKey; let last = $last) {
              <li sanringTimelineItem>
                <span sanringTimelineSeparator>
                  <span
                    class="grid size-6 shrink-0 place-items-center rounded-full border-2 border-[var(--docs-border-strong)] bg-[var(--docs-panel)]"
                  >
                    <span class="size-2 rounded-full" [class]="event.dotClass"></span>
                  </span>
                  @if (!last) {
                    <span class="w-px flex-1 bg-[var(--docs-border)]"></span>
                  }
                </span>
                <div sanringTimelineContent class="pb-6">
                  <sanring-card>
                    <sanring-card-content
                      class="flex items-center justify-between gap-4 p-4"
                    >
                      <div class="min-w-0">
                        <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                          {{ i18n.t(event.titleKey) }}
                        </p>
                        <p class="m-0 mt-0.5 text-sm text-[var(--docs-muted)]">
                          {{ i18n.t(event.descriptionKey) }}
                        </p>
                      </div>
                      <span sanringBadge variant="outline" class="shrink-0">
                        {{ i18n.t(event.metaKey) }}
                      </span>
                    </sanring-card-content>
                  </sanring-card>
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
          manualSnippet="import { TimelineDirective } from './components/ui/timeline';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-8">
          <!-- Horizontal timeline -->
          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <div previewer class="w-full overflow-x-auto">
                <ul sanringTimeline orientation="horizontal" class="min-w-[560px] gap-0">
                  @for (event of compactEvents; track event.titleKey; let last = $last) {
                    <li sanringTimelineItem class="flex-1">
                      <span sanringTimelineSeparator class="w-full">
                        <span
                          class="h-px flex-1 bg-[var(--docs-border)]"
                          [class.invisible]="$first"
                        ></span>
                        <span
                          class="grid size-7 shrink-0 place-items-center rounded-full border-2 border-[var(--docs-border-strong)] bg-[var(--docs-panel)] text-xs font-semibold text-[var(--docs-fg)]"
                        >
                          {{ $index + 1 }}
                        </span>
                        <span
                          class="h-px flex-1 bg-[var(--docs-border)]"
                          [class.invisible]="last"
                        ></span>
                      </span>
                      <div sanringTimelineContent class="px-2 pt-3 text-center">
                        <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                          {{ i18n.t(event.titleKey) }}
                        </p>
                        <p class="m-0 mt-1 text-sm text-[var(--docs-muted)]">
                          {{ i18n.t(event.descriptionKey) }}
                        </p>
                      </div>
                    </li>
                  }
                </ul>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Div-based activity feed -->
          <app-component-page-section [section]="section('example-div')">
            <app-component-page-code-previewer [code]="examples.divBased" language="angular-html">
              <div previewer class="w-full max-w-lg">
                <sanring-card>
                  <div sanringTimeline class="divide-y divide-[var(--docs-border)]">
                    @for (item of feedItems; track item.titleKey) {
                      <div sanringTimelineItem class="items-center p-4">
                        <span sanringTimelineSeparator>
                          <sanring-avatar size="sm">
                            <sanring-avatar-fallback>{{ item.initials }}</sanring-avatar-fallback>
                          </sanring-avatar>
                        </span>
                        <div sanringTimelineContent>
                          <div class="flex flex-wrap items-baseline gap-x-2">
                            <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                              {{ i18n.t(item.titleKey) }}
                            </p>
                            <span class="text-xs text-[var(--docs-muted)]">
                              {{ i18n.t(item.metaKey) }}
                            </span>
                          </div>
                          <p class="m-0 mt-0.5 text-sm text-[var(--docs-muted)]">
                            {{ i18n.t(item.descriptionKey) }}
                          </p>
                        </div>
                      </div>
                    }
                  </div>
                </sanring-card>
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
      metaKey: 'timeline.demo.createdMeta',
      dotClass: 'bg-[var(--docs-accent-strong)]',
    },
    {
      titleKey: 'timeline.demo.reviewed',
      descriptionKey: 'timeline.demo.reviewedDescription',
      metaKey: 'timeline.demo.reviewedMeta',
      dotClass: 'bg-emerald-500',
    },
    {
      titleKey: 'timeline.demo.shipped',
      descriptionKey: 'timeline.demo.shippedDescription',
      metaKey: 'timeline.demo.shippedMeta',
      dotClass: 'bg-amber-500',
    },
  ] as const;

  protected readonly compactEvents = [
    {
      titleKey: 'timeline.demo.plan',
      descriptionKey: 'timeline.demo.planDescription',
    },
    {
      titleKey: 'timeline.demo.build',
      descriptionKey: 'timeline.demo.buildDescription',
    },
    {
      titleKey: 'timeline.demo.release',
      descriptionKey: 'timeline.demo.releaseDescription',
    },
  ] as const;

  protected readonly feedItems = [
    {
      initials: 'UI',
      titleKey: 'timeline.demo.divTitle',
      metaKey: 'timeline.demo.divMeta',
      descriptionKey: 'timeline.demo.divDescription',
    },
    {
      initials: 'QA',
      titleKey: 'timeline.demo.qaTitle',
      metaKey: 'timeline.demo.qaMeta',
      descriptionKey: 'timeline.demo.qaDescription',
    },
  ] as const;

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
