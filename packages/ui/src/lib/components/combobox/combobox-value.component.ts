import { Component, computed, inject, input } from '@angular/core';
import { ComboboxComponent } from './combobox.component';

@Component({
  selector: 'sanring-combobox-value',
  standalone: true,
  template: `
    @if (isEmpty()) {
      <span class="text-muted-foreground">{{ placeholder() }}</span>
    } @else {
      <ng-content></ng-content>
    }
  `,
  host: { style: 'display: contents;' },
})
export class ComboboxValueComponent {
  readonly placeholder = input<string>('請選擇...');

  // 必須連線到大腦！這就是它跟 Badge 最大的不同
  protected combobox = inject(ComboboxComponent);

  protected readonly isEmpty = computed(() => {
    const val = this.combobox.value();
    return val === null || (Array.isArray(val) && val.length === 0);
  });
}
