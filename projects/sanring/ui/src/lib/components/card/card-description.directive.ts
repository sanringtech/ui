import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: 'p[sanringCardDescription], div[sanringCardDescription]',
  standalone: true,
  host: {
    '[class]': 'cardDescriptionClass',
  },
})
export class CardDescription {
  @Input() class = '';

  protected get cardDescriptionClass() {
    return cn(
      // text-sm: 縮小字體
      // 顏色替換成你的系統變數 (類似 Tailwind 的 text-muted-foreground)
      'text-sm text-[var(--docs-muted)]',
      this.class,
    );
  }
}
