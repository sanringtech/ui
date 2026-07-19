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
  CalendarDay,
  CalendarEngine,
  CalendarGridDirective,
  CalendarLocale,
  DateRange,
  DisabledInput,
} from '@sanring/date-picker';
import { Observable, Subject } from 'rxjs';
import { cn } from '../shared/utils';
import { CALENDAR_WEEKDAY_TEXT_CLASS } from '../shared/component-styles';
import { FieldType, SanringFieldControl, SANRING_FIELD_CONTROL } from '../field/field.type';
import { CalendarDayDirective } from './calendar-day.directive';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CalendarSize, CalendarValue } from './calendar.type';

let nextCalendarId = 0;

@Component({
  selector: 'sanring-calendar',
  standalone: true,
  exportAs: 'sanringCalendar',
  imports: [CalendarHeaderComponent, CalendarDayDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CalendarGridDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
    // Can't `useExisting: CalendarComponent` directly as SanringFieldControl: the interface's
    // `disabled`/`required`/`id` would collide with this component's own same-named @Inputs
    // (and this repo's eslint rules forbid renaming an @Input to dodge that) — so a small
    // adapter class translates between the two, same pattern as Checkbox/Combobox.
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: CalendarComponent) => new CalendarFieldControlAdapter(host),
      deps: [forwardRef(() => CalendarComponent)],
    },
  ],
  host: {
    tabindex: '0',
    '[id]': 'id()',
    '[class]': 'calendarClass()',
    '[attr.aria-required]': "required() ? 'true' : null",
    '[attr.aria-invalid]': "errorState ? 'true' : null",
    '[attr.aria-describedby]': 'computedAriaDescribedBy()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
  template: `
    <div [class]="engine.monthGrids().length > 1 ? 'flex gap-6' : 'block'">
      @for (monthGrid of engine.monthGrids(); track $index) {
        <div class="min-w-60 flex-1">
          <sanring-calendar-header
            [label]="monthLabel(monthGrid)"
            [showPrev]="$first"
            [showNext]="$last"
            [prevMonthLabel]="prevMonthLabel()"
            [nextMonthLabel]="nextMonthLabel()"
            (prev)="engine.prevMonth()"
            (next)="engine.nextMonth()"
          />

          <div class="mb-1 grid grid-cols-7 gap-1 text-center" role="row" aria-hidden="true">
            @for (label of weekdayLabels(); track $index) {
              <span [class]="weekdayTextClass">{{ label }}</span>
            }
          </div>

          <div
            class="grid grid-cols-7 gap-1"
            role="grid"
            [attr.aria-label]="monthLabel(monthGrid)"
          >
            @for (week of toWeeks(monthGrid); track $index) {
              <div role="row" class="contents">
                @for (day of week; track day.date.getTime()) {
                  <button type="button" role="gridcell" sanringCalendarDay [day]="day" [size]="size()">
                    {{ day.date.getDate() }}
                  </button>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
  protected readonly engine = inject(CalendarEngine);
  private readonly injectedLocale = inject(CALENDAR_LOCALE, { optional: true });

  readonly class = input<string | undefined>();
  readonly id = input(`sanring-calendar-${nextCalendarId++}`);
  readonly size = input<CalendarSize>('md');
  readonly locale = input<CalendarLocale | undefined>(undefined);
  readonly mode = input<'single' | 'range'>('single');
  readonly monthsToDisplay = input<number>(1);
  readonly disabled = input<DisabledInput | undefined>(undefined);
  readonly allowDeselect = input<boolean>(true);
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaDescribedBy = input<string | undefined>();
  readonly prevMonthLabel = input('上一月');
  readonly nextMonthLabel = input('下一月');

  readonly selectedDateChange = output<Date | null>();
  readonly selectedRangeChange = output<DateRange>();

  protected readonly calendarClass = computed(() =>
    cn(
      'block outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      this.class(),
    ),
  );

  protected readonly weekdayTextClass = CALENDAR_WEEKDAY_TEXT_CLASS;

  private readonly resolvedLocale = computed(() => this.locale() ?? this.injectedLocale);

  protected readonly weekdayLabels = computed(() => {
    const locale = this.resolvedLocale();
    if (!locale) return [];
    return [
      ...locale.weekdayLabels.slice(locale.weekStartsOn),
      ...locale.weekdayLabels.slice(0, locale.weekStartsOn),
    ];
  });

  // ==========================================
  // Field 整合：id/disabled/required 會跟上面同名的 @Input 撞名，走下面的 fieldXxx getter，
  // 由 CalendarFieldControlAdapter 轉接成 SanringFieldControl 介面（見檔案底部）。
  // ==========================================
  focused = false;
  ngControl: NgControl | null = null;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly stateChangesSubject = new Subject<void>();
  readonly stateChanges = this.stateChangesSubject.asObservable();

  // 橋接用：ngControl 的 invalid/touched 是 RxJS 驅動、不是 signal，靠這個計數器把它們接進
  // signal graph，errorState/fieldRequired 才能在驗證狀態改變時正確重算。
  private readonly stateVersion = signal(0);
  private readonly fieldDescribedByIds = signal<string[]>([]);
  private readonly disabledState = signal(false);

  protected readonly computedAriaDescribedBy = computed(() => {
    const ids = [this.ariaDescribedBy(), ...this.fieldDescribedByIds()].filter(
      (v): v is string => !!v,
    );
    return ids.length ? ids.join(' ') : undefined;
  });

  // 表單層級的「整個控制項停用」跟既有的 disabled（哪些日期不可選）是兩件事——停用時額外疊一個
  // 永遠回傳 true 的 matcher，讓所有日期都不可選，而不是動到使用者自己傳入的 disabled matcher。
  private readonly effectiveDisabled = computed<DisabledInput | undefined>(() =>
    this.disabledState() ? () => true : this.disabled(),
  );

  get errorState(): boolean {
    this.stateVersion();
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  get fieldValue(): CalendarValue {
    return this.mode() === 'range' ? this.engine.selectedRange() : this.engine.selectedDate();
  }

  get fieldEmpty(): boolean {
    if (this.mode() === 'range') return this.engine.selectedRange().start === null;
    return this.engine.selectedDate() === null;
  }

  get fieldDisabled(): boolean {
    return this.disabledState();
  }

  get fieldRequired(): boolean {
    this.stateVersion();
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  private onChange: (value: CalendarValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const locale = this.locale();
      if (locale) this.engine.setLocale(locale);
    });
    effect(() => this.engine.setSelectionMode(this.mode()));
    effect(() => this.engine.setMonthsToDisplay(this.monthsToDisplay()));
    effect(() => this.engine.setDisabled(this.effectiveDisabled()));
    effect(() => this.engine.setAllowDeselect(this.allowDeselect()));
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

    this.destroyRef.onDestroy(() => this.stateChangesSubject.complete());
  }

  ngOnInit(): void {
    // 跟 checkbox/select 一樣的原因：constructor 階段 self-inject NgControl 會跟 NgModel 搭配時
    // 觸發 NG0200 循環依賴（本元件同時透過 NG_VALUE_ACCESSOR 註冊自己），延後到 ngOnInit 才拿。
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

  protected monthLabel(days: readonly CalendarDay[]): string {
    const locale = this.resolvedLocale();
    if (!locale) return '';
    const current = days[7];
    return `${current.date.getFullYear()} ${locale.monthLabels[current.date.getMonth()]}`;
  }

  protected toWeeks(grid: readonly CalendarDay[]): CalendarDay[][] {
    const rows: CalendarDay[][] = [];
    for (let i = 0; i < 42; i += 7) rows.push(grid.slice(i, i + 7) as CalendarDay[]);
    return rows;
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

  writeValue(value: CalendarValue): void {
    if (this.mode() === 'range') {
      if (value && typeof value === 'object' && 'start' in value) {
        this.engine.setSelectedRange(value as DateRange);
      } else {
        this.engine.clearSelection();
      }
    } else if (value instanceof Date) {
      this.engine.setSelectedDate(value);
    } else {
      this.engine.clearSelection();
    }
  }

  registerOnChange(fn: (value: CalendarValue) => void): void {
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

class CalendarFieldControlAdapter implements SanringFieldControl<CalendarValue> {
  readonly controlType = FieldType.calendar;

  constructor(private readonly host: CalendarComponent) {}

  get id(): string {
    return this.host.id();
  }

  get value(): CalendarValue {
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
