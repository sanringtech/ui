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
export class SkeletonDirective {
  @Input() class = '';

  protected get skeletonClass() {
    return cn(
      'animate-pulse rounded-md bg-[var(--sanring-surface-strong)]',
      this.class // 讓使用者可以覆蓋寬高和形狀
    );
  }
}
