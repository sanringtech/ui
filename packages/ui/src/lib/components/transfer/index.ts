export * from './transfer.component';
export * from './transfer-action.directive';
export * from './transfer-header.component';
export * from './transfer-item.component';
export * from './transfer-list.component';
export * from './transfer-panel.component';
export * from './transfer.type';

import { TransferActionDirective } from './transfer-action.directive';
import { TransferHeaderComponent } from './transfer-header.component';
import { TransferItemComponent } from './transfer-item.component';
import { TransferListComponent } from './transfer-list.component';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferComponent } from './transfer.component';

export const SANRING_TRANSFER_IMPORTS = [
  TransferComponent,
  TransferPanelComponent,
  TransferHeaderComponent,
  TransferListComponent,
  TransferItemComponent,
  TransferActionDirective,
];
