import { Component, inject, signal } from '@angular/core';
import { LucideGripVertical } from '@lucide/angular';
import {
  SANRING_AVATAR_IMPORTS,
  SANRING_CARD_IMPORTS,
  SANRING_SORTABLE_IMPORTS,
  SANRING_TIMELINE_IMPORTS,
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

interface TimelineReorderEvent {
  id: string;
  titleKey: 'timeline.demo.created' | 'timeline.demo.reviewed' | 'timeline.demo.shipped';
  descriptionKey:
    | 'timeline.demo.createdDescription'
    | 'timeline.demo.reviewedDescription'
    | 'timeline.demo.shippedDescription';
  metaKey: 'timeline.demo.createdMeta' | 'timeline.demo.reviewedMeta' | 'timeline.demo.shippedMeta';
}

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
    LucideGripVertical,
    SANRING_AVATAR_IMPORTS,
    SANRING_CARD_IMPORTS,
    SANRING_SORTABLE_IMPORTS,
    SANRING_TIMELINE_IMPORTS,
  ],
  template: `
    <app-component-page [sections]="page.sections" [componentId]="page.componentId">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
        [registryDeps]="page.registryDeps"
        [ssrSafe]="page.ssrSafe"
        [hasAccessibilityNotes]="true"
        [hasKeyboardSupport]="false"
        [stateModelLabel]="i18n.t('component.header.stateless')"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <ul previewer sanringTimeline class="w-full max-w-md">
            @for (event of events; track event.titleKey) {
              <li sanringTimelineItem>
                <span sanringTimelineSeparator></span>
                <div sanringTimelineContent>
                  <div class="flex items-baseline justify-between gap-4">
                    <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t(event.titleKey) }}
                    </p>
                    <time class="shrink-0 text-xs tabular-nums text-[var(--docs-muted)]">
                      {{ i18n.t(event.metaKey) }}
                    </time>
                  </div>
                  <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">
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
          <app-component-page-usage-imports
            [code]="examples.usageImport"
            [individualCode]="examples.usageIndividualImports"
          />
          <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="timeline"
          manualSnippet="import { SANRING_TIMELINE_IMPORTS } from './components/ui/timeline';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-8">
          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <div previewer class="w-full overflow-x-auto">
                <ul sanringTimeline orientation="horizontal" class="min-w-[28rem]">
                  @for (event of compactEvents; track event.titleKey) {
                    <li sanringTimelineItem>
                      <span sanringTimelineSeparator></span>
                      <div sanringTimelineContent class="px-1 text-center">
                        <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                          {{ i18n.t(event.titleKey) }}
                        </p>
                        <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">
                          {{ i18n.t(event.descriptionKey) }}
                        </p>
                      </div>
                    </li>
                  }
                </ul>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-div')">
            <app-component-page-code-previewer [code]="examples.divBased" language="angular-html">
              <div previewer class="w-full max-w-lg">
                <sanring-card class="p-5">
                  <div sanringTimeline>
                    @for (item of feedItems; track item.titleKey) {
                      <div sanringTimelineItem>
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
                          <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">
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

          <app-component-page-section [section]="section('example-reorder')">
            <app-component-page-code-previewer [code]="examples.reorder" language="angular-html">
              <div previewer class="w-full max-w-md">
                <sanring-sortable
                  class="gap-0"
                  [data]="reorderable()"
                  (sorted)="onReordered($event)"
                >
                  @for (event of reorderable(); track event.id) {
                    <div sanringTimelineItem sanringSortableItem>
                      <span sanringTimelineSeparator></span>
                      <div sanringTimelineContent class="flex items-start gap-3">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-baseline justify-between gap-4">
                            <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                              {{ i18n.t(event.titleKey) }}
                            </p>
                            <time class="shrink-0 text-xs tabular-nums text-[var(--docs-muted)]">
                              {{ i18n.t(event.metaKey) }}
                            </time>
                          </div>
                          <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">
                            {{ i18n.t(event.descriptionKey) }}
                          </p>
                        </div>
                        <button
                          sanringSortableHandle
                          type="button"
                          class="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sanring-radius-sm)] text-[var(--docs-muted)]"
                          [attr.aria-label]="i18n.t('sortable.demo.reorder')"
                        >
                          <svg lucideGripVertical class="size-4" aria-hidden="true"></svg>
                        </button>
                      </div>
                    </div>
                  }
                </sanring-sortable>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('accessibility')" />

      <app-component-page-section [section]="section('stateModel')" />
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
    },
    {
      titleKey: 'timeline.demo.reviewed',
      descriptionKey: 'timeline.demo.reviewedDescription',
      metaKey: 'timeline.demo.reviewedMeta',
    },
    {
      titleKey: 'timeline.demo.shipped',
      descriptionKey: 'timeline.demo.shippedDescription',
      metaKey: 'timeline.demo.shippedMeta',
    },
  ] as const;

  protected readonly reorderable = signal<TimelineReorderEvent[]>([
    {
      id: 'created',
      titleKey: 'timeline.demo.created',
      descriptionKey: 'timeline.demo.createdDescription',
      metaKey: 'timeline.demo.createdMeta',
    },
    {
      id: 'reviewed',
      titleKey: 'timeline.demo.reviewed',
      descriptionKey: 'timeline.demo.reviewedDescription',
      metaKey: 'timeline.demo.reviewedMeta',
    },
    {
      id: 'shipped',
      titleKey: 'timeline.demo.shipped',
      descriptionKey: 'timeline.demo.shippedDescription',
      metaKey: 'timeline.demo.shippedMeta',
    },
  ]);

  protected onReordered(items: unknown[]): void {
    this.reorderable.set(items as TimelineReorderEvent[]);
  }

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
