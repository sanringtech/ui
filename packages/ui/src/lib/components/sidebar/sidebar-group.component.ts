import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-sidebar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClass()',
  },
})
export class SidebarGroupComponent {
  readonly class = input<string | undefined>();

  protected readonly hostClass = computed(() =>
    cn('relative flex w-full min-w-0 flex-col gap-1', this.class()),
  );
}
