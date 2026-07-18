export * from './hover-card.component';
export * from './hover-card-content.component';
export * from './hover-card-trigger.directive';
export * from './hover-card.type';

// 便利陣列：imports: [SANRING_HOVER_CARD_IMPORTS] 一行搞定
import { HoverCardComponent } from './hover-card.component';
import { HoverCardContentComponent } from './hover-card-content.component';
import { HoverCardTriggerDirective } from './hover-card-trigger.directive';

export const SANRING_HOVER_CARD_IMPORTS = [
  HoverCardComponent,
  HoverCardContentComponent,
  HoverCardTriggerDirective,
];
