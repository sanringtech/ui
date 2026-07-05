import { Directive, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { TimelineDirective } from './timeline.directive';

@Directive({
  selector: 'div[sanringTimelineSeparator], span[sanringTimelineSeparator]',
  standalone: true,
  host: {
    '[class]': 'separatorClass()',
    '[attr.aria-hidden]': '"true"',
  },
})
export class TimelineSeparatorDirective {
  readonly class = input<string | undefined>();

  private readonly timeline = inject(TimelineDirective, { optional: true });

  protected readonly separatorClass = computed(() =>
    cn(
      'flex shrink-0 items-center',
      this.timeline?.orientation() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class(),
    ),
  );
}
