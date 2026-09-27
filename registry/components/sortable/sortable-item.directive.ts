import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  Directive,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';
import { cn } from '../shared/utils';
import { SortableHandleDirective } from './sortable-handle.directive';
import { SortableComponent } from './sortable.component';

@Directive({
  selector: '[sanringSortableItem]',
  standalone: true,
  hostDirectives: [CdkDrag],
  host: {
    role: 'listitem',
    '[class]': 'hostClass()',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SortableItemDirective {
  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly sortable = inject(SortableComponent);
  private readonly drag = inject(CdkDrag, { self: true });
  private readonly handle = contentChild(SortableHandleDirective);

  constructor() {
    this.drag.previewClass = 'sanring-sortable-preview';

    effect(() => {
      this.drag.disabled = this.isDisabled();
    });
  }

  protected readonly isDisabled = computed(() => this.disabled() || this.sortable.disabled());

  protected readonly hostClass = computed(() =>
    cn(this.handle() ? null : 'cursor-grab', this.class()),
  );

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    const horizontal = this.sortable.orientation() === 'horizontal';
    const delta =
      event.key === 'ArrowDown' || (horizontal && event.key === 'ArrowRight')
        ? 1
        : event.key === 'ArrowUp' || (horizontal && event.key === 'ArrowLeft')
          ? -1
          : 0;
    if (delta === 0) return;

    const items = this.sortable.dropList.getSortedItems();
    const index = items.indexOf(this.drag);
    if (index < 0) return;

    event.preventDefault();
    this.sortable.reorder(index, index + delta);
  }
}
