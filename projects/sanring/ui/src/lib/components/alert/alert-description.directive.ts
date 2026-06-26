import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: '[sanringAlertDescription]',
  standalone: true,
  host: {
    '[class]': 'alertDescriptionClass()',
  },
})
export class AlertDescriptionDirective {
  readonly class = input<string | undefined>();

  protected readonly alertDescriptionClass = computed(() =>
    cn('text-sm [&_p]:leading-relaxed opacity-90', this.class()),
  );
}
