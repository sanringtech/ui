import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-dropdown-menu-separator',
  standalone: true,
  template: ``,
  host: {
    role: 'separator',
    'aria-orientation': 'horizontal',
    '[class]': 'separatorClass()',
  },
})
export class DropdownMenuSeparatorComponent {
  readonly class = input<string | undefined>();

  protected readonly separatorClass = computed(() =>
    cn(
      '-mx-1 my-1 h-px bg-[var(--sanring-border)]',
      this.class(),
    ),
  );
}
