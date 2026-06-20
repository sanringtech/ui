import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  // 拿掉標籤限制，讓 div, span, 甚至 p 都可以套用
  selector: '[sanringSkeleton]',
  standalone: true,
  host: {
    '[class]': 'skeletonClass'
  }
})
export class Skeleton {
  @Input() class = '';

  protected get skeletonClass() {
    return cn(
      'animate-pulse rounded-md bg-[var(--docs-border)]',
      this.class // 讓使用者可以覆蓋寬高和形狀
    );
  }
}
