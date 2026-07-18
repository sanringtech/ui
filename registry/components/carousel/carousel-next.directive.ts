import { Directive, inject } from '@angular/core';
import { CarouselComponent } from './carousel.component';

@Directive({
  selector: 'button[sanringCarouselNext]',
  standalone: true,
  host: {
    type: 'button',
    '(click)': 'carousel.scrollNext()',
    '[disabled]': '!carousel.canScrollNext()',
  },
})
export class CarouselNextDirective {
  protected carousel = inject(CarouselComponent);
}
