import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { Menu as ngMenu } from '@angular/aria/menu';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { cn } from '../shared/utils';
import { OVERLAY_SURFACE_CLASS } from '../shared/component-styles';
import { DropdownMenuSubComponent } from './dropdown-menu-sub.component';

const SUB_CONTENT_POSITIONS: ConnectionPositionPair[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
  { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-dropdown-menu-sub-content',
  standalone: true,
  exportAs: 'sanringDropdownMenuSubContent',
  hostDirectives: [
    {
      directive: ngMenu,
      inputs: ['id', 'wrap', 'typeaheadDelay'],
      outputs: ['itemSelected'],
    },
  ],
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'contentClass()',
  },
})
export class DropdownMenuSubContentComponent implements OnDestroy {
  readonly menu = inject(ngMenu, { self: true });
  private readonly sub = inject(DropdownMenuSubComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);

  readonly class = input<string | undefined>();

  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;

  protected readonly contentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'z-50 block min-w-32 overflow-hidden rounded-[var(--sanring-radius-sm)] p-1 outline-none',
      'data-[visible=false]:hidden',
      this.menu.visible() ? 'animate-popover-in' : '',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const trigger = this.sub.triggerRef();
      if (trigger && !this.overlayRef) {
        this.attachOverlay(trigger.nativeElement);
      }
    });

    effect(() => {
      if (this.menu.visible()) {
        queueMicrotask(() => this.overlayRef?.updatePosition());
      }
    });
  }

  private attachOverlay(trigger: HTMLElement): void {
    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions(SUB_CONTENT_POSITIONS)
      .withFlexibleDimensions(false)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.attach(new DomPortal(this.elementRef.nativeElement));
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }
}
