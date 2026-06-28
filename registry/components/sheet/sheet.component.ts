import { ChangeDetectionStrategy, Component, model } from '@angular/core';

let _nextSheetId = 0;

@Component({
  selector: 'sanring-sheet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
})
export class SheetComponent {
  private readonly _id = ++_nextSheetId;

  readonly isOpen = model(false);

  /** 面板 id，供 trigger aria-controls 指向 */
  readonly panelId = `sanring-sheet-${this._id}-panel`;
  /** 供 SheetTitle 綁定 id，讓面板 aria-labelledby 自動關聯 */
  readonly titleId = `sanring-sheet-${this._id}-title`;
  /** 供 SheetDescription 綁定 id，讓面板 aria-describedby 自動關聯 */
  readonly descId  = `sanring-sheet-${this._id}-desc`;

  setOpen(open: boolean): void {
    this.isOpen.set(open);
  }
}
