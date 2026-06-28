import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-breadcrumb-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'link',
    'aria-disabled': 'true',
    'aria-current': 'page', // 💡 A11y 標記：告訴螢幕閱讀器這是當前頁面
    '[class]': 'breadcrumbPageClass()',
  },
  template: `<ng-content></ng-content>`,
})
export class BreadcrumbPageComponent {
  readonly class = input<string | undefined>();

  protected readonly breadcrumbPageClass = computed(() =>
    cn('font-normal text-[var(--sanring-foreground)]', this.class()),
  );
}
