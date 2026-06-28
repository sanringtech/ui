import { Directive, computed, input } from '@angular/core';

@Directive({
  selector: '[sanringProgress]',
  exportAs: 'progress',
  standalone: true,
  host: {
    role: 'progressbar',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-valuetext]': 'ariaValueText()',
  },
})
export class ProgressDirective {
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly ariaLabel = input<string | undefined>();
  readonly ariaValueText = input<string | undefined>();

  readonly percentage = computed(() => {
    const max = this.max();
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (this.value() / max) * 100));
  });
}
