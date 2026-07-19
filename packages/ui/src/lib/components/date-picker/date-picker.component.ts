import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  CALENDAR_LOCALE,
  CALENDAR_QUARTER_STARTS_ON,
  CalendarLocale,
  DateRange,
  DisabledInput,
  GranularityCell,
  GranularityGridDirective,
  GranularityPickerEngine,
  PickerGranularity,
  QuarterStartMonth,
  RangePeriodCountLimit,
} from '@sanring/date-picker';
import { CalendarHeaderComponent } from '../calendar/calendar-header.component';
import { cn } from '../../utils';
import { DatePickerCellDirective } from './date-picker-cell.directive';
import { DatePickerSize } from './date-picker.type';

const DEFAULT_GRID_COLUMNS: Record<PickerGranularity, number> = {
  month: 3,
  quarter: 4,
  year: 3,
};

function quarterIndexOf(date: Date, quarterStartMonth: QuarterStartMonth): number {
  return Math.floor(((date.getMonth() - quarterStartMonth + 12) % 12) / 3);
}

@Component({
  selector: 'sanring-date-picker',
  standalone: true,
  exportAs: 'sanringDatePicker',
  imports: [CalendarHeaderComponent, DatePickerCellDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [GranularityGridDirective],
  providers: [GranularityPickerEngine],
  host: {
    tabindex: '0',
    '[class]': 'datePickerClass()',
  },
  template: `
    <sanring-calendar-header
      [label]="headerLabel()"
      [prevMonthLabel]="prevYearLabel()"
      [nextMonthLabel]="nextYearLabel()"
      (prev)="engine.prevYear()"
      (next)="engine.nextYear()"
    />

    <div
      class="grid gap-1"
      role="grid"
      [style.grid-template-columns]="'repeat(' + resolvedGridColumns() + ', minmax(0, 1fr))'"
      [attr.aria-label]="headerLabel()"
    >
      @for (cell of engine.granularityGrids(); track cell.date.getTime()) {
        <button
          type="button"
          role="gridcell"
          sanringDatePickerCell
          [cell]="cell"
          [size]="size()"
          [label]="cellLabel(cell)"
        >
          {{ cellLabel(cell) }}
        </button>
      }
    </div>
  `,
})
export class DatePickerComponent {
  protected readonly engine = inject(GranularityPickerEngine);
  private readonly injectedLocale = inject(CALENDAR_LOCALE, { optional: true });
  private readonly injectedQuarterStartsOn = inject(CALENDAR_QUARTER_STARTS_ON, { optional: true });

  readonly class = input<string | undefined>();
  readonly size = input<DatePickerSize>('md');
  readonly locale = input<CalendarLocale | undefined>(undefined);
  readonly granularity = input<PickerGranularity>('month');
  readonly mode = input<'single' | 'range' | 'multi'>('single');
  readonly quarterLabels = input<readonly [string, string, string, string]>(['Q1', 'Q2', 'Q3', 'Q4']);
  readonly yearsToDisplay = input<number>(12);
  readonly gridColumns = input<number | undefined>(undefined);
  readonly disabled = input<DisabledInput | undefined>(undefined);
  readonly allowDeselect = input<boolean>(true);
  readonly rangePeriodCountLimit = input<RangePeriodCountLimit | undefined>(undefined);
  readonly prevYearLabel = input('上一年');
  readonly nextYearLabel = input('下一年');

  readonly selectedDateChange = output<Date | null>();
  readonly selectedRangeChange = output<DateRange>();
  readonly selectedDatesChange = output<Date[]>();

  protected readonly datePickerClass = computed(() =>
    cn(
      'block outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      this.class(),
    ),
  );

  private readonly resolvedLocale = computed(() => this.locale() ?? this.injectedLocale);
  private readonly resolvedQuarterStartsOn = computed(
    () => this.injectedQuarterStartsOn ?? (0 as QuarterStartMonth),
  );

  protected readonly resolvedGridColumns = computed(
    () => this.gridColumns() ?? DEFAULT_GRID_COLUMNS[this.granularity()],
  );

  constructor() {
    effect(() => this.engine.setSelectionGranularity(this.granularity()));
    effect(() => this.engine.setSelectionMode(this.mode()));
    effect(() => this.engine.setYearsToDisplay(this.yearsToDisplay()));
    effect(() => this.engine.setGridColumns(this.resolvedGridColumns()));
    effect(() => this.engine.setDisabled(this.disabled()));
    effect(() => this.engine.setAllowDeselect(this.allowDeselect()));
    effect(() => this.engine.setRangePeriodCountLimit(this.rangePeriodCountLimit()));
    effect(() => this.selectedDateChange.emit(this.engine.selectedDate()));
    effect(() => this.selectedRangeChange.emit(this.engine.selectedRange()));
    effect(() => this.selectedDatesChange.emit(this.engine.selectedDates()));
  }

  readonly isDraftActive = computed(() => this.engine.isDraftActive());

  clear(): void {
    this.engine.clearSelection();
  }

  abortRangeDraft(): void {
    this.engine.abortRangeDraft();
  }

  removeDate(date: Date): void {
    this.engine.removeDate(date);
  }

  protected headerLabel(): string {
    const grid = this.engine.granularityGrids();
    if (grid.length === 0) return '';
    if (this.granularity() === 'year') {
      return `${grid[0].date.getFullYear()}–${grid[grid.length - 1].date.getFullYear()}`;
    }
    return `${grid[0].date.getFullYear()}`;
  }

  protected cellLabel(cell: GranularityCell): string {
    switch (this.granularity()) {
      case 'month': {
        const locale = this.resolvedLocale();
        return locale ? locale.monthLabels[cell.date.getMonth()] : `${cell.date.getMonth() + 1}`;
      }
      case 'quarter': {
        const index = quarterIndexOf(cell.date, this.resolvedQuarterStartsOn());
        return this.quarterLabels()[index];
      }
      case 'year':
        return `${cell.date.getFullYear()}`;
    }
  }
}
