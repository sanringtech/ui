import { Component, computed, inject, signal } from '@angular/core';
import { LucideConstruction } from '@lucide/angular';
import { CalendarLocale, DateInterval, DateRange, DisabledInput } from '@sanring/date-picker';
import {
  AlertComponent,
  AlertDescriptionDirective,
  AlertTitleDirective,
  ButtonDirective,
  CalendarComponent,
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
import { calendarPage, calendarPageExamples } from './calendar.docs';

const EN_LOCALE: CalendarLocale = {
  weekStartsOn: 0,
  weekdayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthLabels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

const ZH_LOCALE: CalendarLocale = {
  weekStartsOn: 0,
  weekdayLabels: ['日', '一', '二', '三', '四', '五', '六'],
  monthLabels: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
};

@Component({
  selector: 'app-calendar-page',
  imports: [
    AlertComponent,
    AlertDescriptionDirective,
    AlertTitleDirective,
    ComponentPageApiTableComponent,
    ButtonDirective,
    CalendarComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    LucideConstruction,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <sanring-alert class="mb-8" variant="destructive">
        <svg lucideConstruction class="size-4"></svg>
        <h5 sanringAlertTitle>{{ i18n.t('status.maintenance.title') }}</h5>
        <p sanringAlertDescription>{{ i18n.t('status.maintenance.description') }}</p>
      </sanring-alert>

      <div class="maintenance-tape">
        <app-component-page-section [section]="section('basic')">
          <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
            <div previewer class="flex w-full flex-col items-center gap-3">
              <sanring-calendar
                [locale]="calendarLocale()"
                (selectedDateChange)="basicSelected = $event"
              />
              <span class="text-sm text-[var(--docs-muted)]">
                {{ singleSelectionText(basicSelected) }}
              </span>
            </div>
          </app-component-page-code-previewer>
        </app-component-page-section>
      </div>

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
          componentName="calendar"
          manualSnippet="import { CalendarComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <div class="maintenance-tape">
        <app-component-page-section [section]="section('example')">
        <div class="mb-4 flex justify-center">
          <button
            sanringBtn
            type="button"
            [variant]="showInfoBlock() ? 'default' : 'outline'"
            (click)="showInfoBlock.set(!showInfoBlock())"
          >
            {{
              showInfoBlock()
                ? i18n.t('calendar.demo.infoBlockSeparate')
                : i18n.t('calendar.demo.infoBlockInline')
            }}
          </button>
        </div>

        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-basic')">
            <app-component-page-code-previewer
              [code]="examples.scenarioBasic"
              language="angular-html"
            >
              <div previewer class="flex w-full flex-col items-center gap-3">
                <div
                  class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                >
                  <sanring-calendar
                    #basicCal="sanringCalendar"
                    [locale]="calendarLocale()"
                    (selectedDateChange)="basicScenarioSelected = $event"
                  />
                  @if (!showInfoBlock()) {
                    <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                      <span class="text-[var(--docs-muted)]">{{
                        singleSelectionText(basicScenarioSelected)
                      }}</span>
                      <button
                        sanringBtn
                        variant="outline"
                        size="sm"
                        type="button"
                        (click)="basicCal.clear()"
                      >
                        {{ i18n.t('calendar.demo.clear') }}
                      </button>
                    </div>
                  }
                </div>
                @if (showInfoBlock()) {
                  <div
                    class="flex w-full max-w-[20rem] items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-2 text-sm"
                  >
                    <span class="text-[var(--docs-muted)]">{{
                      singleSelectionText(basicScenarioSelected)
                    }}</span>
                    <button
                      sanringBtn
                      variant="outline"
                      size="sm"
                      type="button"
                      (click)="basicCal.clear()"
                    >
                      {{ i18n.t('calendar.demo.clear') }}
                    </button>
                  </div>
                }
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-no-deselect')">
            <app-component-page-code-previewer [code]="examples.noDeselect" language="angular-html">
              <div previewer class="flex w-full flex-col items-center gap-3">
                <div
                  class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                >
                  <sanring-calendar
                    #noDeselectCal="sanringCalendar"
                    [allowDeselect]="false"
                    [locale]="calendarLocale()"
                    (selectedDateChange)="noDeselectSelected = $event"
                  />
                  @if (!showInfoBlock()) {
                    <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                      <span class="text-[var(--docs-muted)]">{{
                        singleSelectionText(noDeselectSelected)
                      }}</span>
                      <button
                        sanringBtn
                        variant="outline"
                        size="sm"
                        type="button"
                        (click)="noDeselectCal.clear()"
                      >
                        {{ i18n.t('calendar.demo.clear') }}
                      </button>
                    </div>
                  }
                </div>
                @if (showInfoBlock()) {
                  <div
                    class="flex w-full max-w-[20rem] items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-2 text-sm"
                  >
                    <span class="text-[var(--docs-muted)]">{{
                      singleSelectionText(noDeselectSelected)
                    }}</span>
                    <button
                      sanringBtn
                      variant="outline"
                      size="sm"
                      type="button"
                      (click)="noDeselectCal.clear()"
                    >
                      {{ i18n.t('calendar.demo.clear') }}
                    </button>
                  </div>
                }
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="flex w-full flex-col items-center gap-3">
                <div
                  class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                >
                  <sanring-calendar
                    #disabledCal="sanringCalendar"
                    [allowDeselect]="false"
                    [disabled]="disabledMatcher"
                    [locale]="calendarLocale()"
                    (selectedDateChange)="disabledSelected = $event"
                  />
                  @if (!showInfoBlock()) {
                    <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                      <span class="text-[var(--docs-muted)]">{{
                        singleSelectionText(disabledSelected)
                      }}</span>
                      <button
                        sanringBtn
                        variant="outline"
                        size="sm"
                        type="button"
                        (click)="disabledCal.clear()"
                      >
                        {{ i18n.t('calendar.demo.clear') }}
                      </button>
                    </div>
                  }
                </div>
                @if (showInfoBlock()) {
                  <div
                    class="flex w-full max-w-[20rem] items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-2 text-sm"
                  >
                    <span class="text-[var(--docs-muted)]">{{
                      singleSelectionText(disabledSelected)
                    }}</span>
                    <button
                      sanringBtn
                      variant="outline"
                      size="sm"
                      type="button"
                      (click)="disabledCal.clear()"
                    >
                      {{ i18n.t('calendar.demo.clear') }}
                    </button>
                  </div>
                }
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-range')">
            <app-component-page-code-previewer [code]="examples.range" language="angular-html">
              <div previewer class="flex w-full flex-col items-center gap-3">
                <div
                  class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                >
                  <sanring-calendar
                    #rangeCal="sanringCalendar"
                    mode="range"
                    [locale]="calendarLocale()"
                    (selectedRangeChange)="rangeSelected = $event"
                  />
                  @if (!showInfoBlock()) {
                    <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                      <span class="min-w-0 flex-1 truncate text-[var(--docs-muted)]">{{
                        rangeSelectionText(rangeSelected)
                      }}</span>
                      <div class="flex shrink-0 gap-1">
                        @if (rangeCal.isDraftActive()) {
                          <button
                            sanringBtn
                            variant="ghost"
                            size="sm"
                            type="button"
                            (click)="rangeCal.abortRangeDraft()"
                          >
                            {{ i18n.t('calendar.demo.abortDraft') }}
                          </button>
                        }
                        <button
                          sanringBtn
                          variant="outline"
                          size="sm"
                          type="button"
                          (click)="rangeCal.clear()"
                        >
                          {{ i18n.t('calendar.demo.clear') }}
                        </button>
                      </div>
                    </div>
                  }
                </div>
                @if (showInfoBlock()) {
                  <div
                    class="flex w-full max-w-[20rem] items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-2 text-sm"
                  >
                    <span class="min-w-0 flex-1 truncate text-[var(--docs-muted)]">{{
                      rangeSelectionText(rangeSelected)
                    }}</span>
                    <div class="flex shrink-0 gap-1">
                      @if (rangeCal.isDraftActive()) {
                        <button
                          sanringBtn
                          variant="ghost"
                          size="sm"
                          type="button"
                          (click)="rangeCal.abortRangeDraft()"
                        >
                          {{ i18n.t('calendar.demo.abortDraft') }}
                        </button>
                      }
                      <button
                        sanringBtn
                        variant="outline"
                        size="sm"
                        type="button"
                        (click)="rangeCal.clear()"
                      >
                        {{ i18n.t('calendar.demo.clear') }}
                      </button>
                    </div>
                  </div>
                }
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-multi-month')">
            <app-component-page-code-previewer [code]="examples.multiMonth" language="angular-html">
              <div previewer class="flex w-full flex-col items-center gap-3">
                <div
                  class="w-full rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                >
                  <sanring-calendar
                    #multiMonthCal="sanringCalendar"
                    mode="range"
                    [monthsToDisplay]="2"
                    [locale]="calendarLocale()"
                    (selectedRangeChange)="multiMonthSelected = $event"
                  />
                  @if (!showInfoBlock()) {
                    <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                      <span class="min-w-0 flex-1 truncate text-[var(--docs-muted)]">{{
                        rangeSelectionText(multiMonthSelected)
                      }}</span>
                      <div class="flex shrink-0 gap-1">
                        @if (multiMonthCal.isDraftActive()) {
                          <button
                            sanringBtn
                            variant="ghost"
                            size="sm"
                            type="button"
                            (click)="multiMonthCal.abortRangeDraft()"
                          >
                            {{ i18n.t('calendar.demo.abortDraft') }}
                          </button>
                        }
                        <button
                          sanringBtn
                          variant="outline"
                          size="sm"
                          type="button"
                          (click)="multiMonthCal.clear()"
                        >
                          {{ i18n.t('calendar.demo.clear') }}
                        </button>
                      </div>
                    </div>
                  }
                </div>
                @if (showInfoBlock()) {
                  <div
                    class="flex w-full items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-2 text-sm"
                  >
                    <span class="min-w-0 flex-1 truncate text-[var(--docs-muted)]">{{
                      rangeSelectionText(multiMonthSelected)
                    }}</span>
                    <div class="flex shrink-0 gap-1">
                      @if (multiMonthCal.isDraftActive()) {
                        <button
                          sanringBtn
                          variant="ghost"
                          size="sm"
                          type="button"
                          (click)="multiMonthCal.abortRangeDraft()"
                        >
                          {{ i18n.t('calendar.demo.abortDraft') }}
                        </button>
                      }
                      <button
                        sanringBtn
                        variant="outline"
                        size="sm"
                        type="button"
                        (click)="multiMonthCal.clear()"
                      >
                        {{ i18n.t('calendar.demo.clear') }}
                      </button>
                    </div>
                  </div>
                }
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-sizes')">
            <app-component-page-code-previewer [code]="examples.sizes" language="angular-html">
              <div previewer class="flex w-full flex-wrap items-start justify-center gap-8">
                <div class="flex flex-col items-center gap-2">
                  <sanring-calendar size="sm" [locale]="calendarLocale()" />
                  <span class="text-xs text-[var(--docs-muted)]">{{
                    i18n.t('calendar.demo.size.sm')
                  }}</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-calendar size="md" [locale]="calendarLocale()" />
                  <span class="text-xs text-[var(--docs-muted)]">{{
                    i18n.t('calendar.demo.size.md')
                  }}</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-calendar size="lg" [locale]="calendarLocale()" />
                  <span class="text-xs text-[var(--docs-muted)]">{{
                    i18n.t('calendar.demo.size.lg')
                  }}</span>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>
      </div>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
  styles: [
    `
      .maintenance-tape {
        position: relative;
        margin-block: 1.5rem;
        padding-block: 1.25rem;
      }

      .maintenance-tape::before,
      .maintenance-tape::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 10px;
        background-image: repeating-linear-gradient(
          45deg,
          #f5c400 0 10px,
          #1a1a1a 10px 20px
        );
      }

      .maintenance-tape::before {
        top: 0;
      }

      .maintenance-tape::after {
        bottom: 0;
      }
    `,
  ],
})
export class CalendarPageComponent {
  protected readonly page = calendarPage;
  protected readonly examples = calendarPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly calendarLocale = computed<CalendarLocale>(() =>
    this.i18n.locale() === 'zh' ? ZH_LOCALE : EN_LOCALE,
  );

  /** Mirrors date-picker's demo toggle between an inline vs. a separate selection-summary block. */
  protected readonly showInfoBlock = signal(true);

  basicSelected: Date | null = null;
  basicScenarioSelected: Date | null = null;
  noDeselectSelected: Date | null = null;
  disabledSelected: Date | null = null;
  rangeSelected: DateRange = { start: null, end: null };
  multiMonthSelected: DateRange = { start: null, end: null };

  protected readonly isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  private readonly summerBreak: DateInterval = {
    from: new Date(2026, 6, 20),
    to: new Date(2026, 6, 24),
  };

  protected readonly disabledMatcher: DisabledInput = [this.isWeekend, this.summerBreak];

  protected formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected singleSelectionText(date: Date | null): string {
    if (!date) return this.i18n.t('calendar.demo.noSelection');
    return `${this.i18n.t('calendar.demo.selected')}${this.formatDate(date)}`;
  }

  protected rangeSelectionText(range: DateRange): string {
    if (!range.start) return this.i18n.t('calendar.demo.noSelection');
    if (!range.end) {
      return `${this.i18n.t('calendar.demo.rangeStart')}${this.formatDate(range.start)}${this.i18n.t('calendar.demo.rangeAwaitingEnd')}`;
    }
    return `${this.formatDate(range.start)}${this.i18n.t('calendar.demo.rangeSeparator')}${this.formatDate(range.end)}`;
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
