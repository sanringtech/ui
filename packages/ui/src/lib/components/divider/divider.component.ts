import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { DividerInset } from './divider.type';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-divider',
  standalone: true,
  host: {
    role: 'separator',
    '[attr.aria-orientation]': "vertical() ? 'vertical' : 'horizontal'",
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'dividerClass()',
  },
  template: ``,
})
export class DividerComponent {
  readonly vertical = input(false, { transform: booleanAttribute });
  readonly inset = input<DividerInset>('none');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly class = input<string | undefined>(undefined);

  protected readonly dividerClass = computed(() => {
    if (this.vertical()) {
      return cn('inline-block min-h-4 w-px shrink-0 self-stretch bg-[var(--sanring-border)]', this.class());
    }

    return cn('block h-px bg-[var(--sanring-border)]', this.insetClass(), this.class());
  });

  private readonly insetClass = computed(() => {
    const insetClasses: Record<DividerInset, string> = {
      none: 'w-full',
      start: 'ml-10 w-[calc(100%-2.5rem)]',
      end: 'mr-10 w-[calc(100%-2.5rem)]',
      both: 'mx-10 w-[calc(100%-5rem)]',
    };

    return insetClasses[this.inset()];
  });
}
