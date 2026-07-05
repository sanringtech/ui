export * from './alert-dialog.service';
export * from './alert-dialog-action.directive';
export * from './alert-dialog-cancel.directive';
export * from './alert-dialog-content.component';

export { DialogDescriptionDirective, DialogTitleDirective } from '../dialog';

import { AlertDialogActionDirective } from './alert-dialog-action.directive';
import { AlertDialogCancelDirective } from './alert-dialog-cancel.directive';
import { AlertDialogContentComponent } from './alert-dialog-content.component';
import { DialogDescriptionDirective, DialogTitleDirective } from '../dialog';

export const SANRING_ALERT_DIALOG_IMPORTS = [
  AlertDialogContentComponent,
  DialogTitleDirective,
  DialogDescriptionDirective,
  AlertDialogActionDirective,
  AlertDialogCancelDirective,
];
