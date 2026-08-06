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
import { focusAdjacentMenuItem } from '../shared/menu-navigation';
import { MenuOverlayController } from '../shared/menu-overlay-controller';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuSubComponent } from './context-menu-sub.component';

/*
  跟 context-menu-content 的差別：origin 不是滑鼠座標，而是 sub-trigger 這個元素本身，
  所以預設往右側展開（模擬子選單從觸發項目旁邊長出來），靠近視窗邊緣才 fallback 往左。
*/
const SUB_CONTENT_POSITIONS: ConnectionPositionPair[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
  { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' },
];

@Component({
  selector: 'sanring-context-menu-sub-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'menu',
    '[class]': 'contentClass()',
    '(mouseenter)': 'sub.clearCloseTimer()',
    '(mouseleave)': 'sub.scheduleClose()',
  },
})
export class ContextMenuSubContentComponent {
  protected readonly sub = inject(ContextMenuSubComponent);
  private readonly rootMenu = inject(ContextMenuComponent, { optional: true });
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
      !(this.sub.isOpen() && (this.rootMenu?.isOpen() ?? true)) && 'hidden',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const isOpen = this.sub.isOpen() && (this.rootMenu?.isOpen() ?? true);
      const triggerRef = this.sub.triggerRef();

      if (!isOpen || !triggerRef) {
        this.overlayCtrl.detach();
        return;
      }

      this.overlayCtrl.open(triggerRef, {
        positions: SUB_CONTENT_POSITIONS,
        scrollStrategy: 'close',
        onOutsideClick: () => this.sub.close(),
        onKeydown: (event) => {
          if (event.key === 'Escape' || event.key === 'ArrowLeft') {
            event.stopPropagation();
            this.sub.close();
            this.sub.triggerRef()?.nativeElement.focus();
            return;
          }

          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            focusAdjacentMenuItem(this.elementRef.nativeElement, event.key === 'ArrowDown' ? 1 : -1);
          }
        },
      });
    });
  }
}
