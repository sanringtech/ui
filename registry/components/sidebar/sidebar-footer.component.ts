import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'sanring-sidebar-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClass()',
  },
})
export class SidebarFooterComponent {
  private readonly sidebar = inject(SidebarComponent, { optional: true });

  readonly class = input<string | undefined>();

  private readonly isIconRail = computed(
    () => this.sidebar?.collapsible() === 'icon' && !this.sidebar.isOpen(),
  );

  protected readonly hostClass = computed(() =>
    cn('flex flex-col gap-2 px-2 py-3', this.isIconRail() && 'items-center', this.class()),
  );
}
