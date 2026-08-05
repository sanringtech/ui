import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'sanring-sidebar-group-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClass()',
  },
})
export class SidebarGroupLabelComponent {
  private readonly sidebar = inject(SidebarComponent, { optional: true });

  readonly class = input<string | undefined>();

  private readonly isIconRail = computed(
    () => this.sidebar?.collapsible() === 'icon' && !this.sidebar.isOpen(),
  );

  protected readonly hostClass = computed(() =>
    cn(
      'flex h-8 shrink-0 items-center px-2 text-xs font-medium text-[var(--sanring-muted-foreground)]',
      this.isIconRail() && 'hidden',
      this.class(),
    ),
  );
}
