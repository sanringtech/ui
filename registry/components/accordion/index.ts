export * from './accordion.component';
export * from './accordion-content.component';
export * from './accordion-item.component';
export * from './accordion-trigger.component';
export * from './accordion.type';

import { AccordionContentComponent } from './accordion-content.component';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionTriggerComponent } from './accordion-trigger.component';
import { AccordionComponent } from './accordion.component';

export const SANRING_ACCORDION_IMPORTS = [
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
];
