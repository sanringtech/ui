import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { cn } from '../../utils';

export type SortableOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'sanring-sortable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CdkDropList],
  template: `<ng-content></ng-content>`,
  host: {
    role: 'list',
    '[class]': 'hostClass()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class SortableComponent {
  readonly class = input<string | undefined>();
  readonly data = input.required<unknown[]>();
  readonly orientation = input<SortableOrientation>('vertical');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly sorted = output<unknown[]>();

  readonly dropList = inject(CdkDropList);

  constructor() {
    this.dropList.dropped.pipe(takeUntilDestroyed()).subscribe((event) => {
      this.reorder(event.previousIndex, event.currentIndex);
    });

    effect(() => {
      this.dropList.data = this.data();
      this.dropList.disabled = this.disabled();
      this.dropList.orientation = this.orientation();
      this.dropList.lockAxis = this.orientation() === 'horizontal' ? 'x' : 'y';
    });
  }

  reorder(previousIndex: number, currentIndex: number): void {
    if (this.disabled()) return;
    const data = this.data();
    if (previousIndex === currentIndex) return;
    if (
      previousIndex < 0 ||
      currentIndex < 0 ||
      previousIndex >= data.length ||
      currentIndex >= data.length
    ) {
      return;
    }
    moveItemInArray(data, previousIndex, currentIndex);
    this.sorted.emit([...data]);
  }

  protected readonly hostClass = computed(() =>
    cn(
      'flex gap-2',
      this.orientation() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class(),
    ),
  );
}
