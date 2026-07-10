import { Directive, inject } from '@angular/core';
import { CarouselComponent } from './carousel.component';

@Directive({
  selector: 'button[sanringCarouselPrevious]',
  standalone: true,
  host: {
    type: 'button',
    '(click)': 'carousel.scrollPrev()',
    '[disabled]': '!carousel.canScrollPrev()',
  },
})
export class CarouselPreviousDirective {
  protected carousel = inject(CarouselComponent);
}
