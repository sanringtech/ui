import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector:
    'h1[sanringCardTitle], h2[sanringCardTitle], h3[sanringCardTitle], h4[sanringCardTitle], div[sanringCardTitle]',
  standalone: true,
  host: {
    '[class]': 'cardTitleClass()',
  },
})
export class CardTitleDirective {
  readonly class = input<string | undefined>();

  protected readonly cardTitleClass = computed(() =>
    cn('font-semibold leading-none tracking-tight', this.class()),
  );
}
