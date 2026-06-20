import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: `label[sanringLabel]`,
  standalone: true,
  host: { '[class]': 'labelClass' },
})
export class Label {
  // 💡 補上逃生艙，讓外部可以覆蓋樣式
  @Input() class = '';

  protected get labelClass() {
    return cn(
      // 1. 排版：微縮小 (text-sm)、中等粗體 (font-medium)、取消行高 (leading-none)
      // 2. 互動狀態：當關聯的 input 被禁用時，游標變禁止符號、透明度降低 (peer-disabled)
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.class,
    );
  }
}
