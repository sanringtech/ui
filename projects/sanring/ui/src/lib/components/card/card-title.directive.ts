import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector:
    'h1[sanringCardTitle], h2[sanringCardTitle], h3[sanringCardTitle], h4[sanringCardTitle], div[sanringCardTitle]',
  standalone: true,
  host: {
    '[class]': 'cardTitleClass',
  },
})
export class CardTitleDirective {
  @Input() class = '';

  protected get cardTitleClass() {
    return cn(
      // 替換成標題專用的排版樣式
      'font-semibold leading-none tracking-tight',
      this.class,
    );
  }
}
