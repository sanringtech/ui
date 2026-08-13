export * from './caption.directive';
export * from './cell.directive';
export * from './column-def.directive';
export * from './row.directive';
export * from './table.directive';
export * from './table-container.component';
export * from './no-data-row.directive';
export * from './sort-header.component';
export * from './sort.directive';
export * from './table.type';

import { TableCaptionDirective } from './caption.directive';
import {
  TableCellDefDirective,
  TableCellDirective,
  TableFooterCellDefDirective,
  TableFooterCellDirective,
  TableHeaderCellDefDirective,
  TableHeaderCellDirective,
} from './cell.directive';
import { TableColumnDefDirective } from './column-def.directive';
import { TableNoDataRowDirective } from './no-data-row.directive';
import {
  TableFooterRowDefDirective,
  TableFooterRowDirective,
  TableHeaderRowDefDirective,
  TableHeaderRowDirective,
  TableRowDefDirective,
  TableRowDirective,
} from './row.directive';
import { SortHeaderComponent } from './sort-header.component';
import { SortDirective } from './sort.directive';
import { TableContainerComponent } from './table-container.component';
import { TableDirective } from './table.directive';

export const SANRING_TABLE_IMPORTS = [
  TableDirective,
  TableContainerComponent,
  TableCaptionDirective,
  TableNoDataRowDirective,
  TableColumnDefDirective,
  TableHeaderCellDefDirective,
  TableCellDefDirective,
  TableFooterCellDefDirective,
  TableHeaderCellDirective,
  TableCellDirective,
  TableFooterCellDirective,
  TableHeaderRowDefDirective,
  TableRowDefDirective,
  TableFooterRowDefDirective,
  TableHeaderRowDirective,
  TableRowDirective,
  TableFooterRowDirective,
  SortDirective,
  SortHeaderComponent,
];
