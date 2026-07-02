import {
  Directive,
  ElementRef,
  inject,
  input,
  ViewContainerRef,
  OnDestroy,
  TemplateRef,
  signal,
} from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DropdownMenuContext } from './dropdown-menu.type';
import { MenuTrigger as ngMenuTrigger } from '@angular/aria/menu';

const DROPDOWN_MENU_GAP = 4;

const DROPDOWN_MENU_POSITIONS: ConnectionPositionPair[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: DROPDOWN_MENU_GAP,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -DROPDOWN_MENU_GAP,
  },
];

@Directive({
  selector: `[sanringDropdownMenuTrigger]`,
  standalone: true,
  hostDirectives: [ngMenuTrigger],
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'isOpen()',
    '(click)': 'toggle()',
  },
})
export class DropdownMenuTriggerDirective<T> implements OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly sanringDropdownMenuData = input<T | undefined>();
  readonly sanringDropdownMenuTrigger = input.required<TemplateRef<DropdownMenuContext<T>>>();

  private overlayRef: OverlayRef | null = null;
  private menuPortal!: TemplatePortal<DropdownMenuContext<T>>;

  readonly isOpen = signal(false);

  constructor() {
    this.focusMonitor.monitor(this.elementRef);
  }

  toggle(): void {
    if (this.isOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu(): void {
    if (this.overlayRef) {
      this.closeMenu();
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(DROPDOWN_MENU_POSITIONS)
      .withFlexibleDimensions(false)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef.backdropClick().subscribe(() => this.closeMenu());

    const context: DropdownMenuContext<T> = {
      $implicit: this.sanringDropdownMenuData() as T,
      isOpen: true,
      close: () => this.closeMenu(),
    };

    this.menuPortal = new TemplatePortal(this.sanringDropdownMenuTrigger(), this.viewContainerRef, context);
    this.overlayRef.attach(this.menuPortal);
    this.overlayRef.updatePosition();

    this.isOpen.set(true);
  }

  closeMenu(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.closeMenu();
  }
}
