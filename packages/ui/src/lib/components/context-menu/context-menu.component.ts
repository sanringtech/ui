import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';
import { focusAdjacentDocumentTabStop } from '../shared/menu-navigation';

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
  private triggerElement: HTMLElement | null = null;

  /*
    掛在這裡而不是各層 content 上：item 可能深埋在巢狀 sub-content 裡（各自是獨立
    portal 出去的 DOM 子樹），但 inject(ContextMenuComponent) 是走邏輯元件樹解析，
    不受 portal 搬動 DOM 位置影響，所以不管選到哪一層的 item，都會回報到同一個地方。
  */
  readonly itemSelected = output<unknown>();

  /** 由 ContextMenuTriggerDirective 在 contextmenu 事件時寫入右鍵當下的游標座標 */
  private readonly _position = signal<ContextMenuPosition>({ x: 0, y: 0 });
  readonly position = this._position.asReadonly();

  openAt(x: number, y: number, options?: { pointerHeld?: boolean }): void {
    this._position.set({ x, y });
    this.isOpen.set(true);
    if (options?.pointerHeld) this.awaitOpeningRelease();
  }

  close(): void {
    this.isOpen.set(false);
  }

  registerTrigger(element: HTMLElement): void {
    this.triggerElement = element;
  }

  unregisterTrigger(element: HTMLElement): void {
    if (this.triggerElement === element) this.triggerElement = null;
  }

  /*
    macOS fires `contextmenu` on mousedown, while the right button is still held. The menu opens
    under the pointer, so the release lands on the menu (or wherever the pointer is) and the
    browser sends `auxclick` to the common ancestor of the press and release targets — often
    <body>. The overlay reports that as a click outside and the menu closed as soon as it opened.
    Remember that a release is pending and ignore it; clear the flag right after it.
  */
  private openingReleasePending = false;

  private awaitOpeningRelease(): void {
    this.openingReleasePending = true;
    if (typeof window === 'undefined') return;
    window.addEventListener(
      'pointerup',
      () => setTimeout(() => (this.openingReleasePending = false)),
      { capture: true, once: true },
    );
  }

  /**
   * Whether an outside pointer event should be ignored instead of closing the menu: the release
   * of the right-click that opened it, or a right-click on the trigger (which re-opens the menu
   * at the new position through the trigger's own `contextmenu` handler).
   */
  shouldIgnoreOutsideClick(event: MouseEvent): boolean {
    if (event.button !== 2) return false;
    if (this.openingReleasePending) return true;
    return (
      !!this.triggerElement &&
      event.target instanceof Node &&
      this.triggerElement.contains(event.target)
    );
  }

  closeAndFocusAdjacentTabStop(delta: 1 | -1): void {
    this.close();
    if (this.triggerElement) focusAdjacentDocumentTabStop(this.triggerElement, delta);
  }
}
