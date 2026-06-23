import { MenubarTriggerDirective } from './menu-trigger.directive';
import {
  Directive,
  ElementRef,
  inject,
  Input,
  ViewContainerRef,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusMonitor } from '@angular/cdk/a11y';
import { SanringMenuContext } from '.';
import { MenuTrigger as ngMenuTrigger } from '@angular/aria/menu';

// 1. 定義帶有泛型 T 的 Context 介面

@Directive({
  selector: `[sanringMenuTrigger]`,
  standalone: true,
  hostDirectives: [ngMenuTrigger],
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'isOpen',
    '(click)': 'toggle()',
  },
})
export class MenubarTriggerDirective<T> implements OnDestroy {
  // --- 依賴注入 ---
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private focusMonitor = inject(FocusMonitor);
  private viewContainerRef = inject(ViewContainerRef);

  // --- 泛型資料與 Template 接收 ---
  // 接收外部傳入的任意型別資料 T
  @Input() sanringMenuData!: T;

  // 接收使用者寫好的 Template，並嚴格規定其 Context 必須符合 SanringMenuContext<T>
  @Input('sanringMenuTrigger') menuTemplateRef!: TemplateRef<SanringMenuContext<T>>;

  // --- 內部狀態 ---
  private overlayRef: OverlayRef | null = null;
  private menuPortal!: TemplatePortal<SanringMenuContext<T>>;
  isOpen = false;

  constructor() {
    this.focusMonitor.monitor(this.elementRef);
  }

  toggle() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    // 1. 處理 CDK Overlay 定位與遮罩 (你原本的完整邏輯)
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef.backdropClick().subscribe(() => this.closeMenu());

    // 2. 處理泛型 Context 的實體化
    const context: SanringMenuContext<T> = {
      $implicit: this.sanringMenuData, // 將外部傳入的資料塞進來
      isOpen: true,
      close: () => this.closeMenu(), // 將關閉方法暴露出去
    };

    // 3. 將 TemplateRef 與 Context 打包成 Portal，並掛載到 Overlay 上
    this.menuPortal = new TemplatePortal(this.menuTemplateRef, this.viewContainerRef, context);
    this.overlayRef.attach(this.menuPortal);
    this.isOpen = true;
  }

  closeMenu() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen = false;
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.closeMenu();
  }
}
