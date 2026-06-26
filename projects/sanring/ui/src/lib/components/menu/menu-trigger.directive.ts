import {
  Directive,
  ElementRef,
  inject,
  Input,
  ViewContainerRef,
  OnDestroy,
  TemplateRef,
  signal,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusMonitor } from '@angular/cdk/a11y';
import { SanringMenuContext } from './menu.type';
import { MenuTrigger as ngMenuTrigger } from '@angular/aria/menu';

@Directive({
  selector: `[sanringMenuTrigger]`,
  standalone: true,
  hostDirectives: [ngMenuTrigger],
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'isOpen()',
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
  @Input() sanringMenuData!: T;
  @Input('sanringMenuTrigger') menuTemplateRef!: TemplateRef<SanringMenuContext<T>>;

  // --- 內部狀態 ---
  private overlayRef: OverlayRef | null = null;
  private menuPortal!: TemplatePortal<SanringMenuContext<T>>;

  // 💡 升級 2：將 boolean 改為 WritableSignal
  isOpen = signal(false);

  constructor() {
    this.focusMonitor.monitor(this.elementRef);
  }

  // 💡 升級 3：修復 Linter 報錯，並透過 Signal 讀取狀態
  toggle() {
    if (this.isOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    // 建立 Overlay (保持你原本的邏輯)
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

    // 處理泛型 Context
    const context: SanringMenuContext<T> = {
      $implicit: this.sanringMenuData,
      isOpen: true,
      close: () => this.closeMenu(),
    };

    // 掛載 Portal
    this.menuPortal = new TemplatePortal(this.menuTemplateRef, this.viewContainerRef, context);
    this.overlayRef.attach(this.menuPortal);

    // 💡 更新 Signal 狀態
    this.isOpen.set(true);
  }

  closeMenu() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    // 💡 更新 Signal 狀態
    this.isOpen.set(false);
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.closeMenu();
  }
}
