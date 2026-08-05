import { Component, booleanAttribute, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-navigation-menu-separator',
  standalone: true,
  template: ``,
  host: {
    role: 'separator',
    '[attr.aria-orientation]': "vertical() ? 'vertical' : 'horizontal'",
    '[class]': 'separatorClass()',
  },
})
export class NavigationMenuSeparatorComponent {
  readonly class = input<string | undefined>();
  readonly vertical = input(false, { transform: booleanAttribute });

  protected readonly separatorClass = computed(() =>
    cn(
      this.vertical()
        ? 'mx-2 inline-block min-h-6 w-px shrink-0 bg-[var(--sanring-border)]'
        : 'my-2 block h-px w-full bg-[var(--sanring-border)]',
      this.class(),
    ),
  );
}
