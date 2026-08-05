import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'sanring-sidebar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClass()',
  },
})
export class SidebarHeaderComponent {
  private readonly sidebar = inject(SidebarComponent, { optional: true });

  readonly class = input<string | undefined>();

  private readonly isIconRail = computed(
    () => this.sidebar?.collapsible() === 'icon' && !this.sidebar.isOpen(),
  );

  protected readonly hostClass = computed(() =>
    cn(
      'flex min-h-16 items-center gap-2 px-3 py-3',
      this.isIconRail() && 'justify-center px-2',
      this.class(),
    ),
  );
}
