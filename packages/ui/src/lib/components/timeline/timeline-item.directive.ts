import { Directive, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
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
      'group/timeline-item relative min-w-0',
      this.timeline?.orientation() === 'horizontal'
        ? 'flex flex-1 flex-col gap-3'
        : "pb-8 pl-10 last:pb-0 before:absolute before:bottom-0 before:left-[15px] before:top-3 before:w-px before:bg-[var(--sanring-border)] before:content-[''] last:before:hidden",
      this.class(),
    ),
  );
}
