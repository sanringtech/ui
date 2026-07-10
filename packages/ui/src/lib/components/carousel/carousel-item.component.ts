import { Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { CAROUSEL_ITEM_SPACING_CLASS, CarouselComponent } from './carousel.component';

@Component({
  selector: 'sanring-carousel-item',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
    role: 'group',
    'aria-roledescription': 'slide',
  },
  template: `<ng-content></ng-content>`,
})
export class CarouselItemComponent {
  readonly class = input<string | undefined>();

  // 🪄 把總指揮抓進來，我們需要知道現在是橫的還直的！
  protected carousel = inject(CarouselComponent);

  protected readonly hostClass = computed(() =>
    cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      CAROUSEL_ITEM_SPACING_CLASS[this.carousel.orientation()].item,
      this.class(),
    ),
  );
}
