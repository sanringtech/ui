import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-select-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group', // 💡 W3C 標準：宣告這是一個選項群組
    '[class]': 'groupClass()',
  },
  template: `<ng-content></ng-content>`, // 💡 供 SelectLabel 和 SelectItem 投影
})
export class SelectGroupComponent {
  readonly class = input<string | undefined>();

  protected readonly groupClass = computed(
    () => cn('p-1-exclude', this.class()), // 通常不需要太多複雜樣式，主要作為容器
  );
}
