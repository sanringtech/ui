import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Directive({
  selector: 'caption[sanringCaption]',
  standalone: true,
  host: {
    '[class]': 'captionClass()',
  },
})
export class TableCaptionDirective {
  readonly class = input<string | undefined>();

  protected readonly captionClass = computed(() =>
    cn('mt-4 text-sm text-[var(--sanring-muted)]', this.class()),
  );
}
