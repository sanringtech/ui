import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-navigation-menu-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'labelClass()',
  },
  template: `<ng-content></ng-content>`,
})
export class NavigationMenuLabelComponent {
  readonly class = input<string | undefined>();

  protected readonly labelClass = computed(() =>
    cn(
      'block min-w-0 truncate text-sm font-medium leading-none text-[var(--sanring-foreground)]',
      this.class(),
    ),
  );
}
