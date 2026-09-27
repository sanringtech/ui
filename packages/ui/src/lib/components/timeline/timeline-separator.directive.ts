import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { TimelineDirective } from './timeline.directive';

@Component({
  selector: 'div[sanringTimelineSeparator], span[sanringTimelineSeparator]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isHorizontal()) {
      <span
        class="h-px min-w-2 flex-1 bg-[var(--sanring-border)] group-first/timeline-item:invisible"
      ></span>
    }
    <span
      class="flex size-2.5 shrink-0 items-center justify-center rounded-full bg-[var(--sanring-foreground)] has-[>*]:size-auto has-[>*]:rounded-none has-[>*]:bg-transparent"
    >
      <ng-content />
    </span>
    @if (isHorizontal()) {
      <span
        class="h-px min-w-2 flex-1 bg-[var(--sanring-border)] group-last/timeline-item:invisible"
      ></span>
    }
  `,
  host: {
    '[class]': 'separatorClass()',
    '[attr.aria-hidden]': '"true"',
  },
})
export class TimelineSeparatorDirective {
  readonly class = input<string | undefined>();

  private readonly timeline = inject(TimelineDirective, { optional: true });

  protected readonly isHorizontal = computed(() => this.timeline?.orientation() === 'horizontal');

  protected readonly separatorClass = computed(() =>
    cn(
      'flex shrink-0 items-center',
      this.isHorizontal()
        ? 'w-full flex-row self-stretch'
        : 'absolute top-0.5 left-0 z-10 w-8 flex-col items-center',
      this.class(),
    ),
  );
}
