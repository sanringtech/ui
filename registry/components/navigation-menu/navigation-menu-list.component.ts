import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { NavigationMenuComponent } from './navigation-menu.component';

@Component({
  selector: 'sanring-navigation-menu-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'list',
    '[attr.data-orientation]': 'navigationMenu.orientation()',
    '[class]': 'listClass()',
  },
  template: `<ng-content></ng-content>`,
})
export class NavigationMenuListComponent {
  protected readonly navigationMenu = inject(NavigationMenuComponent);
  readonly class = input<string | undefined>();

  protected readonly listClass = computed(() =>
    cn(
      'flex list-none items-center justify-center gap-1 p-0',
      this.navigationMenu.orientation() === 'vertical' && 'flex-col items-stretch justify-start',
      this.class(),
    ),
  );
}
