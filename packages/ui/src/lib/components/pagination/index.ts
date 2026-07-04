export * from './disableable-nav.directive';
export * from './page-size-select.component';
export * from './paginator.component';
export * from './pagination.component';
export * from './pagination-item.directive';
export * from './pagination-list.component';
export * from './pagination-nav.directive';
export * from './pagination.type';

import { PageSizeSelectComponent } from './page-size-select.component';
import { PaginatorComponent } from './paginator.component';
import { PaginationComponent } from './pagination.component';
import { PaginationItemDirective } from './pagination-item.directive';
import { PaginationListComponent } from './pagination-list.component';
import { PaginationNavDirective } from './pagination-nav.directive';

export const SANRING_PAGINATION_IMPORTS = [
  PaginatorComponent,
  PaginationComponent,
  PaginationItemDirective,
  PaginationListComponent,
  PaginationNavDirective,
];

export const SANRING_PAGINATION_PAGE_SIZE_IMPORTS = [PageSizeSelectComponent];
