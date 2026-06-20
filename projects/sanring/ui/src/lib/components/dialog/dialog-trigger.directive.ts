import { Directive, HostListener, Input, TemplateRef, inject } from '@angular/core';
import { DialogService } from './dialog.service';

@Directive({ selector: '[sanringDialogTrigger]', standalone: true })
export class DialogTriggerDirective {
  private dialogService = inject(DialogService);

  @Input('sanringDialogTrigger') dialogTemplate!: TemplateRef<unknown>;

  @HostListener('click')
  onClick() {
    if (this.dialogTemplate) {
      // 呼叫服務，透過 CDK Overlay 打開視窗
      this.dialogService.open(this.dialogTemplate);
    }
  }
}
