import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { NavigationMenuComponent } from './navigation-menu.component';
import { NavigationMenuItemComponent } from './navigation-menu-item.component';

@Component({
  selector: 'sanring-navigation-menu-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[attr.data-state]': 'isVisible() ? "open" : "closed"',
    '[hidden]': '!isVisible()',
    '[class]': 'indicatorClass()',
  },
  template: ``,
})
export class NavigationMenuIndicatorComponent {
  protected readonly navigationMenu = inject(NavigationMenuComponent);
  protected readonly item = inject(NavigationMenuItemComponent, { optional: true });

  readonly class = input<string | undefined>();

  protected readonly isVisible = computed(() =>
    this.item ? this.item.isOpen() : this.navigationMenu.value() !== null,
  );

  protected readonly indicatorClass = computed(() =>
    cn(
      'absolute top-full z-50 mt-1 size-3 rotate-45 rounded-[var(--sanring-radius-xs)]',
      'border-l border-t border-[var(--sanring-border)] bg-[var(--sanring-elevated)]',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      this.class(),
    ),
  );
}
