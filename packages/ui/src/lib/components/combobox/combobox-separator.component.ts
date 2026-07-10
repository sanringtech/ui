import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-combobox-separator',
  standalone: true,
  template: ``, // 裡面不需要裝東西，它本身就是一條線
  host: {
    // 🌟 無障礙核心：告訴螢幕閱讀器這是一條分隔線
    role: 'separator',
    '[attr.aria-orientation]': '"horizontal"',
    '[class]': 'separatorClass()',
  },
})
export class ComboboxSeparatorComponent {
  // 允許外部微調樣式
  readonly class = input<string | undefined>();

  // 🎨 視覺排版：經典的 shadcn/ui 分隔線樣式
  protected readonly separatorClass = computed(() =>
    cn(
      // -mx-1 用來抵消 List 容器可能帶有的 padding，讓線條可以貼齊左右邊緣
      // my-1 給予上下間距，h-px 設定高度為 1px，bg-border 給予邊框顏色
      '-mx-1 my-1 h-px bg-border',
      this.class(),
    ),
  );
}
