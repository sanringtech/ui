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
import { focusAdjacentMenuItem } from '../shared/menu-navigation';
import { NavigationMenuSubComponent } from './navigation-menu-sub.component';

const NAVIGATION_MENU_SUB_CONTENT_POSITIONS: ConnectionPositionPair[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
  { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4 },
  { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -4 },
];

@Component({
  selector: 'sanring-navigation-menu-sub-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menu',
    '[attr.data-state]': 'sub.open() ? "open" : "closed"',
    '[class]': 'contentClass()',
    '(mouseenter)': 'sub.clearCloseTimer()',
    '(mouseleave)': 'sub.scheduleClose()',
  },
  template: `<ng-content></ng-content>`,
})
export class NavigationMenuSubContentComponent {
  protected readonly sub = inject(NavigationMenuSubComponent);
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly class = input<string | undefined>();

  protected readonly contentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'z-50 block min-w-40 overflow-hidden rounded-[var(--sanring-radius-sm)] p-1 outline-none',
      !this.sub.open() && 'hidden',
      this.class(),
    ),
  );

  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;
  private portal: DomPortal<HTMLElement> | null = null;

  constructor() {
    effect(() => {
      const triggerRef = this.sub.triggerRef();

      if (!this.sub.open() || !triggerRef) {
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
      .withPositions(NAVIGATION_MENU_SUB_CONTENT_POSITIONS)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.portal = new DomPortal(this.elementRef);
    this.overlayRef.attach(this.portal);

    this.overlayRef.outsidePointerEvents().subscribe(() => this.sub.close());

    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape' || event.key === 'ArrowLeft') {
        event.preventDefault();
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
    });
  }
}
