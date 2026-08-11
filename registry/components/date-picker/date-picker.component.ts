import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
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
} from '@sanring/date-picker-core';
import { CalendarHeaderComponent } from '../calendar/calendar-header.component';
import { cn } from '../shared/utils';
import { SanringCvaBase, SanringFieldControlAdapter } from '../shared/cva-base';
import { FieldType, SANRING_FIELD_CONTROL } from '../field/field.type';
import { DatePickerCellDirective } from './date-picker-cell.directive';
import { DatePickerSize, DatePickerValue } from './date-picker.type';

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
  providers: [
    GranularityPickerEngine,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: DatePickerComponent) => new SanringFieldControlAdapter(FieldType.datePicker, host),
      deps: [forwardRef(() => DatePickerComponent)],
    },
  ],
  host: {
    tabindex: '0',
    // role="radiogroup": this outer element carries aria-required/aria-invalid/
    // aria-describedby for Angular Forms/sanring-field integration, but those
    // are only valid ARIA on specific roles (combobox, gridcell, listbox,
    // radiogroup, spinbutton, textbox, tree) — a bare div (role="generic")
    // doesn't support them, which axe-core's aria-allowed-attr rule catches.
    // radiogroup is the closest fit semantically too: picking exactly one
    // date from a set of cells.
    role: 'radiogroup',
    '[id]': 'id()',
    '[class]': 'datePickerClass()',
    '[attr.aria-required]': "required() ? 'true' : null",
    '[attr.aria-invalid]': "errorState ? 'true' : null",
    '[attr.aria-describedby]': 'computedAriaDescribedBy()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
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
      @for (row of gridRows(); track $index) {
        <!-- display:contents keeps this row grouping invisible to CSS Grid layout
             (cells still line up in the parent's grid tracks) while satisfying
             the ARIA grid pattern's requirement that gridcells sit inside a row. -->
        <div role="row" class="contents">
          @for (cell of row; track cell.date.getTime()) {
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
      }
    </div>
  `,
})
export class DatePickerComponent extends SanringCvaBase<DatePickerValue> {
  protected readonly engine = inject(GranularityPickerEngine);
  private readonly injectedLocale = inject(CALENDAR_LOCALE, { optional: true });
  private readonly injectedQuarterStartsOn = inject(CALENDAR_QUARTER_STARTS_ON, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<string | undefined>();
  readonly id = input(inject(_IdGenerator).getId('sanring-date-picker-', true));
  readonly size = input<DatePickerSize>('md');
  readonly locale = input<CalendarLocale | undefined>(undefined);
  readonly granularity = input<PickerGranularity>('month');
  readonly mode = input<'single' | 'range' | 'multi'>('single');
  readonly quarterLabels = input<readonly [string, string, string, string]>([
    'Q1',
    'Q2',
    'Q3',
    'Q4',
  ]);
  readonly yearsToDisplay = input<number>(12);
  readonly gridColumns = input<number | undefined>(undefined);
  readonly disabled = input<DisabledInput | undefined>(undefined);
  readonly allowDeselect = input<boolean>(true);
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaDescribedBy = input<string | undefined>();
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

  // Chunked into ARIA "row" groups (see template) — engine.granularityGrids()
  // itself is a flat cell list, since the CSS grid layout doesn't need rows.
  protected readonly gridRows = computed(() => {
    const cells = this.engine.granularityGrids();
    const columns = this.resolvedGridColumns();
    const rows: GranularityCell[][] = [];
    for (let i = 0; i < cells.length; i += columns) {
      rows.push(cells.slice(i, i + columns));
    }
    return rows;
  });

  // 表單層級的「整個控制項停用」跟既有的 disabled（哪些週期不可選）是兩件事——停用時額外疊一個
  // 永遠回傳 true 的 matcher，讓所有 cell 都不可選，而不是動到使用者自己傳入的 disabled matcher。
  private readonly effectiveDisabled = computed<DisabledInput | undefined>(() =>
    this.disabledState() ? () => true : this.disabled(),
  );

  protected readonly computedAriaDescribedBy = this.makeComputedAriaDescribedBy(this.ariaDescribedBy);

  get fieldValue(): DatePickerValue {
    switch (this.mode()) {
      case 'range':
        return this.engine.selectedRange();
      case 'multi':
        return this.engine.selectedDates();
      default:
        return this.engine.selectedDate();
    }
  }

  get fieldEmpty(): boolean {
    switch (this.mode()) {
      case 'range':
        return this.engine.selectedRange().start === null;
      case 'multi':
        return this.engine.selectedDates().length === 0;
      default:
        return this.engine.selectedDate() === null;
    }
  }

  get fieldDisabled(): boolean {
    return this.disabledState();
  }

  protected override hasInputRequired(): boolean {
    return this.required();
  }

  constructor() {
    super();
    effect(() => this.engine.setSelectionGranularity(this.granularity()));
    effect(() => this.engine.setSelectionMode(this.mode()));
    effect(() => this.engine.setYearsToDisplay(this.yearsToDisplay()));
    effect(() => this.engine.setGridColumns(this.resolvedGridColumns()));
    effect(() => this.engine.setDisabled(this.effectiveDisabled()));
    effect(() => this.engine.setAllowDeselect(this.allowDeselect()));
    effect(() => this.engine.setRangePeriodCountLimit(this.rangePeriodCountLimit()));
    effect(() => {
      const date = this.engine.selectedDate();
      this.selectedDateChange.emit(date);
      if (this.mode() === 'single') {
        this.onChange(date);
        this.emitStateChanges();
      }
    });
    effect(() => {
      const range = this.engine.selectedRange();
      this.selectedRangeChange.emit(range);
      if (this.mode() === 'range') {
        this.onChange(range);
        this.emitStateChanges();
      }
    });
    effect(() => {
      const dates = this.engine.selectedDates();
      this.selectedDatesChange.emit(dates);
      if (this.mode() === 'multi') {
        this.onChange(dates);
        this.emitStateChanges();
      }
    });
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

  focus(options?: FocusOptions): void {
    this.elementRef.nativeElement.focus(options);
  }

  override writeValue(value: DatePickerValue): void {
    switch (this.mode()) {
      case 'range':
        if (value && typeof value === 'object' && 'start' in value) {
          this.engine.setSelectedRange(value as DateRange);
        } else {
          this.engine.clearSelection();
        }
        break;
      case 'multi':
        this.engine.setSelectedDates(Array.isArray(value) ? value : []);
        break;
      default:
        if (value instanceof Date) this.engine.setSelectedDate(value);
        else this.engine.clearSelection();
    }
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
