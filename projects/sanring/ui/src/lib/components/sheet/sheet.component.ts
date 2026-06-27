import { Component, model } from '@angular/core';

@Component({ selector: 'sanring-sheet', standalone: true, template: `<ng-content></ng-content>` })
export class SheetComponent {
  readonly isOpen = model(false);

  // 提供給 Trigger 或 Close 呼叫的方法
  setOpen(open: boolean) {
    this.isOpen.set(open);
  }
}
