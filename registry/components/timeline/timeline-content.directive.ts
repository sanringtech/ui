import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Directive({
  selector: 'div[sanringTimelineContent], section[sanringTimelineContent]',
  standalone: true,
  host: {
    '[class]': 'contentClass()',
  },
})
export class TimelineContentDirective {
  readonly class = input<string | undefined>();

  protected readonly contentClass = computed(() => cn('min-w-0 flex-1', this.class()));
}
