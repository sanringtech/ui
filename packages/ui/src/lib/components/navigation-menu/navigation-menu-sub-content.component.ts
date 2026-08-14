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
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS } from '../component-styles';
import { focusAdjacentMenuItem } from '../shared/menu-navigation';
import { MenuOverlayController } from '../shared/menu-overlay-controller';
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
      'z-50 block min-w-40 overflow-hidden rounded-[var(--sanring-radius-lg)] p-2 outline-none',
      !this.sub.open() && 'hidden',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const triggerRef = this.sub.triggerRef();

      if (!this.sub.open() || !triggerRef) {
        this.overlayCtrl.detach();
        return;
      }

      this.overlayCtrl.open(triggerRef, {
        positions: NAVIGATION_MENU_SUB_CONTENT_POSITIONS,
        scrollStrategy: 'reposition',
        onOutsideClick: () => this.sub.close(),
        onKeydown: (event) => {
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
        },
      });

      if (this.sub.consumeFocusFirstItemOnOpen()) {
        focusAdjacentMenuItem(this.elementRef.nativeElement, 1);
      }
    });
  }
}
