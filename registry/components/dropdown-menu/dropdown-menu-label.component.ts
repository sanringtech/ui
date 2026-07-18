import { Component, booleanAttribute, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-dropdown-menu-label',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'presentation',
    '[class]': 'labelClass()',
  },
})
export class DropdownMenuLabelComponent {
  readonly class = input<string | undefined>();
  readonly inset = input(false, { transform: booleanAttribute });

  protected readonly labelClass = computed(() =>
    cn(
      'block px-2 py-1.5 text-xs font-medium text-[var(--sanring-muted)]',
      this.inset() && 'pl-8',
      this.class(),
    ),
  );
}
