export * from './scroll-area.directive';
export * from './infinite-scroll.directive';
export * from './scroll-area.component';
export * from './scroll-area.type';

import { InfiniteScrollDirective } from './infinite-scroll.directive';
import { ScrollAreaComponent } from './scroll-area.component';
import { ScrollAreaDirective } from './scroll-area.directive';

export const SANRING_SCROLL_AREA_IMPORTS = [
  ScrollAreaComponent,
  ScrollAreaDirective,
  InfiniteScrollDirective,
];
