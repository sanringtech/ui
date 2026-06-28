import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Directive({
  selector: '[sanringScrollArea]',
  standalone: true,
  hostDirectives: [CdkScrollable],
  host: {
    '[attr.role]': 'scrollAreaRole()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledby() || null',
    '[class]': 'scrollAreaClass()',
  },
})
export class ScrollAreaDirective {
  readonly class = input<string | undefined>();
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledby = input<string | undefined>();

  protected readonly scrollAreaClass = computed(() => {
    // 你可以在這裡加入預設的 overflow-auto 與隱藏捲軸的 CSS
    return cn('relative overflow-auto', this.class());
  });

  protected readonly scrollAreaRole = computed(() =>
    this.ariaLabel() || this.ariaLabelledby() ? 'region' : null,
  );
}
