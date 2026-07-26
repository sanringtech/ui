import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
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
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS } from '../component-styles';
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
  },
})
export class ContextMenuContentComponent {
  protected readonly contextMenu = inject(ContextMenuComponent);
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

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

  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;
  private portal: DomPortal<HTMLElement> | null = null;

  constructor() {
    effect(() => {
      const isOpen = this.contextMenu.isOpen();
      const position = this.contextMenu.position();

      if (!isOpen) {
        this.overlayRef?.detach();
        return;
      }

      if (!this.overlayRef) {
        this.createOverlay(position);
        return;
      }

      this.positionStrategy!.setOrigin(position);
      this.overlayRef.updatePosition();
      if (!this.overlayRef.hasAttached()) {
        this.overlayRef.attach(this.portal!);
      }
    });

    this.destroyRef.onDestroy(() => this.overlayRef?.dispose());
  }

  private createOverlay(position: { x: number; y: number }): void {
    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(position)
      .withPositions(CONTEXT_MENU_POSITIONS)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.portal = new DomPortal(this.elementRef);
    this.overlayRef.attach(this.portal);

    this.overlayRef.outsidePointerEvents().subscribe(() => this.contextMenu.close());

    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        this.contextMenu.close();
      }
    });
  }
}
