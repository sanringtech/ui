import { Directive, inject } from '@angular/core';
import { ComboboxComponent } from './combobox.component';

// 讓任何元素（通常是按鈕）都能當作 Combobox 的觸發器——搭配 `#combo="sanringCombobox"`
// 在 @if (combo.isOpen()) 裡切換顯示 trigger 或 input，就能組出「Select 樣式收合、點擊展開成搜尋框」的效果
@Directive({
  selector: '[sanringComboboxTrigger]',
  standalone: true,
  host: {
    type: 'button',
    role: 'combobox',
    '[attr.aria-expanded]': 'combobox.isOpen()',
    '[attr.aria-controls]': 'combobox.listId',
    '[attr.disabled]': 'combobox.disabled() ? true : null',
    '(click)': 'onClick()',
  },
})
export class ComboboxTriggerDirective {
  protected readonly combobox = inject(ComboboxComponent);

  protected onClick(): void {
    this.combobox.toggleOpen(true);
  }
}
