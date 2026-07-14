import { Directive, HostListener, computed, inject, input } from '@angular/core';
import { CalendarDay, CalendarEngine } from '@sanring/date-picker';
import { cn } from '../../utils';
import { CALENDAR_DAY_SIZE_CLASSES } from '../component-styles';
import { CalendarSize } from './calendar.type';

@Directive({
  selector: 'button[sanringCalendarDay]',
  standalone: true,
  host: {
    '[disabled]': 'day().isDisabled',
    '[attr.aria-selected]': "day().isSelected ? 'true' : null",
    '[attr.aria-disabled]': "day().isDisabled ? 'true' : null",
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'dayClass()',
  },
})
export class CalendarDayDirective {
  private readonly engine = inject(CalendarEngine);

  readonly day = input.required<CalendarDay>();
  readonly size = input<CalendarSize>('md');
  readonly class = input<string | undefined>();

  protected readonly ariaLabel = computed(() => {
    const { date } = this.day();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  });

  protected readonly dayClass = computed(() => {
    const day = this.day();
    return cn(
      'aspect-square inline-flex items-center justify-center rounded-[var(--sanring-radius-sm)] transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through',
      CALENDAR_DAY_SIZE_CLASSES[this.size()],
      !day.isCurrentMonth && !day.isSelected && !day.isInRange && 'text-[var(--sanring-muted)]',
      day.isCurrentMonth && !day.isSelected && 'text-[var(--sanring-foreground)]',
      day.isSelected && 'bg-primary text-primary-foreground',
      day.isInRange && !day.isSelected && 'bg-primary/20',
      day.isFocused && 'ring-2 ring-primary',
      day.isToday && !day.isSelected && 'font-bold',
      !day.isSelected &&
        !day.isDisabled &&
        !day.isInRange &&
        'hover:bg-[var(--sanring-surface-strong)]',
      (day.isSelected || day.isInRange) && !day.isDisabled && 'hover:brightness-95',
      !day.isDisabled && 'active:brightness-90',
      this.class(),
    );
  });

  @HostListener('click')
  protected onClick(): void {
    this.engine.selectDate(this.day().date);
  }
}
