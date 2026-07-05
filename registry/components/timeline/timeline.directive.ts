import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';
import { TimelineOrientation } from './timeline-type';

@Directive({
  selector: 'ul[sanringTimeline], div[sanringTimeline]',
  standalone: true,
  host: {
    '[class]': 'timelineClass()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.role]': '"list"',
  },
})
export class TimelineDirective {
  readonly orientation = input<TimelineOrientation>('vertical');
  readonly class = input<string | undefined>();

  protected readonly timelineClass = computed(() =>
    cn(
      'relative flex w-full',
      this.orientation() === 'vertical' ? 'flex-col gap-4' : 'flex-row gap-6',
      this.class(),
    ),
  );
}
