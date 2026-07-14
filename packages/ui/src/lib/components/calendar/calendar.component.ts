import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import {
  CALENDAR_LOCALE,
  CalendarDay,
  CalendarEngine,
  CalendarGridDirective,
  CalendarLocale,
  DateRange,
  DisabledInput,
} from '@sanring/date-picker';
import { cn } from '../../utils';
import { CALENDAR_WEEKDAY_TEXT_CLASS } from '../component-styles';
import { CalendarDayDirective } from './calendar-day.directive';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CalendarSize } from './calendar.type';

@Component({
  selector: 'sanring-calendar',
  standalone: true,
  exportAs: 'sanringCalendar',
  imports: [CalendarHeaderComponent, CalendarDayDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CalendarGridDirective],
  host: {
    tabindex: '0',
    '[class]': 'calendarClass()',
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
export class CalendarComponent {
  protected readonly engine = inject(CalendarEngine);
  private readonly injectedLocale = inject(CALENDAR_LOCALE, { optional: true });

  readonly class = input<string | undefined>();
  readonly size = input<CalendarSize>('md');
  readonly locale = input<CalendarLocale | undefined>(undefined);
  readonly mode = input<'single' | 'range'>('single');
  readonly monthsToDisplay = input<number>(1);
  readonly disabled = input<DisabledInput | undefined>(undefined);
  readonly allowDeselect = input<boolean>(true);
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

  constructor() {
    effect(() => {
      const locale = this.locale();
      if (locale) this.engine.setLocale(locale);
    });
    effect(() => this.engine.setSelectionMode(this.mode()));
    effect(() => this.engine.setMonthsToDisplay(this.monthsToDisplay()));
    effect(() => this.engine.setDisabled(this.disabled()));
    effect(() => this.engine.setAllowDeselect(this.allowDeselect()));
    effect(() => this.selectedDateChange.emit(this.engine.selectedDate()));
    effect(() => this.selectedRangeChange.emit(this.engine.selectedRange()));
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
}
