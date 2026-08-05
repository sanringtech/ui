import {
  Directive,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MenuTrigger as ngMenuTrigger } from '@angular/aria/menu';
import type { DropdownMenuAlign, DropdownMenuSide } from './dropdown-menu.type';

const DROPDOWN_MENU_GAP = 4;

/*
  @angular/aria/menu 只管 ARIA 語意/鍵盤/focus，完全不處理定位，而且它預期 Menu
  元素從一開始就存在於 DOM（用 visible() 切換可見度），跟 CDK 那種「開啟時才用
  TemplatePortal 建立」的做法衝突。所以這裡改用 DomPortal 把 sanring-dropdown-menu-content
  既有的 DOM node（而不是重新建立一份）搬進 CDK overlay pane 裡，只 attach 一次、
  之後永遠不 detach，展開/收合完全交給 ngMenuTrigger 自己的 expanded() 狀態去驅動
  data-visible 屬性顯示/隱藏。
*/
@Directive({
  selector: '[sanringDropdownMenuTrigger]',
  standalone: true,
  hostDirectives: [
    {
      directive: ngMenuTrigger,
      inputs: ['menu', 'disabled'],
    },
  ],
})
export class DropdownMenuTriggerDirective implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly ngTrigger = inject(ngMenuTrigger, { self: true });

  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;

  readonly align = input<DropdownMenuAlign>('start');
  readonly side = input<DropdownMenuSide>('bottom');
  readonly sideOffset = input(DROPDOWN_MENU_GAP, { transform: numberAttribute });
  readonly alignOffset = input(0, { transform: numberAttribute });

  private readonly positions = computed<ConnectionPositionPair[]>(() => {
    const side = this.side();
    const fallbackSides = this.fallbackSides(side);

    return fallbackSides.map((fallbackSide) => this.createPosition(fallbackSide));
  });

  constructor() {
    this.focusMonitor.monitor(this.elementRef);

    // 只在 menu() 第一次出現時把它的 DOM node 搬進 overlay，之後就不再重建。
    effect(() => {
      const menu = this.ngTrigger.menu();
      if (menu && !this.overlayRef) {
        this.attachOverlay(menu.element);
      }
    });

    // 每次展開都重新定位一次，避免 trigger 位置在收合期間變動（例如頁面捲動）。
    effect(() => {
      if (this.ngTrigger.expanded()) {
        queueMicrotask(() => this.overlayRef?.updatePosition());
      }
    });

    effect(() => {
      const positions = this.positions();
      this.positionStrategy?.withPositions(positions);
      if (this.ngTrigger.expanded()) {
        queueMicrotask(() => this.overlayRef?.updatePosition());
      }
    });
  }

  private attachOverlay(contentElement: HTMLElement): void {
    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.positions())
      .withFlexibleDimensions(false)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.attach(new DomPortal(contentElement));

    this.overlayRef.outsidePointerEvents().subscribe((event) => {
      if (
        this.ngTrigger.expanded() &&
        !this.elementRef.nativeElement.contains(event.target as Node) &&
        !contentElement.contains(event.target as Node)
      ) {
        this.ngTrigger.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.overlayRef?.dispose();
  }

  private fallbackSides(side: DropdownMenuSide): DropdownMenuSide[] {
    if (side === 'top') return ['top', 'bottom', 'right', 'left'];
    if (side === 'right') return ['right', 'left', 'bottom', 'top'];
    if (side === 'left') return ['left', 'right', 'bottom', 'top'];
    return ['bottom', 'top', 'right', 'left'];
  }

  private createPosition(side: DropdownMenuSide): ConnectionPositionPair {
    const align = this.align();
    const sideOffset = this.sideOffset();
    const alignOffset = this.alignOffset();

    if (side === 'top' || side === 'bottom') {
      return {
        originX: align,
        originY: side,
        overlayX: align,
        overlayY: side === 'bottom' ? 'top' : 'bottom',
        offsetX: alignOffset,
        offsetY: side === 'bottom' ? sideOffset : -sideOffset,
      };
    }

    const verticalAlign = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';

    return {
      originX: side === 'right' ? 'end' : 'start',
      originY: verticalAlign,
      overlayX: side === 'right' ? 'start' : 'end',
      overlayY: verticalAlign,
      offsetX: side === 'right' ? sideOffset : -sideOffset,
      offsetY: alignOffset,
    };
  }
}
