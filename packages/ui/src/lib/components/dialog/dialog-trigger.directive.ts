import { Directive, HostListener, TemplateRef, inject, input } from '@angular/core';
import { DialogService } from './dialog.service';

@Directive({ selector: '[sanringDialogTrigger]', standalone: true })
export class DialogTriggerDirective {
  private dialogService = inject(DialogService);

  readonly sanringDialogTrigger = input.required<TemplateRef<unknown>>();

  @HostListener('click')
  onClick() {
    const dialogTemplate = this.sanringDialogTrigger();

    if (dialogTemplate) {
      // 呼叫服務，透過 CDK Overlay 打開視窗
      this.dialogService.open(dialogTemplate);
    }
  }
}
