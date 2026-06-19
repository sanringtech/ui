import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';
import { LinkTarget } from './link.type';

// 1. 神級型別：既有自動提示，又能相容所有字串

@Directive({
  selector: 'a[sanringLink]',
  standalone: true,
  host: {
    '[class]': 'computedClass',
    '[attr.target]': 'target || null',
    // 2. 綁定智慧合併後的 rel
    '[attr.rel]': 'computedRel',
  },
})
export class Link {
  @Input() class = '';
  @Input() target?: LinkTarget; // 重新啟用高階型別
  @Input() rel?: string;

  protected get computedClass() {
    return cn(
      'inline-flex items-center gap-1 font-medium text-[var(--docs-fg)] underline underline-offset-4',
      'transition-colors hover:text-[var(--docs-muted)] focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]',
      'disabled:pointer-events-none disabled:opacity-50',
      this.class,
    );
  }

  protected get computedRel() {
    const isBlank = this.target === '_blank';

    // 如果不是 _blank 且使用者沒傳 rel，就保持 DOM 乾淨
    if (!isBlank && !this.rel) {
      return null;
    }

    // 3. 智慧合併邏輯：把字串拆成陣列，丟進 Set 去除重複
    const rels = new Set(this.rel ? this.rel.split(' ') : []);

    // 4. 強制注入安全標籤
    if (isBlank) {
      rels.add('noopener');
      rels.add('noreferrer');
    }

    // 5. 組裝回字串
    return Array.from(rels).join(' ') || null;
  }
}
