export * from './sortable.component';
export * from './sortable-item.directive';
export * from './sortable-handle.directive';

import { SortableHandleDirective } from './sortable-handle.directive';
import { SortableItemDirective } from './sortable-item.directive';
import { SortableComponent } from './sortable.component';

export const SANRING_SORTABLE_IMPORTS = [
  SortableComponent,
  SortableItemDirective,
  SortableHandleDirective,
];
