import { Directive, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { TimelineDirective } from './timeline.directive';

@Directive({
  selector: 'li[sanringTimelineItem], div[sanringTimelineItem]',
  standalone: true,
  host: {
    '[class]': 'itemClass()',
    '[attr.role]': '"listitem"',
  },
})
export class TimelineItemDirective {
  readonly class = input<string | undefined>();

  private readonly timeline = inject(TimelineDirective, { optional: true });

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex min-w-0 gap-4',
      this.timeline?.orientation() === 'horizontal' ? 'flex-col' : 'flex-row',
      this.class(),
    ),
  );
}
