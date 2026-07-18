import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { cn } from '../shared/utils';

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
  readonly hideScrollbar = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledby = input<string | undefined>();

  protected readonly scrollAreaClass = computed(() =>
    cn(
      'relative overflow-auto',
      this.hideScrollbar() && '[&::-webkit-scrollbar]:hidden [scrollbar-width:none]',
      this.class(),
    ),
  );

  protected readonly scrollAreaRole = computed(() =>
    this.ariaLabel() || this.ariaLabelledby() ? 'region' : null,
  );
}
