import {
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  Overlay,
  OverlayModule,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils';
import { PopoverComponent } from './popover.component';
import type { PopoverAlign } from './popover.type';

const GAP = 8;
type PopoverPlacement = 'top' | 'bottom';

const FALLBACK_PLACEMENTS: readonly PopoverPlacement[] = ['bottom', 'top'];

function positionFor(placement: PopoverPlacement, align: PopoverAlign): ConnectionPositionPair {
  if (placement === 'top') {
    return {
      originX: align,
      originY: 'top',
      overlayX: align,
      overlayY: 'bottom',
      offsetY: -GAP,
    };
  }

  return {
    originX: align,
    originY: 'bottom',
    overlayX: align,
    overlayY: 'top',
    offsetY: GAP,
  };
}

function getPlacementFromPosition(position: ConnectionPositionPair): PopoverPlacement {
  if (position.originY === 'top' && position.overlayY === 'bottom') return 'top';
  return 'bottom';
}

@Component({
  selector: 'sanring-popover-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayModule],
  template: `
    @if (popover.triggerOrigin; as origin) {
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayOpen]="popover.isOpen()"
        [cdkConnectedOverlayPositions]="positions()"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayViewportMargin]="16"
        [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
        [cdkConnectedOverlayHasBackdrop]="true"
        cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
        (backdropClick)="close()"
        (detach)="close()"
        (overlayKeydown)="handleOverlayKeydown($event)"
        (positionChange)="handlePositionChange($event)"
      >
        <div
          tabindex="-1"
          role="dialog"
          [id]="popover.contentId"
          [attr.aria-labelledby]="popover.titleId"
          [attr.aria-describedby]="popover.descId"
          [attr.data-placement]="renderedPlacement()"
          [class]="panelClass()"
        >
          <ng-content></ng-content>
        </div>
      </ng-template>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class PopoverContentComponent {
  protected readonly popover = inject(PopoverComponent);
  private readonly overlay = inject(Overlay);

  readonly class = input<string | undefined>();

  protected readonly scrollStrategy = this.overlay.scrollStrategies.close();
  protected readonly renderedPlacement = signal<PopoverPlacement>('bottom');
  protected readonly positions: Signal<ConnectionPositionPair[]> = computed(() => {
    const align = this.popover.align();
    return FALLBACK_PLACEMENTS.map(placement => positionFor(placement, align));
  });

  constructor() {
    effect(() => {
      this.popover.align();
      this.renderedPlacement.set('bottom');
    });
  }

  protected readonly panelClass = computed(() =>
    cn(
      'z-50 w-72 rounded-md border p-4 shadow-md outline-none',
      'bg-[var(--sanring-elevated)] border-[var(--sanring-border)] text-[var(--sanring-foreground)]',
      'animate-in fade-in-0 zoom-in-95',
      'data-[placement=bottom]:slide-in-from-top-2 data-[placement=bottom]:origin-top',
      'data-[placement=top]:slide-in-from-bottom-2 data-[placement=top]:origin-bottom',
      this.class(),
    ),
  );

  protected close(): void {
    this.popover.setOpen(false);
  }

  protected handleOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.close();
  }

  protected handlePositionChange(event: ConnectedOverlayPositionChange): void {
    this.renderedPlacement.set(getPlacementFromPosition(event.connectionPair));
  }
}
