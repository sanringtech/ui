import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-sidebar-menu-sub-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'listitem',
    '[class]': 'hostClass()',
  },
})
export class SidebarMenuSubItemComponent {
  readonly class = input<string | undefined>();

  protected readonly hostClass = computed(() => cn('relative list-none', this.class()));
}
