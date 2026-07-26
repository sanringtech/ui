import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

@Component({
  selector: 'sanring-context-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ContextMenuComponent {
  readonly isOpen = model(false);

  /*
    掛在這裡而不是各層 content 上：item 可能深埋在巢狀 sub-content 裡（各自是獨立
    portal 出去的 DOM 子樹），但 inject(ContextMenuComponent) 是走邏輯元件樹解析，
    不受 portal 搬動 DOM 位置影響，所以不管選到哪一層的 item，都會回報到同一個地方。
  */
  readonly itemSelected = output<unknown>();

  /** 由 ContextMenuTriggerDirective 在 contextmenu 事件時寫入右鍵當下的游標座標 */
  private readonly _position = signal<ContextMenuPosition>({ x: 0, y: 0 });
  readonly position = this._position.asReadonly();

  openAt(x: number, y: number): void {
    this._position.set({ x, y });
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
