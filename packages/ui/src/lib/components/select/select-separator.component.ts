import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-select-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator', // 💡 W3C 標準：宣告這是清單內的分隔線
    'aria-orientation': 'horizontal',
    '[class]': 'separatorClass()',
  },
  template: ``, // 💡 純靠樣式渲染，不需要 template 內容
})
export class SelectSeparatorComponent {
  readonly class = input<string | undefined>();

  protected readonly separatorClass = computed(() =>
    cn(
      // -mx-1 用來抵消 content 容器的 padding，讓線條可以貼邊，並給予上下間距
      '-mx-1 my-1 h-px bg-[var(--sanring-border-muted,rgba(0,0,0,0.1))]',
      this.class(),
    ),
  );
}
