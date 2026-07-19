import { Component, computed, inject, signal } from '@angular/core';
import { LucideHammer } from '@lucide/angular';
import { CalendarLocale, DateRange, DisabledInput, PickerGranularity } from '@sanring/date-picker';
import {
  AlertComponent,
  AlertDescriptionDirective,
  AlertTitleDirective,
  ButtonDirective,
  DatePickerComponent,
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslationKey } from '../../../i18n/translations';
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
import { datePickerPage, datePickerPageExamples } from './date-picker.docs';

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
  selector: 'app-date-picker-page',
  imports: [
    AlertComponent,
    AlertDescriptionDirective,
    AlertTitleDirective,
    ComponentPageApiTableComponent,
    ButtonDirective,
    DatePickerComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    LucideHammer,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <sanring-alert class="mb-8">
        <svg lucideHammer class="size-4"></svg>
        <h5 sanringAlertTitle>{{ i18n.t('status.wip.title') }}</h5>
        <p sanringAlertDescription>{{ i18n.t('status.wip.description') }}</p>
      </sanring-alert>

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex w-full flex-col items-center gap-3">
            <sanring-date-picker
              [locale]="datePickerLocale()"
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
          componentName="date-picker"
          manualSnippet="import { DatePickerComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-matrix')">
            <app-component-page-code-previewer [code]="examples.matrix" language="angular-html">
              <div previewer class="flex w-full flex-col items-center gap-4">
                <div class="flex flex-wrap justify-center gap-1">
                  @for (g of granularities; track g) {
                    <button
                      sanringBtn
                      type="button"
                      size="sm"
                      [variant]="granularity() === g ? 'default' : 'outline'"
                      (click)="granularity.set(g)"
                    >
                      {{ i18n.t(granularityLabelKeys[g]) }}
                    </button>
                  }
                </div>
                <div class="flex flex-wrap justify-center gap-1">
                  @for (m of modes; track m) {
                    <button
                      sanringBtn
                      type="button"
                      size="sm"
                      [variant]="mode() === m ? 'default' : 'outline'"
                      (click)="mode.set(m)"
                    >
                      {{ i18n.t(modeLabelKeys[m]) }}
                    </button>
                  }
                </div>

                <div
                  class="w-full max-w-[20rem] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
                >
                  <sanring-date-picker
                    #matrixPicker="sanringDatePicker"
                    [granularity]="granularity()"
                    [mode]="mode()"
                    [locale]="datePickerLocale()"
                    (selectedDateChange)="matrixSingleResult = $event"
                    (selectedRangeChange)="matrixRangeResult = $event"
                    (selectedDatesChange)="matrixMultiResult = $event"
                  />
                  <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                    <span class="min-w-0 flex-1 truncate text-[var(--docs-muted)]">
                      @switch (mode()) {
                        @case ('single') {
                          {{ singleSelectionText(matrixSingleResult) }}
                        }
                        @case ('range') {
                          {{ rangeSelectionText(matrixRangeResult) }}
                        }
                        @case ('multi') {
                          {{ multiSelectionText(matrixMultiResult) }}
                        }
                      }
                    </span>
                    <div class="flex shrink-0 gap-1">
                      @if (mode() === 'range' && matrixPicker.isDraftActive()) {
                        <button
                          sanringBtn
                          variant="ghost"
                          size="sm"
                          type="button"
                          (click)="matrixPicker.abortRangeDraft()"
                        >
                          {{ i18n.t('calendar.demo.abortDraft') }}
                        </button>
                      }
                      <button
                        sanringBtn
                        variant="outline"
                        size="sm"
                        type="button"
                        (click)="matrixPicker.clear()"
                      >
                        {{ i18n.t('datePicker.demo.clear') }}
                      </button>
                    </div>
                  </div>
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
                  <sanring-date-picker
                    #disabledPicker="sanringDatePicker"
                    [disabled]="isPastYear"
                    [locale]="datePickerLocale()"
                    (selectedDateChange)="disabledSelected = $event"
                  />
                  <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                    <span class="text-[var(--docs-muted)]">{{
                      singleSelectionText(disabledSelected)
                    }}</span>
                    <button
                      sanringBtn
                      variant="outline"
                      size="sm"
                      type="button"
                      (click)="disabledPicker.clear()"
                    >
                      {{ i18n.t('datePicker.demo.clear') }}
                    </button>
                  </div>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-sizes')">
            <app-component-page-code-previewer [code]="examples.sizes" language="angular-html">
              <div previewer class="flex w-full flex-wrap items-start justify-center gap-8">
                <div class="flex flex-col items-center gap-2">
                  <sanring-date-picker size="sm" [locale]="datePickerLocale()" />
                  <span class="text-xs text-[var(--docs-muted)]">{{
                    i18n.t('datePicker.demo.size.sm')
                  }}</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-date-picker size="md" [locale]="datePickerLocale()" />
                  <span class="text-xs text-[var(--docs-muted)]">{{
                    i18n.t('datePicker.demo.size.md')
                  }}</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-date-picker size="lg" [locale]="datePickerLocale()" />
                  <span class="text-xs text-[var(--docs-muted)]">{{
                    i18n.t('datePicker.demo.size.lg')
                  }}</span>
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
export class DatePickerPageComponent {
  protected readonly page = datePickerPage;
  protected readonly examples = datePickerPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly datePickerLocale = computed<CalendarLocale>(() =>
    this.i18n.locale() === 'zh' ? ZH_LOCALE : EN_LOCALE,
  );

  protected readonly granularities: PickerGranularity[] = ['month', 'quarter', 'year'];
  protected readonly modes: Array<'single' | 'range' | 'multi'> = ['single', 'range', 'multi'];
  protected readonly granularity = signal<PickerGranularity>('month');
  protected readonly mode = signal<'single' | 'range' | 'multi'>('single');

  protected readonly granularityLabelKeys: Record<PickerGranularity, TranslationKey> = {
    month: 'datePicker.demo.granularity.month',
    quarter: 'datePicker.demo.granularity.quarter',
    year: 'datePicker.demo.granularity.year',
  };
  protected readonly modeLabelKeys: Record<'single' | 'range' | 'multi', TranslationKey> = {
    single: 'datePicker.demo.mode.single',
    range: 'datePicker.demo.mode.range',
    multi: 'datePicker.demo.mode.multi',
  };

  basicSelected: Date | null = null;
  disabledSelected: Date | null = null;
  matrixSingleResult: Date | null = null;
  matrixRangeResult: DateRange = { start: null, end: null };
  matrixMultiResult: Date[] = [];

  protected readonly isPastYear: DisabledInput = (date: Date) => date.getFullYear() < 2026;

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

  protected multiSelectionText(dates: Date[]): string {
    if (dates.length === 0) return this.i18n.t('calendar.demo.noSelection');
    return dates
      .map((date) => this.formatDate(date))
      .sort()
      .join(', ');
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
