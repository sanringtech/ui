import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-sidebar-group-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClass()',
  },
})
export class SidebarGroupContentComponent {
  readonly class = input<string | undefined>();

  protected readonly hostClass = computed(() => cn('grid gap-1', this.class()));
}
