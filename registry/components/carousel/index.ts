export * from './carousel.component';
export * from './carousel-content.component';
export * from './carousel-item.component';
export * from './carousel-next.directive';
export * from './carousel-previous.directive';
export * from './carousel.type';

// 便利陣列：imports: [SANRING_CAROUSEL_IMPORTS] 一行搞定
import { CarouselComponent } from './carousel.component';
import { CarouselContentComponent } from './carousel-content.component';
import { CarouselItemComponent } from './carousel-item.component';
import { CarouselNextDirective } from './carousel-next.directive';
import { CarouselPreviousDirective } from './carousel-previous.directive';

export const SANRING_CAROUSEL_IMPORTS = [
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
  CarouselNextDirective,
  CarouselPreviousDirective,
];
