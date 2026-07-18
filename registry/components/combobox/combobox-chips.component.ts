import { Component, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-combobox-chips',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'chipsClass()',
  },
})
export class ComboboxChipsComponent {
  // 允許外部微調樣式
  readonly class = input<string | undefined>();

  protected readonly chipsClass = computed(() =>
    cn('flex flex-wrap items-center gap-1', this.class()),
  );
}
