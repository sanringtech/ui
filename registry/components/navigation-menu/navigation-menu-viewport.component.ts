import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { NavigationMenuComponent } from './navigation-menu.component';

@Component({
  selector: 'sanring-navigation-menu-viewport',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-state]': 'navigationMenu.value() ? "open" : "closed"',
    '[hidden]': '!navigationMenu.value()',
    '[class]': 'viewportClass()',
  },
  template: `<ng-content></ng-content>`,
})
export class NavigationMenuViewportComponent {
  protected readonly navigationMenu = inject(NavigationMenuComponent);

  readonly class = input<string | undefined>();

  protected readonly viewportClass = computed(() =>
    cn(
      'absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 overflow-hidden rounded-[var(--sanring-radius-lg)]',
      'border border-[var(--sanring-border)] bg-[var(--sanring-elevated)] text-[var(--sanring-foreground)] shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      this.class(),
    ),
  );
}
