import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { ButtonDirective } from '../button/button.directive';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-calendar-header',
  standalone: true,
  imports: [ButtonDirective, LucideChevronLeft, LucideChevronRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'headerClass()',
  },
  template: `
    @if (showPrev()) {
      <button
        sanringBtn
        variant="ghost"
        size="icon"
        type="button"
        class="active:brightness-90"
        [attr.aria-label]="prevMonthLabel()"
        (click)="prev.emit()"
      >
        <svg lucideChevronLeft [size]="18"></svg>
      </button>
    } @else {
      <span class="size-9"></span>
    }

    <span class="font-semibold text-[var(--sanring-foreground)]">{{ label() }}</span>

    @if (showNext()) {
      <button
        sanringBtn
        variant="ghost"
        size="icon"
        type="button"
        class="active:brightness-90"
        [attr.aria-label]="nextMonthLabel()"
        (click)="next.emit()"
      >
        <svg lucideChevronRight [size]="18"></svg>
      </button>
    } @else {
      <span class="size-9"></span>
    }
  `,
})
export class CalendarHeaderComponent {
  readonly label = input.required<string>();
  readonly showPrev = input(true);
  readonly showNext = input(true);
  readonly prevMonthLabel = input('上一月');
  readonly nextMonthLabel = input('下一月');
  readonly class = input<string | undefined>();

  readonly prev = output<void>();
  readonly next = output<void>();

  protected readonly headerClass = computed(() =>
    cn('mb-4 flex items-center justify-between', this.class()),
  );
}
