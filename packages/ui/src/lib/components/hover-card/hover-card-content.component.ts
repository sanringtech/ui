import {
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  Overlay,
  OverlayModule,
} from '@angular/cdk/overlay';
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS, POPOVER_SURFACE_CLASS } from '../component-styles';
import { HoverCardComponent } from './hover-card.component';
import { HoverCardSide } from './hover-card.type';

const LEAVE_DURATION_MS = 150;

@Component({
  selector: 'sanring-hover-card-content',
  standalone: true,
  imports: [OverlayModule],
  template: `
    @if (hoverCard.triggerOrigin(); as origin) {
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayOpen]="visuallyOpen()"
        [cdkConnectedOverlayPositions]="positions"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayViewportMargin]="8"
        [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
        (overlayKeydown)="handleOverlayKeydown($event)"
        (positionChange)="handlePositionChange($event)"
        (detach)="onDetach()"
      >
        <div
          [class]="hoverCardContentClass()"
          [attr.data-side]="renderedSide()"
          (mouseenter)="hoverCard.open()"
          (mouseleave)="hoverCard.close()"
          (focusin)="hoverCard.open()"
          (focusout)="hoverCard.close()"
        >
          <ng-content></ng-content>
        </div>
      </ng-template>
    }
  `,
})
export class HoverCardContentComponent {
  readonly side = input<HoverCardSide>('bottom');
  readonly sideOffset = input(8);
  readonly class = input<string | undefined>();

  protected hoverCard = inject(HoverCardComponent);
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly scrollStrategy = this.overlay.scrollStrategies.reposition();
  positions: ConnectionPositionPair[] = [];
  protected renderedSide = signal<HoverCardSide>(this.side());

  // Keep overlay in DOM during leave animation，寫法對齊 sanring-popover-content
  private readonly _leaving = signal(false);
  private _leaveTimer?: ReturnType<typeof setTimeout>;

  protected readonly visuallyOpen = computed(() => this.hoverCard.isOpen() || this._leaving());

  protected readonly hoverCardContentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      POPOVER_SURFACE_CLASS,
      'w-64',
      this._leaving() ? 'animate-popover-out' : 'animate-popover-in',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      this.updatePositions(this.side(), this.sideOffset());
    });

    // Watch for isOpen → false transitions and play leave animation
    let prevOpen = false;
    effect(() => {
      const isOpen = this.hoverCard.isOpen();
      untracked(() => {
        if (prevOpen && !isOpen && !this._leaving()) {
          this._startLeave();
        }
        prevOpen = isOpen;
      });
    });

    this.destroyRef.onDestroy(() => clearTimeout(this._leaveTimer));
  }

  private updatePositions(side: HoverCardSide, offset: number) {
    this.positions = this.getPositions(side, offset);
    this.renderedSide.set(side);
  }

  protected handlePositionChange(event: ConnectedOverlayPositionChange) {
    this.renderedSide.set(this.getSideFromPosition(event.connectionPair));
  }

  protected handleOverlayKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;

    event.preventDefault();
    event.stopPropagation();
    this.hoverCard.closeImmediately();
  }

  protected onDetach(): void {
    clearTimeout(this._leaveTimer);
    this._leaving.set(false);
  }

  private _startLeave(): void {
    this._leaving.set(true);
    this._leaveTimer = setTimeout(() => this._leaving.set(false), LEAVE_DURATION_MS);
  }

  private getPositions(side: HoverCardSide, offset: number): ConnectionPositionPair[] {
    const topPair: ConnectionPositionPair = {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -offset,
    };
    const bottomPair: ConnectionPositionPair = {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: offset,
    };
    const rightPair: ConnectionPositionPair = {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: offset,
    };
    const leftPair: ConnectionPositionPair = {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: -offset,
    };

    switch (side) {
      case 'top':
        return [topPair, bottomPair, rightPair, leftPair];
      case 'bottom':
        return [bottomPair, topPair, rightPair, leftPair];
      case 'right':
        return [rightPair, leftPair, topPair, bottomPair];
      case 'left':
        return [leftPair, rightPair, topPair, bottomPair];
    }
  }

  private getSideFromPosition(position: ConnectionPositionPair): HoverCardSide {
    if (position.originY === 'top' && position.overlayY === 'bottom') return 'top';
    if (position.originY === 'bottom' && position.overlayY === 'top') return 'bottom';
    if (position.originX === 'end' && position.overlayX === 'start') return 'right';
    return 'left';
  }
}
