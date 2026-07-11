import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { AspectRatioValue } from './aspect-ratio.type';

function coerceAspectRatio(value: AspectRatioValue | '' | null | undefined): AspectRatioValue {
  return value === '' || value == null ? '1 / 1' : value;
}

@Directive({
  selector: '[sanringAspectRatio]',
  standalone: true,
  host: {
    '[class]': 'aspectRatioClass()',
    '[style.aspect-ratio]': 'ratio()',
  },
})
export class AspectRatioDirective {
  readonly ratio = input<AspectRatioValue, AspectRatioValue | '' | null | undefined>('1 / 1', {
    alias: 'sanringAspectRatio',
    transform: coerceAspectRatio,
  });

  readonly class = input<string | undefined>();

  protected readonly aspectRatioClass = computed(() => cn('relative w-full', this.class()));
}
