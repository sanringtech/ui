import { Component, computed, inject, input } from '@angular/core';
import { ComboboxComponent } from './combobox.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-combobox-label',
  standalone: true,
  template: `
    <label [for]="combobox.inputId" [class]="labelClass()">
      <ng-content></ng-content>
    </label>
  `,
  // 讓 host 不佔空間，直接用內部的 label 撐起排版
  host: { style: 'display: contents;' },
})
export class ComboboxLabelComponent {
  readonly class = input<string | undefined>();

  // 🪄 依賴注入：連線大腦
  protected combobox = inject(ComboboxComponent);

  // 🎨 視覺排版：標準的表單標籤樣式
  protected readonly labelClass = computed(() =>
    cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.class(),
    ),
  );
}
