import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-combobox-separator',
  standalone: true,
  template: ``,
  host: {
    role: 'separator',
    '[attr.aria-orientation]': '"horizontal"',
    '[class]': 'separatorClass()',
  },
})
export class ComboboxSeparatorComponent {
  readonly class = input<string | undefined>();

  protected readonly separatorClass = computed(() =>
    cn(
      'block h-px bg-[var(--sanring-border)]',
      'mx-1 my-1',
      this.class(),
    ),
  );
}
