import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { DestroyRef, ElementRef } from '@angular/core';

export interface MenuOverlayOptions {
  positions: ConnectionPositionPair[];
  scrollStrategy: 'close' | 'reposition';
  onOutsideClick: () => void;
  onKeydown: (event: KeyboardEvent) => void;
}

// Shared lifecycle controller for overlay-based menu content components (context-menu-content,
// context-menu-sub-content, navigation-menu-sub-content). All three share the same CDK Overlay
// create → attach → outsidePointerEvents → keydownEvents → destroy pattern.
export class MenuOverlayController {
  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;
  private readonly portal: DomPortal<HTMLElement>;

  constructor(
    private readonly overlay: Overlay,
    elementRef: ElementRef<HTMLElement>,
    destroyRef: DestroyRef,
  ) {
    this.portal = new DomPortal(elementRef);
    destroyRef.onDestroy(() => this.overlayRef?.dispose());
  }

  open(
    origin: { x: number; y: number } | ElementRef<HTMLElement>,
    options: MenuOverlayOptions,
  ): void {
    if (!this.overlayRef) {
      this.createOverlay(origin, options);
      return;
    }

    if ('x' in origin) {
      this.positionStrategy!.setOrigin(origin);
    }
    this.overlayRef.updatePosition();
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }
  }

  detach(): void {
    this.overlayRef?.detach();
  }

  private createOverlay(
    origin: { x: number; y: number } | ElementRef<HTMLElement>,
    options: MenuOverlayOptions,
  ): void {
    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(options.positions)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy:
        options.scrollStrategy === 'close'
          ? this.overlay.scrollStrategies.close()
          : this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.attach(this.portal);
    this.overlayRef.outsidePointerEvents().subscribe(() => options.onOutsideClick());
    this.overlayRef.keydownEvents().subscribe((event) => options.onKeydown(event));
  }
}
