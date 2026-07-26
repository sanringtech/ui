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
import { cn } from '../shared/utils';
import { OVERLAY_SURFACE_CLASS } from '../shared/component-styles';
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
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly class = input<string | undefined>();

  protected readonly contentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'z-50 block min-w-32 overflow-hidden rounded-[var(--sanring-radius-sm)] p-1 outline-none',
      !(this.sub.isOpen() && (this.rootMenu?.isOpen() ?? true)) && 'hidden',
      this.class(),
    ),
  );

  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;
  private portal: DomPortal<HTMLElement> | null = null;

  constructor() {
    effect(() => {
      const isOpen = this.sub.isOpen() && (this.rootMenu?.isOpen() ?? true);
      const triggerRef = this.sub.triggerRef();

      if (!isOpen || !triggerRef) {
        this.overlayRef?.detach();
        return;
      }

      if (!this.overlayRef) {
        this.createOverlay(triggerRef);
        return;
      }

      this.overlayRef.updatePosition();
      if (!this.overlayRef.hasAttached()) {
        this.overlayRef.attach(this.portal!);
      }
    });

    this.destroyRef.onDestroy(() => this.overlayRef?.dispose());
  }

  private createOverlay(triggerRef: ElementRef<HTMLElement>): void {
    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(triggerRef)
      .withPositions(SUB_CONTENT_POSITIONS)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.portal = new DomPortal(this.elementRef);
    this.overlayRef.attach(this.portal);

    this.overlayRef.outsidePointerEvents().subscribe(() => this.sub.close());

    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape' || event.key === 'ArrowLeft') {
        event.stopPropagation();
        this.sub.close();
        this.sub.triggerRef()?.nativeElement.focus();
      }
    });
  }
}
