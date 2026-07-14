import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const calendarPage = {
  componentId: 'calendar',
  titleKey: 'component.calendar',
  descriptionKey: 'calendar.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'calendar.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'calendar.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'calendar.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'calendar.examples.description',
      level: 2,
      children: [
        {
          id: 'example-basic',
          titleKey: 'calendar.demo.basic',
          descriptionKey: 'calendar.demo.basic.description',
          level: 3,
        },
        {
          id: 'example-no-deselect',
          titleKey: 'calendar.demo.noDeselect',
          descriptionKey: 'calendar.demo.noDeselect.description',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'calendar.demo.disabled',
          descriptionKey: 'calendar.demo.disabled.description',
          level: 3,
        },
        {
          id: 'example-range',
          titleKey: 'calendar.demo.range',
          descriptionKey: 'calendar.demo.range.description',
          level: 3,
        },
        {
          id: 'example-multi-month',
          titleKey: 'calendar.demo.multiMonth',
          descriptionKey: 'calendar.demo.multiMonth.description',
          level: 3,
        },
        {
          id: 'example-sizes',
          titleKey: 'calendar.demo.sizes',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'calendar.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'calendar.api.class.description',
    },
    {
      property: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      descriptionKey: 'calendar.api.size.description',
    },
    {
      property: 'locale',
      type: 'CalendarLocale | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'calendar.api.locale.description',
    },
    {
      property: 'mode',
      type: "'single' | 'range'",
      defaultValue: "'single'",
      descriptionKey: 'calendar.api.mode.description',
    },
    {
      property: 'monthsToDisplay',
      type: 'number',
      defaultValue: '1',
      descriptionKey: 'calendar.api.monthsToDisplay.description',
    },
    {
      property: 'disabled',
      type: 'DisabledInput | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'calendar.api.disabled.description',
    },
    {
      property: 'allowDeselect',
      type: 'boolean',
      defaultValue: 'true',
      descriptionKey: 'calendar.api.allowDeselect.description',
    },
    {
      property: 'prevMonthLabel',
      type: 'string',
      defaultValue: "'上一月'",
      descriptionKey: 'calendar.api.prevMonthLabel.description',
    },
    {
      property: 'nextMonthLabel',
      type: 'string',
      defaultValue: "'下一月'",
      descriptionKey: 'calendar.api.nextMonthLabel.description',
    },
    {
      property: 'selectedDateChange',
      type: 'EventEmitter<Date | null>',
      defaultValue: '—',
      descriptionKey: 'calendar.api.selectedDateChange.description',
    },
    {
      property: 'selectedRangeChange',
      type: 'EventEmitter<DateRange>',
      defaultValue: '—',
      descriptionKey: 'calendar.api.selectedRangeChange.description',
    },
    {
      property: 'isDraftActive',
      type: 'Signal<boolean>',
      defaultValue: '—',
      descriptionKey: 'calendar.api.isDraftActive.description',
    },
    {
      property: 'clear()',
      type: '(): void',
      defaultValue: '—',
      descriptionKey: 'calendar.api.clear.description',
    },
    {
      property: 'abortRangeDraft()',
      type: '(): void',
      defaultValue: '—',
      descriptionKey: 'calendar.api.abortRangeDraft.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const calendarPageExamples = {
  basic: `<sanring-calendar (selectedDateChange)="selectedDate = $event" />`,
  usageImport: `import { Component } from '@angular/core';
import { CALENDAR_LOCALE } from '@sanring/date-picker';
import { CalendarComponent } from '@sanring/ui';

@Component({
  imports: [CalendarComponent],
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
  usageMain: `<sanring-calendar (selectedDateChange)="onSelect($event)" />`,
  scenarioBasic: `<sanring-calendar (selectedDateChange)="onSelect($event)" />`,
  noDeselect: `<sanring-calendar [allowDeselect]="false" (selectedDateChange)="onSelect($event)" />`,
  disabled: `const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
const summerBreak = { from: new Date(2026, 6, 20), to: new Date(2026, 6, 24) };

<sanring-calendar
  [allowDeselect]="false"
  [disabled]="[isWeekend, summerBreak]"
  (selectedDateChange)="onSelect($event)"
/>`,
  range: `<sanring-calendar
  mode="range"
  #cal="sanringCalendar"
  (selectedRangeChange)="onRangeSelect($event)"
/>
<button type="button" (click)="cal.abortRangeDraft()">中止草稿</button>`,
  multiMonth: `<sanring-calendar
  mode="range"
  [monthsToDisplay]="2"
  (selectedRangeChange)="onRangeSelect($event)"
/>`,
  sizes: `<sanring-calendar size="sm" />
<sanring-calendar size="md" />
<sanring-calendar size="lg" />`,
} as const;
