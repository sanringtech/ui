import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Directive({
  selector: '[sanringScrollArea]',
  standalone: true,
  hostDirectives: [CdkScrollable],
  host: {
    role: 'region', // 👈 ARIA 標記
    'aria-label': '可滾動區域',
    '[class]': 'scrollAreaClass',
  },
})
export class ScrollAreaDirective {
  @Input() class = '';

  protected get scrollAreaClass() {
    // 你可以在這裡加入預設的 overflow-auto 與隱藏捲軸的 CSS
    return cn('relative overflow-auto', this.class);
  }
}
