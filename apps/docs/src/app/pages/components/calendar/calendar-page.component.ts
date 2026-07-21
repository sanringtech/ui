import { Component, computed, inject } from '@angular/core';
import { CalendarLocale, DateInterval, DateRange, DisabledInput } from '@sanring/date-picker';
import { ButtonDirective, CalendarComponent, SANRING_TABS_IMPORTS } from '@sanring/ui';
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

/**
 * Week-start-order demo: identical abbreviated labels, only weekStartsOn
 * differs — isolates reordering from every other locale concern (a separate
 * example section from Custom locale, which is only about swapping scripts).
 */
const EN_MON_FIRST_LOCALE: CalendarLocale = { ...EN_LOCALE, weekStartsOn: 1 };

/** weekStartsOn stays 0 (same as ZH_LOCALE) — Custom locale is about script, not order. */
const JA_LOCALE: CalendarLocale = {
  weekStartsOn: 0,
  weekdayLabels: ['日', '月', '火', '水', '木', '金', '土'],
  monthLabels: ZH_LOCALE.monthLabels,
};

@Component({
  selector: 'app-calendar-page',
  imports: [
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
    SANRING_TABS_IMPORTS,
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
          manualSnippet="import { CalendarComponent } from './components/ui/calendar';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
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
                </div>
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
                </div>
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
                </div>
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
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-multi-month')">
            <sanring-tabs defaultValue="horizontal">
              <sanring-tabs-list>
                <sanring-tabs-trigger value="horizontal">
                  {{ i18n.t('calendar.demo.multiMonth.tab.horizontal') }}
                </sanring-tabs-trigger>
                <sanring-tabs-trigger value="vertical">
                  {{ i18n.t('calendar.demo.multiMonth.tab.vertical') }}
                </sanring-tabs-trigger>
              </sanring-tabs-list>

              <sanring-tabs-content value="horizontal">
                <app-component-page-code-previewer
                  [code]="examples.multiMonthHorizontal"
                  language="angular-html"
                >
                  <div previewer class="flex w-full flex-col items-center gap-3">
                    <div
                      class="w-full rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                    >
                      <sanring-calendar
                        #multiMonthHorizontalCal="sanringCalendar"
                        mode="range"
                        [monthsToDisplay]="2"
                        orientation="horizontal"
                        [locale]="calendarLocale()"
                        (selectedRangeChange)="multiMonthHorizontalSelected = $event"
                      />
                    </div>
                    <div
                      class="flex w-full items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-2 text-sm"
                    >
                      <span class="min-w-0 flex-1 truncate text-[var(--docs-muted)]">{{
                        rangeSelectionText(multiMonthHorizontalSelected)
                      }}</span>
                      <div class="flex shrink-0 gap-1">
                        @if (multiMonthHorizontalCal.isDraftActive()) {
                          <button
                            sanringBtn
                            variant="ghost"
                            size="sm"
                            type="button"
                            (click)="multiMonthHorizontalCal.abortRangeDraft()"
                          >
                            {{ i18n.t('calendar.demo.abortDraft') }}
                          </button>
                        }
                        <button
                          sanringBtn
                          variant="outline"
                          size="sm"
                          type="button"
                          (click)="multiMonthHorizontalCal.clear()"
                        >
                          {{ i18n.t('calendar.demo.clear') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </app-component-page-code-previewer>
              </sanring-tabs-content>

              <sanring-tabs-content value="vertical">
                <app-component-page-code-previewer
                  [code]="examples.multiMonthVertical"
                  language="angular-html"
                >
                  <div previewer class="flex w-full flex-col items-center gap-3">
                    <div
                      class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                    >
                      <sanring-calendar
                        #multiMonthVerticalCal="sanringCalendar"
                        mode="range"
                        [monthsToDisplay]="2"
                        orientation="vertical"
                        [locale]="calendarLocale()"
                        (selectedRangeChange)="multiMonthVerticalSelected = $event"
                      />
                    </div>
                    <div
                      class="flex w-full max-w-[20rem] items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-2 text-sm"
                    >
                      <span class="min-w-0 flex-1 truncate text-[var(--docs-muted)]">{{
                        rangeSelectionText(multiMonthVerticalSelected)
                      }}</span>
                      <div class="flex shrink-0 gap-1">
                        @if (multiMonthVerticalCal.isDraftActive()) {
                          <button
                            sanringBtn
                            variant="ghost"
                            size="sm"
                            type="button"
                            (click)="multiMonthVerticalCal.abortRangeDraft()"
                          >
                            {{ i18n.t('calendar.demo.abortDraft') }}
                          </button>
                        }
                        <button
                          sanringBtn
                          variant="outline"
                          size="sm"
                          type="button"
                          (click)="multiMonthVerticalCal.clear()"
                        >
                          {{ i18n.t('calendar.demo.clear') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </app-component-page-code-previewer>
              </sanring-tabs-content>
            </sanring-tabs>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-week-start')">
            <sanring-tabs defaultValue="sunFirst">
              <sanring-tabs-list>
                <sanring-tabs-trigger value="sunFirst">
                  {{ i18n.t('calendar.demo.weekStart.sunFirst') }}
                </sanring-tabs-trigger>
                <sanring-tabs-trigger value="monFirst">
                  {{ i18n.t('calendar.demo.weekStart.monFirst') }}
                </sanring-tabs-trigger>
              </sanring-tabs-list>

              <sanring-tabs-content value="sunFirst">
                <app-component-page-code-previewer
                  [code]="examples.weekStartSunFirst"
                  language="angular-html"
                >
                  <div previewer class="flex w-full flex-col items-center gap-3">
                    <div
                      class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                    >
                      <sanring-calendar
                        [locale]="enSunFirstLocale"
                        (selectedDateChange)="weekStartSunSelected = $event"
                      />
                    </div>
                    <span class="text-sm text-[var(--docs-muted)]">{{
                      singleSelectionText(weekStartSunSelected)
                    }}</span>
                  </div>
                </app-component-page-code-previewer>
              </sanring-tabs-content>

              <sanring-tabs-content value="monFirst">
                <app-component-page-code-previewer
                  [code]="examples.weekStartMonFirst"
                  language="angular-html"
                >
                  <div previewer class="flex w-full flex-col items-center gap-3">
                    <div
                      class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                    >
                      <sanring-calendar
                        [locale]="enMonFirstLocale"
                        (selectedDateChange)="weekStartMonSelected = $event"
                      />
                    </div>
                    <span class="text-sm text-[var(--docs-muted)]">{{
                      singleSelectionText(weekStartMonSelected)
                    }}</span>
                  </div>
                </app-component-page-code-previewer>
              </sanring-tabs-content>
            </sanring-tabs>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-custom-locale')">
            <sanring-tabs defaultValue="zh">
              <sanring-tabs-list>
                <sanring-tabs-trigger value="zh">
                  {{ i18n.t('calendar.demo.customLocale.tab.zh') }}
                </sanring-tabs-trigger>
                <sanring-tabs-trigger value="ja">
                  {{ i18n.t('calendar.demo.customLocale.tab.ja') }}
                </sanring-tabs-trigger>
              </sanring-tabs-list>

              <sanring-tabs-content value="zh">
                <app-component-page-code-previewer
                  [code]="examples.customLocaleZh"
                  language="angular-html"
                >
                  <div previewer class="flex w-full flex-col items-center gap-3">
                    <div
                      class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                    >
                      <sanring-calendar
                        [locale]="zhLocale"
                        (selectedDateChange)="customLocaleZhSelected = $event"
                      />
                    </div>
                    <span class="text-sm text-[var(--docs-muted)]">{{
                      singleSelectionText(customLocaleZhSelected)
                    }}</span>
                  </div>
                </app-component-page-code-previewer>
              </sanring-tabs-content>

              <sanring-tabs-content value="ja">
                <app-component-page-code-previewer
                  [code]="examples.customLocaleJa"
                  language="angular-html"
                >
                  <div previewer class="flex w-full flex-col items-center gap-3">
                    <div
                      class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                    >
                      <sanring-calendar
                        [locale]="jaLocale"
                        (selectedDateChange)="customLocaleJaSelected = $event"
                      />
                    </div>
                    <span class="text-sm text-[var(--docs-muted)]">{{
                      singleSelectionText(customLocaleJaSelected)
                    }}</span>
                  </div>
                </app-component-page-code-previewer>
              </sanring-tabs-content>
            </sanring-tabs>
          </app-component-page-section>

        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class CalendarPageComponent {
  protected readonly page = calendarPage;
  protected readonly examples = calendarPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly calendarLocale = computed<CalendarLocale>(() =>
    this.i18n.locale() === 'zh' ? ZH_LOCALE : EN_LOCALE,
  );

  basicSelected: Date | null = null;
  noDeselectSelected: Date | null = null;
  disabledSelected: Date | null = null;
  rangeSelected: DateRange = { start: null, end: null };
  multiMonthHorizontalSelected: DateRange = { start: null, end: null };
  multiMonthVerticalSelected: DateRange = { start: null, end: null };
  weekStartSunSelected: Date | null = null;
  weekStartMonSelected: Date | null = null;
  customLocaleZhSelected: Date | null = null;
  customLocaleJaSelected: Date | null = null;

  protected readonly enSunFirstLocale = EN_LOCALE;
  protected readonly enMonFirstLocale = EN_MON_FIRST_LOCALE;
  protected readonly zhLocale = ZH_LOCALE;
  protected readonly jaLocale = JA_LOCALE;

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
