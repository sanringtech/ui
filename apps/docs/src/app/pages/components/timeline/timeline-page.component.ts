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

      <!-- Basic Vertical Timeline -->
      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <ul previewer sanringTimeline class="w-full max-w-3xl px-4 py-6">
            @for (event of events; track event.titleKey; let last = $last) {
              <li sanringTimelineItem class="relative flex gap-6">
                <span sanringTimelineSeparator class="relative flex flex-col items-center">
                  <span
                    class="relative z-10 grid size-10 place-items-center rounded-full border border-[var(--docs-border-strong)] bg-[var(--docs-surface)] shadow-sm"
                  >
                    <span [class]="event.dotClass"></span>
                  </span>
                  @if (!last) {
                    <!-- 自動延伸的連接線 -->
                    <span
                      class="absolute bottom-[-1.5rem] left-1/2 top-10 w-px -translate-x-1/2 bg-[var(--docs-border-strong)] opacity-60"
                    ></span>
                  }
                </span>
                <div sanringTimelineContent class="flex-1 pb-10">
                  <article
                    class="group min-h-[5rem] rounded-xl border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
                    >
                      <div class="min-w-0 flex-1">
                        <p
                          class="m-0 text-base font-semibold text-[var(--docs-fg)] group-hover:text-[var(--docs-accent-strong)] transition-colors"
                        >
                          {{ i18n.t(event.titleKey) }}
                        </p>
                        <p class="m-0 mt-1.5 text-sm leading-relaxed text-[var(--docs-muted)]">
                          {{ i18n.t(event.descriptionKey) }}
                        </p>
                      </div>
                      <span
                        class="shrink-0 rounded-full border border-[var(--docs-border)] bg-[var(--docs-surface)] px-3 py-1.5 text-xs font-medium tracking-wide text-[var(--docs-muted)] shadow-sm"
                      >
                        {{ i18n.t(event.metaKey) }}
                      </span>
                    </div>
                  </article>
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
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)] shadow-sm"
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
        <div class="grid gap-8">
          <!-- Horizontal Timeline -->
          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <div previewer class="w-full max-w-4xl overflow-x-auto px-4 py-8">
                <ul sanringTimeline orientation="horizontal" class="flex min-w-[720px] gap-4">
                  @for (event of compactEvents; track event.titleKey; let last = $last) {
                    <li sanringTimelineItem class="relative flex min-w-0 flex-1 flex-col gap-5">
                      <span sanringTimelineSeparator class="relative flex w-full justify-center">
                        @if (!$first) {
                          <span
                            class="absolute left-0 right-1/2 top-1/2 h-px -translate-y-1/2 bg-[var(--docs-border-strong)] opacity-60"
                          ></span>
                        }
                        @if (!last) {
                          <span
                            class="absolute left-1/2 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--docs-border-strong)] opacity-60"
                          ></span>
                        }
                        <span
                          class="relative z-10 grid size-10 place-items-center rounded-full border-2 border-[var(--docs-border-strong)] bg-[var(--docs-panel)] text-sm font-bold text-[var(--docs-fg)] shadow-sm"
                        >
                          {{ $index + 1 }}
                        </span>
                      </span>
                      <div sanringTimelineContent>
                        <article
                          class="flex min-h-[7rem] flex-col justify-center rounded-xl border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                          <p class="m-0 text-sm font-bold text-[var(--docs-fg)]">
                            {{ i18n.t(event.titleKey) }}
                          </p>
                          <p class="m-0 mt-2 text-xs leading-relaxed text-[var(--docs-muted)]">
                            {{ i18n.t(event.descriptionKey) }}
                          </p>
                        </article>
                      </div>
                    </li>
                  }
                </ul>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Div-based Feed -->
          <app-component-page-section [section]="section('example-div')">
            <app-component-page-code-previewer [code]="examples.divBased" language="angular-html">
              <div previewer class="w-full max-w-2xl py-4">
                <div
                  sanringTimeline
                  class="flex flex-col overflow-hidden rounded-xl border border-[var(--docs-border)] bg-[var(--docs-panel)] shadow-sm"
                >
                  @for (item of feedItems; track item.titleKey; let last = $last) {
                    <div
                      sanringTimelineItem
                      class="group relative flex items-start gap-5 p-5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      [class.border-b]="!last"
                      [class.border-[var(--docs-border)]]="!last"
                    >
                      <span
                        sanringTimelineSeparator
                        class="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--docs-border)] bg-[var(--docs-surface)] text-sm font-bold text-[var(--docs-fg)] shadow-sm"
                      >
                        {{ item.initials }}
                      </span>
                      <div sanringTimelineContent class="flex-1 pt-0.5">
                        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                            {{ i18n.t(item.titleKey) }}
                          </p>
                          <span class="text-xs font-medium text-[var(--docs-muted)]">
                            {{ i18n.t(item.metaKey) }}
                          </span>
                        </div>
                        <p class="m-0 mt-1.5 text-sm leading-relaxed text-[var(--docs-muted)]">
                          {{ i18n.t(item.descriptionKey) }}
                        </p>
                      </div>
                    </div>
                  }
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
      metaKey: 'timeline.demo.createdMeta',
      dotClass: 'size-3.5 rounded-full bg-[var(--docs-accent-strong)] shadow-sm', // 稍微調大一點點並加陰影
    },
    {
      titleKey: 'timeline.demo.reviewed',
      descriptionKey: 'timeline.demo.reviewedDescription',
      metaKey: 'timeline.demo.reviewedMeta',
      dotClass: 'size-3.5 rounded-full bg-emerald-400 shadow-sm',
    },
    {
      titleKey: 'timeline.demo.shipped',
      descriptionKey: 'timeline.demo.shippedDescription',
      metaKey: 'timeline.demo.shippedMeta',
      dotClass: 'size-3.5 rounded-full bg-amber-400 shadow-sm',
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
