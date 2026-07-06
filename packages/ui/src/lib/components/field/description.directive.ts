import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

let nextUniqueId = 0;

@Directive({
  // 將 Selector 改短，開發體驗更好
  selector: '[sanringDescription]',
  standalone: true,
  host: {
    '[class]': 'descriptionClass()',
    '[id]': 'id', // 自動綁上唯一的 ID，為未來的無障礙設計 (a11y) 準備
  },
})
export class DescriptionDirective {
  readonly class = input<string>('');

  // 每個 description 都會自動獲得一個獨一無二的 ID
  readonly id = `sanring-description-${nextUniqueId++}`;

  // 預設加上 shadcn 風格的次要文字樣式 (muted)
  protected readonly descriptionClass = computed(() =>
    cn('text-[0.8rem] text-[var(--sanring-muted)]', this.class()),
  );
}
