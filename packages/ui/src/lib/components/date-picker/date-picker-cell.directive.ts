import { Directive, HostListener, computed, inject, input } from '@angular/core';
import { GranularityCell, GranularityPickerEngine } from '@sanring/date-picker';
import { cn } from '../../utils';
import { GRANULARITY_CELL_SIZE_CLASSES } from '../component-styles';
import { DatePickerSize } from './date-picker.type';

@Directive({
  selector: 'button[sanringDatePickerCell]',
  standalone: true,
  host: {
    '[disabled]': 'cell().isDisabled',
    '[attr.aria-selected]': "cell().isSelected ? 'true' : null",
    '[attr.aria-disabled]': "cell().isDisabled ? 'true' : null",
    '[attr.aria-label]': 'label()',
    '[class]': 'cellClass()',
  },
})
export class DatePickerCellDirective {
  private readonly engine = inject(GranularityPickerEngine);

  readonly cell = input.required<GranularityCell>();
  readonly label = input.required<string>();
  readonly size = input<DatePickerSize>('md');
  readonly class = input<string | undefined>();

  protected readonly cellClass = computed(() => {
    const cell = this.cell();
    return cn(
      'inline-flex items-center justify-center rounded-[var(--sanring-radius-sm)] transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through',
      GRANULARITY_CELL_SIZE_CLASSES[this.size()],
      !cell.isSelected && !cell.isInRange && 'text-[var(--sanring-foreground)]',
      cell.isSelected && 'bg-primary text-primary-foreground',
      cell.isInRange && !cell.isSelected && 'bg-primary/20',
      cell.isFocused && 'ring-2 ring-primary',
      cell.isCurrentPeriod && !cell.isSelected && 'font-bold',
      !cell.isSelected &&
        !cell.isDisabled &&
        !cell.isInRange &&
        'hover:bg-[var(--sanring-surface-strong)]',
      (cell.isSelected || cell.isInRange) && !cell.isDisabled && 'hover:brightness-95',
      !cell.isDisabled && 'active:brightness-90',
      this.class(),
    );
  });

  @HostListener('click')
  protected onClick(): void {
    this.engine.selectDate(this.cell().date);
  }
}
