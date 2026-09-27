import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Directive({
  selector: '[sanringSortableHandle]',
  standalone: true,
  hostDirectives: [CdkDragHandle],
  host: {
    '[class]': 'hostClass()',
  },
})
export class SortableHandleDirective {
  readonly class = input<string | undefined>();

  protected readonly hostClass = computed(() => cn('cursor-grab', this.class()));
}
