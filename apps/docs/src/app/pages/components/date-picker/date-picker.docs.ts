import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const datePickerPage = {
  componentId: 'date-picker',
  titleKey: 'component.datePicker',
  descriptionKey: 'datePicker.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'datePicker.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'datePicker.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'datePicker.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'datePicker.examples.description',
      level: 2,
      children: [
        {
          id: 'example-matrix',
          titleKey: 'datePicker.demo.matrix',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'datePicker.demo.disabled',
          descriptionKey: 'datePicker.demo.disabled.description',
          level: 3,
        },
        {
          id: 'example-sizes',
          titleKey: 'datePicker.demo.sizes',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'datePicker.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'datePicker.api.class.description',
    },
    {
      property: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      descriptionKey: 'datePicker.api.size.description',
    },
    {
      property: 'locale',
      type: 'CalendarLocale | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'datePicker.api.locale.description',
    },
    {
      property: 'granularity',
      type: "'month' | 'quarter' | 'year'",
      defaultValue: "'month'",
      descriptionKey: 'datePicker.api.granularity.description',
    },
    {
      property: 'mode',
      type: "'single' | 'range' | 'multi'",
      defaultValue: "'single'",
      descriptionKey: 'datePicker.api.mode.description',
    },
    {
      property: 'quarterLabels',
      type: 'readonly [string, string, string, string]',
      defaultValue: "['Q1', 'Q2', 'Q3', 'Q4']",
      descriptionKey: 'datePicker.api.quarterLabels.description',
    },
    {
      property: 'yearsToDisplay',
      type: 'number',
      defaultValue: '12',
      descriptionKey: 'datePicker.api.yearsToDisplay.description',
    },
    {
      property: 'gridColumns',
      type: 'number | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'datePicker.api.gridColumns.description',
    },
    {
      property: 'disabled',
      type: 'DisabledInput | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'datePicker.api.disabled.description',
    },
    {
      property: 'allowDeselect',
      type: 'boolean',
      defaultValue: 'true',
      descriptionKey: 'datePicker.api.allowDeselect.description',
    },
    {
      property: 'rangePeriodCountLimit',
      type: 'RangePeriodCountLimit | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'datePicker.api.rangePeriodCountLimit.description',
    },
    {
      property: 'prevYearLabel',
      type: 'string',
      defaultValue: "'上一年'",
      descriptionKey: 'datePicker.api.prevYearLabel.description',
    },
    {
      property: 'nextYearLabel',
      type: 'string',
      defaultValue: "'下一年'",
      descriptionKey: 'datePicker.api.nextYearLabel.description',
    },
    {
      property: 'selectedDateChange',
      type: 'EventEmitter<Date | null>',
      defaultValue: '—',
      descriptionKey: 'datePicker.api.selectedDateChange.description',
    },
    {
      property: 'selectedRangeChange',
      type: 'EventEmitter<DateRange>',
      defaultValue: '—',
      descriptionKey: 'datePicker.api.selectedRangeChange.description',
    },
    {
      property: 'selectedDatesChange',
      type: 'EventEmitter<Date[]>',
      defaultValue: '—',
      descriptionKey: 'datePicker.api.selectedDatesChange.description',
    },
    {
      property: 'isDraftActive',
      type: 'Signal<boolean>',
      defaultValue: '—',
      descriptionKey: 'datePicker.api.isDraftActive.description',
    },
    {
      property: 'clear()',
      type: '(): void',
      defaultValue: '—',
      descriptionKey: 'datePicker.api.clear.description',
    },
    {
      property: 'abortRangeDraft()',
      type: '(): void',
      defaultValue: '—',
      descriptionKey: 'datePicker.api.abortRangeDraft.description',
    },
    {
      property: 'removeDate(date)',
      type: '(date: Date): void',
      defaultValue: '—',
      descriptionKey: 'datePicker.api.removeDate.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const datePickerPageExamples = {
  basic: `<sanring-date-picker (selectedDateChange)="selectedDate = $event" />`,
  usageImport: `import { Component } from '@angular/core';
import { CALENDAR_LOCALE } from '@sanring/date-picker';
import { DatePickerComponent } from './components/ui/date-picker';

@Component({
  imports: [DatePickerComponent],
  providers: [
    {
      provide: CALENDAR_LOCALE,
      useValue: {
        weekStartsOn: 0,
        weekdayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthLabels: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ],
      },
    },
  ],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-date-picker
  granularity="month"
  mode="single"
  (selectedDateChange)="onSelect($event)"
/>`,
  matrix: `<sanring-date-picker
  #picker="sanringDatePicker"
  [granularity]="granularity"
  [mode]="mode"
  (selectedDateChange)="onSelect($event)"
  (selectedRangeChange)="onRangeSelect($event)"
  (selectedDatesChange)="onMultiSelect($event)"
/>
<button type="button" (click)="picker.clear()">清空</button>`,
  disabled: `const isPastYear = (date: Date) => date.getFullYear() < 2026;

<sanring-date-picker
  granularity="month"
  mode="single"
  [disabled]="isPastYear"
  (selectedDateChange)="onSelect($event)"
/>`,
  sizes: `<sanring-date-picker size="sm" />
<sanring-date-picker size="md" />
<sanring-date-picker size="lg" />`,
} as const;
