import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'sanring-sidebar-menu-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClass()',
  },
})
export class SidebarMenuBadgeComponent {
  private readonly sidebar = inject(SidebarComponent, { optional: true });

  readonly class = input<string | undefined>();

  private readonly isIconRail = computed(
    () => this.sidebar?.collapsible() === 'icon' && !this.sidebar.isOpen(),
  );

  protected readonly hostClass = computed(() =>
    cn(
      'pointer-events-none absolute right-2 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-[var(--sanring-radius-xs)] px-1 text-xs font-medium',
      'text-[var(--sanring-muted-foreground)]',
      this.isIconRail() && 'hidden',
      this.class(),
    ),
  );
}
