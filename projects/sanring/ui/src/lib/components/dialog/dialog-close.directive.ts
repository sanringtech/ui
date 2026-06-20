import { Directive, HostListener, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

@Directive({ selector: '[sanringDialogClose]', standalone: true })
export class DialogClose {
  private readonly dialogRef = inject(DialogRef, { optional: true });

  @HostListener('click')
  closeDialog() {
    this.dialogRef?.close();
  }
}
