import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'sanring-sidebar-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'list',
    '[class]': 'hostClass()',
  },
})
export class SidebarMenuComponent {
  private readonly sidebar = inject(SidebarComponent, { optional: true });

  readonly class = input<string | undefined>();

  private readonly isIconRail = computed(
    () => this.sidebar?.collapsible() === 'icon' && !this.sidebar.isOpen(),
  );

  protected readonly hostClass = computed(() =>
    cn('flex w-full min-w-0 flex-col gap-1', this.isIconRail() && 'items-center', this.class()),
  );
}
