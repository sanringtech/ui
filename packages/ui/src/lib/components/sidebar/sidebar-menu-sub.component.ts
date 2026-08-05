import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'sanring-sidebar-menu-sub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'list',
    '[class]': 'hostClass()',
  },
})
export class SidebarMenuSubComponent {
  private readonly sidebar = inject(SidebarComponent, { optional: true });

  readonly class = input<string | undefined>();

  private readonly isIconRail = computed(
    () => this.sidebar?.collapsible() === 'icon' && !this.sidebar.isOpen(),
  );

  protected readonly hostClass = computed(() =>
    cn(
      'ml-4 grid gap-1 border-l border-[var(--sanring-border)] py-1 pl-3',
      this.isIconRail() && 'hidden',
      this.class(),
    ),
  );
}
