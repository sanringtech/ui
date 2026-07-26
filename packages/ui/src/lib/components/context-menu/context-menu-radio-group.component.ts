import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-context-menu-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'group',
    '[class]': 'groupClass()',
  },
})
export class ContextMenuRadioGroupComponent {
  readonly class = input<string | undefined>();
  readonly value = model<string | undefined>(undefined);

  protected readonly groupClass = computed(() => cn('py-1', this.class()));
}
