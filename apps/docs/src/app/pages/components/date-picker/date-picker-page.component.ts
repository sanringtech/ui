import { Component, computed, inject, signal } from '@angular/core';
import { CalendarLocale, DateRange, DisabledInput, PickerGranularity } from '@sanring/date-picker';
import {
  ButtonDirective,
  DatePickerComponent,
  PopoverComponent,
  SanringFieldComponent,
  SANRING_POPOVER_IMPORTS,
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

type DatePickerMode = 'single' | 'range' | 'multi';

interface DatePickerPreset {
  readonly titleKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
  readonly granularity: PickerGranularity;
  readonly mode: DatePickerMode;
}

@Component({
  selector: 'app-date-picker-page',
  imports: [
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
    SanringFieldComponent,
    SANRING_POPOVER_IMPORTS,
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
              <div previewer class="grid w-full gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div class="grid gap-3 sm:grid-cols-2">
                  @for (preset of presets; track preset.titleKey) {
                    <button
                      type="button"
                      class="rounded-[var(--sanring-radius)] border p-3 text-left transition-colors"
                      [style.border-color]="
                        isActivePreset(preset)
                          ? 'var(--sanring-border-strong)'
                          : 'var(--docs-border)'
                      "
                      [style.background]="
                        isActivePreset(preset)
                          ? 'var(--sanring-surface-strong)'
                          : 'var(--docs-panel)'
                      "
                      [attr.aria-pressed]="isActivePreset(preset)"
                      (click)="applyPreset(preset)"
                    >
                      <span class="block text-sm font-semibold text-[var(--docs-fg)]">
                        {{ i18n.t(preset.titleKey) }}
                      </span>
                      <span class="mt-1 block text-xs leading-5 text-[var(--docs-muted)]">
                        {{ i18n.t(preset.descriptionKey) }}
                      </span>
                      <span class="mt-3 flex flex-wrap gap-1">
                        <span
                          class="rounded-[var(--sanring-radius)] bg-[var(--docs-active)] px-2 py-1 text-[11px] font-medium text-[var(--docs-fg)]"
                        >
                          {{ i18n.t(granularityLabelKeys[preset.granularity]) }}
                        </span>
                        <span
                          class="rounded-[var(--sanring-radius)] bg-[var(--docs-active)] px-2 py-1 text-[11px] font-medium text-[var(--docs-fg)]"
                        >
                          {{ i18n.t(modeLabelKeys[preset.mode]) }}
                        </span>
                      </span>
                    </button>
                  }
                </div>

                <div
                  class="w-full rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4"
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
                  <div class="mt-4 grid gap-3 text-sm">
                    <div>
                      <div class="font-medium text-[var(--docs-fg)]">
                        {{ activePresetTitle() }}
                      </div>
                      <div class="mt-1 flex flex-wrap gap-1">
                        <span
                          class="rounded-[var(--sanring-radius)] bg-[var(--docs-active)] px-2 py-1 text-[11px] font-medium text-[var(--docs-fg)]"
                        >
                          {{ i18n.t(granularityLabelKeys[granularity()]) }}
                        </span>
                        <span
                          class="rounded-[var(--sanring-radius)] bg-[var(--docs-active)] px-2 py-1 text-[11px] font-medium text-[var(--docs-fg)]"
                        >
                          {{ i18n.t(modeLabelKeys[mode()]) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between gap-2">
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

          <app-component-page-section [section]="section('example-select-trigger')">
            <app-component-page-code-previewer
              [code]="examples.selectTrigger"
              language="angular-html"
            >
              <div previewer class="flex w-full flex-wrap items-start justify-center gap-6">
                <sanring-popover #startPopover>
                  <button type="button" sanringPopoverTrigger [class]="selectTriggerClass">
                    <span class="truncate">{{
                      rangeStart
                        ? formatMonth(rangeStart)
                        : i18n.t('datePicker.demo.selectTrigger.start')
                    }}</span>
                  </button>
                  <sanring-popover-content>
                    <sanring-date-picker
                      [locale]="datePickerLocale()"
                      (selectedDateChange)="onRangeStartChange($event, startPopover)"
                    />
                  </sanring-popover-content>
                </sanring-popover>

                <sanring-popover #endPopover>
                  <button type="button" sanringPopoverTrigger [class]="selectTriggerClass">
                    <span class="truncate">{{
                      rangeEnd ? formatMonth(rangeEnd) : i18n.t('datePicker.demo.selectTrigger.end')
                    }}</span>
                  </button>
                  <sanring-popover-content>
                    <sanring-date-picker
                      [locale]="datePickerLocale()"
                      (selectedDateChange)="onRangeEndChange($event, endPopover)"
                    />
                  </sanring-popover-content>
                </sanring-popover>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-field')">
            <app-component-page-code-previewer [code]="examples.field" language="angular-html">
              <div previewer class="w-full max-w-[28rem]">
                <div class="grid gap-3 sm:grid-cols-2">
                  <sanring-field>
                    <label class="text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t('datePicker.demo.field.start') }}
                    </label>
                    <sanring-popover #fieldStartPopover>
                      <button type="button" sanringPopoverTrigger [class]="fieldTriggerClass">
                        <span class="truncate">{{
                          fieldRangeStart
                            ? formatMonth(fieldRangeStart)
                            : i18n.t('datePicker.demo.field.placeholder')
                        }}</span>
                      </button>
                      <sanring-popover-content>
                        <sanring-date-picker
                          [locale]="datePickerLocale()"
                          (selectedDateChange)="onFieldRangeStartChange($event, fieldStartPopover)"
                        />
                      </sanring-popover-content>
                    </sanring-popover>
                  </sanring-field>

                  <sanring-field>
                    <label class="text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t('datePicker.demo.field.end') }}
                    </label>
                    <sanring-popover #fieldEndPopover>
                      <button type="button" sanringPopoverTrigger [class]="fieldTriggerClass">
                        <span class="truncate">{{
                          fieldRangeEnd
                            ? formatMonth(fieldRangeEnd)
                            : i18n.t('datePicker.demo.field.placeholder')
                        }}</span>
                      </button>
                      <sanring-popover-content>
                        <sanring-date-picker
                          [locale]="datePickerLocale()"
                          (selectedDateChange)="onFieldRangeEndChange($event, fieldEndPopover)"
                        />
                      </sanring-popover-content>
                    </sanring-popover>
                  </sanring-field>
                </div>

                <div
                  class="mt-4 rounded-[var(--sanring-radius)] bg-[var(--docs-active)] px-3 py-2 text-sm text-[var(--docs-muted)]"
                >
                  {{ i18n.t('datePicker.demo.field.summary') }}
                  <span class="font-medium text-[var(--docs-fg)]">
                    {{ fieldRangeText() }}
                  </span>
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

  protected readonly granularity = signal<PickerGranularity>('month');
  protected readonly mode = signal<DatePickerMode>('single');

  protected readonly presets: DatePickerPreset[] = [
    {
      titleKey: 'datePicker.demo.preset.billingMonth',
      descriptionKey: 'datePicker.demo.preset.billingMonth.description',
      granularity: 'month',
      mode: 'single',
    },
    {
      titleKey: 'datePicker.demo.preset.fiscalQuarter',
      descriptionKey: 'datePicker.demo.preset.fiscalQuarter.description',
      granularity: 'quarter',
      mode: 'single',
    },
    {
      titleKey: 'datePicker.demo.preset.planningYear',
      descriptionKey: 'datePicker.demo.preset.planningYear.description',
      granularity: 'year',
      mode: 'single',
    },
    {
      titleKey: 'datePicker.demo.preset.monthRange',
      descriptionKey: 'datePicker.demo.preset.monthRange.description',
      granularity: 'month',
      mode: 'range',
    },
    {
      titleKey: 'datePicker.demo.preset.reportingMonths',
      descriptionKey: 'datePicker.demo.preset.reportingMonths.description',
      granularity: 'month',
      mode: 'multi',
    },
  ];

  protected readonly granularityLabelKeys: Record<PickerGranularity, TranslationKey> = {
    month: 'datePicker.demo.granularity.month',
    quarter: 'datePicker.demo.granularity.quarter',
    year: 'datePicker.demo.granularity.year',
  };
  protected readonly modeLabelKeys: Record<DatePickerMode, TranslationKey> = {
    single: 'datePicker.demo.mode.single',
    range: 'datePicker.demo.mode.range',
    multi: 'datePicker.demo.mode.multi',
  };

  basicSelected: Date | null = null;
  disabledSelected: Date | null = null;
  matrixSingleResult: Date | null = null;
  matrixRangeResult: DateRange = { start: null, end: null };
  matrixMultiResult: Date[] = [];
  rangeStart: Date | null = null;
  rangeEnd: Date | null = null;
  fieldRangeStart: Date | null = null;
  fieldRangeEnd: Date | null = null;

  protected readonly selectTriggerClass =
    'flex h-10 w-[180px] items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)] px-3 py-2 text-sm text-[var(--sanring-foreground)] transition-colors hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]';
  protected readonly fieldTriggerClass =
    'flex h-10 w-full items-center justify-between gap-2 rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)] px-3 py-2 text-left text-sm text-[var(--sanring-foreground)] transition-colors hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]';

  protected onRangeStartChange(date: Date | null, popover: PopoverComponent): void {
    this.rangeStart = date;
    popover.setOpen(false);
  }

  protected onRangeEndChange(date: Date | null, popover: PopoverComponent): void {
    this.rangeEnd = date;
    popover.setOpen(false);
  }

  protected readonly isPastYear: DisabledInput = (date: Date) => date.getFullYear() < 2026;

  protected onFieldRangeStartChange(date: Date | null, popover: PopoverComponent): void {
    this.fieldRangeStart = date;
    popover.setOpen(false);
  }

  protected onFieldRangeEndChange(date: Date | null, popover: PopoverComponent): void {
    this.fieldRangeEnd = date;
    popover.setOpen(false);
  }

  protected applyPreset(preset: DatePickerPreset): void {
    this.granularity.set(preset.granularity);
    this.mode.set(preset.mode);
    this.matrixSingleResult = null;
    this.matrixRangeResult = { start: null, end: null };
    this.matrixMultiResult = [];
  }

  protected isActivePreset(preset: DatePickerPreset): boolean {
    return this.granularity() === preset.granularity && this.mode() === preset.mode;
  }

  protected activePresetTitle(): string {
    const preset = this.presets.find((item) => this.isActivePreset(item));
    return preset ? this.i18n.t(preset.titleKey) : '';
  }

  protected formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected formatMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
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

  protected fieldRangeText(): string {
    if (!this.fieldRangeStart && !this.fieldRangeEnd)
      return this.i18n.t('calendar.demo.noSelection');
    const start = this.fieldRangeStart ? this.formatMonth(this.fieldRangeStart) : '...';
    const end = this.fieldRangeEnd ? this.formatMonth(this.fieldRangeEnd) : '...';
    return `${start}${this.i18n.t('calendar.demo.rangeSeparator')}${end}`;
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
