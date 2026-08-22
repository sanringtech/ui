import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { cn } from '../shared/utils';
import { OVERLAY_SURFACE_CLASS } from '../shared/component-styles';
import {
  focusAdjacentMenuItem,
  initializeMenuTabStop,
  syncFocusedMenuItemTabStop,
} from '../shared/menu-navigation';
import { MenuOverlayController } from '../shared/menu-overlay-controller';
import { ContextMenuComponent } from './context-menu.component';

/*
  origin 是滑鼠點擊的座標點（寬高皆為 0），所以 originX/originY 對「起點」本身沒有
  意義，真正決定面板長出方向的是 overlayX/overlayY。這裡列出四個角落當 fallback，
  讓 CDK 在面板靠近視窗邊緣時自動挑選能完整顯示的方向，模擬原生右鍵選單的翻轉行為。
*/
const CONTEXT_MENU_POSITIONS: ConnectionPositionPair[] = [
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Component({
  selector: 'sanring-context-menu-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'menu',
    '[class]': 'contentClass()',
    '(focusin)': 'onFocusIn($event)',
  },
})
export class ContextMenuContentComponent {
  protected readonly contextMenu = inject(ContextMenuComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlayCtrl = new MenuOverlayController(
    inject(Overlay),
    this.elementRef,
    inject(DestroyRef),
  );

  readonly class = input<string | undefined>();

  protected readonly contentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'z-50 block min-w-32 overflow-hidden rounded-[var(--sanring-radius-sm)] p-1 outline-none',
      /*
        DomPortal 只在 isOpen 時把這個元素搬去 overlay pane；關閉時它會被搬回原本
        宣告的位置（trigger 旁邊），若不主動隱藏就會以一般文件流的樣子直接露出來。
      */
      !this.contextMenu.isOpen() && 'hidden',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const isOpen = this.contextMenu.isOpen();
      const position = this.contextMenu.position();

      if (!isOpen) {
        this.overlayCtrl.detach();
        return;
      }

      this.overlayCtrl.open(position, {
        positions: CONTEXT_MENU_POSITIONS,
        scrollStrategy: 'close',
        onOutsideClick: () => this.contextMenu.close(),
        onKeydown: (event) => {
          if (event.key === 'Tab') {
            // The menu is portaled to the end of <body>, so native traversal from an overlay
            // item would not continue beside the logical trigger. Close and move explicitly.
            event.preventDefault();
            event.stopPropagation();
            this.contextMenu.closeAndFocusAdjacentTabStop(event.shiftKey ? -1 : 1);
            return;
          }

          if (event.key === 'Escape') {
            event.stopPropagation();
            this.contextMenu.close();
            return;
          }

          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            focusAdjacentMenuItem(
              this.elementRef.nativeElement,
              event.key === 'ArrowDown' ? 1 : -1,
            );
          }
        },
      });
      initializeMenuTabStop(this.elementRef.nativeElement);
    });
  }

  protected onFocusIn(event: FocusEvent): void {
    syncFocusedMenuItemTabStop(this.elementRef.nativeElement, event.target);
  }
}
