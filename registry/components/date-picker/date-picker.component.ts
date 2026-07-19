import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
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
import { Observable, Subject } from 'rxjs';
import { CalendarHeaderComponent } from '../calendar/calendar-header.component';
import { cn } from '../shared/utils';
import { FieldType, SanringFieldControl, SANRING_FIELD_CONTROL } from '../field/field.type';
import { DatePickerCellDirective } from './date-picker-cell.directive';
import { DatePickerSize, DatePickerValue } from './date-picker.type';

const DEFAULT_GRID_COLUMNS: Record<PickerGranularity, number> = {
  month: 3,
  quarter: 4,
  year: 3,
};

let nextDatePickerId = 0;

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
    // Same reason as Calendar/Checkbox/Combobox: `disabled`/`required`/`id` on
    // SanringFieldControl would collide with this component's own same-named @Inputs, so a
    // small adapter class translates between the two instead of implementing it directly.
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: DatePickerComponent) => new DatePickerFieldControlAdapter(host),
      deps: [forwardRef(() => DatePickerComponent)],
    },
  ],
  host: {
    tabindex: '0',
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
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  protected readonly engine = inject(GranularityPickerEngine);
  private readonly injectedLocale = inject(CALENDAR_LOCALE, { optional: true });
  private readonly injectedQuarterStartsOn = inject(CALENDAR_QUARTER_STARTS_ON, { optional: true });

  readonly class = input<string | undefined>();
  readonly id = input(`sanring-date-picker-${nextDatePickerId++}`);
  readonly size = input<DatePickerSize>('md');
  readonly locale = input<CalendarLocale | undefined>(undefined);
  readonly granularity = input<PickerGranularity>('month');
  readonly mode = input<'single' | 'range' | 'multi'>('single');
  readonly quarterLabels = input<readonly [string, string, string, string]>(['Q1', 'Q2', 'Q3', 'Q4']);
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

  // ==========================================
  // Field 整合：id/disabled/required 會跟上面同名的 @Input 撞名，走下面的 fieldXxx getter，
  // 由 DatePickerFieldControlAdapter 轉接成 SanringFieldControl 介面（見檔案底部）。
  // ==========================================
  focused = false;
  ngControl: NgControl | null = null;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly stateChangesSubject = new Subject<void>();
  readonly stateChanges = this.stateChangesSubject.asObservable();

  private readonly stateVersion = signal(0);
  private readonly fieldDescribedByIds = signal<string[]>([]);
  private readonly disabledState = signal(false);

  protected readonly computedAriaDescribedBy = computed(() => {
    const ids = [this.ariaDescribedBy(), ...this.fieldDescribedByIds()].filter(
      (v): v is string => !!v,
    );
    return ids.length ? ids.join(' ') : undefined;
  });

  // 表單層級的「整個控制項停用」跟既有的 disabled（哪些週期不可選）是兩件事——停用時額外疊一個
  // 永遠回傳 true 的 matcher，讓所有 cell 都不可選，而不是動到使用者自己傳入的 disabled matcher。
  private readonly effectiveDisabled = computed<DisabledInput | undefined>(() =>
    this.disabledState() ? () => true : this.disabled(),
  );

  get errorState(): boolean {
    this.stateVersion();
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

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

  get fieldRequired(): boolean {
    this.stateVersion();
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  private onChange: (value: DatePickerValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
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

    this.destroyRef.onDestroy(() => this.stateChangesSubject.complete());
  }

  ngOnInit(): void {
    // 跟 calendar/checkbox/select 一樣的原因：constructor 階段 self-inject NgControl 會跟
    // NgModel 搭配時觸發 NG0200 循環依賴，延後到 ngOnInit 才拿。
    this.ngControl = this.injector.get(NgControl, null, { optional: true, self: true });
    this.ngControl?.control?.events
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitStateChanges());
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

  protected onFocus(): void {
    this.focused = true;
    this.emitStateChanges();
  }

  protected onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    this.elementRef.nativeElement.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.fieldDescribedByIds.set(ids);
  }

  writeValue(value: DatePickerValue): void {
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

  registerOnChange(fn: (value: DatePickerValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
    this.emitStateChanges();
  }

  private emitStateChanges(): void {
    this.stateVersion.update((v) => v + 1);
    this.stateChangesSubject.next();
  }
}

class DatePickerFieldControlAdapter implements SanringFieldControl<DatePickerValue> {
  readonly controlType = FieldType.datePicker;

  constructor(private readonly host: DatePickerComponent) {}

  get id(): string {
    return this.host.id();
  }

  get value(): DatePickerValue {
    return this.host.fieldValue;
  }

  get empty(): boolean {
    return this.host.fieldEmpty;
  }

  get focused(): boolean {
    return this.host.focused;
  }

  get errorState(): boolean {
    return this.host.errorState;
  }

  get disabled(): boolean {
    return this.host.fieldDisabled;
  }

  get required(): boolean {
    return this.host.fieldRequired;
  }

  get ngControl(): NgControl | null {
    return this.host.ngControl;
  }

  get stateChanges(): Observable<void> {
    return this.host.stateChanges;
  }

  focus(options?: FocusOptions): void {
    this.host.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.host.setDescribedByIds(ids);
  }
}
