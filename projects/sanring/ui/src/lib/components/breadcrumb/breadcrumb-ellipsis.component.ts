import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideEllipsis } from '@lucide/angular';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-breadcrumb-ellipsis',
  standalone: true,
  imports: [LucideEllipsis],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'presentation',
    'aria-hidden': 'true',
    '[class]': 'breadcrumbEllipsisClass()',
  },
  template: `
    <ng-content>
      <svg lucideEllipsis class="size-4"></svg>
    </ng-content>
    <span class="sr-only">More links</span>
  `,
})
export class BreadcrumbEllipsisComponent {
  readonly class = input<string | undefined>();

  protected readonly breadcrumbEllipsisClass = computed(() =>
    cn('flex h-9 w-9 items-center justify-center', this.class()),
  );
}
