import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-context-menu-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'group',
    '[class]': 'groupClass()',
  },
})
export class ContextMenuGroupComponent {
  readonly class = input<string | undefined>();

  protected readonly groupClass = computed(() => cn('py-1', this.class()));
}
