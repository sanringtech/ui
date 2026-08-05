import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'sanring-sidebar-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'listitem',
    '[class]': 'hostClass()',
  },
})
export class SidebarMenuItemComponent {
  private readonly sidebar = inject(SidebarComponent, { optional: true });

  readonly class = input<string | undefined>();

  private readonly isIconRail = computed(
    () => this.sidebar?.collapsible() === 'icon' && !this.sidebar.isOpen(),
  );

  protected readonly hostClass = computed(() =>
    cn('relative list-none', this.isIconRail() && 'flex justify-center', this.class()),
  );
}
