import {
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  Overlay,
  OverlayModule,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS, POPOVER_SURFACE_CLASS } from '../component-styles';
import { PopoverComponent } from './popover.component';
import type { PopoverAlign } from './popover.type';

const GAP = 8;
// 退場動畫實際時長由 CSS（--animate-popover-out）決定，這裡只是 animationend
// 沒觸發時的保底上限，數字不必跟 CSS 精準同步。
const LEAVE_DURATION_MS = 150;

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
        [cdkConnectedOverlayOpen]="visuallyOpen()"
        [cdkConnectedOverlayPositions]="positions()"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayViewportMargin]="16"
        [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
        (overlayOutsideClick)="requestClose()"
        (detach)="onDetach()"
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
          (animationend)="onLeaveAnimationEnd($event)"
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
  private readonly destroyRef = inject(DestroyRef);

  readonly class = input<string | undefined>();

  protected readonly scrollStrategy = this.overlay.scrollStrategies.close();
  protected readonly renderedPlacement = signal<PopoverPlacement>('bottom');

  private readonly _leaving = signal(false);
  private _leaveTimer: ReturnType<typeof setTimeout> | undefined;

  /** Keep overlay in DOM during leave animation */
  protected readonly visuallyOpen = computed(
    () => this.popover.isOpen() || this._leaving(),
  );

  protected readonly positions: Signal<ConnectionPositionPair[]> = computed(() => {
    const align = this.popover.align();
    return FALLBACK_PLACEMENTS.map(placement => positionFor(placement, align));
  });

  constructor() {
    effect(() => {
      this.popover.align();
      this.renderedPlacement.set('bottom');
    });

    // Watch for external isOpen → false transitions and play leave animation
    let prevOpen = false;
    effect(() => {
      const isOpen = this.popover.isOpen();
      untracked(() => {
        if (prevOpen && !isOpen && !this._leaving()) {
          this._startLeave();
        }
        prevOpen = isOpen;
      });
    });

    this.destroyRef.onDestroy(() => clearTimeout(this._leaveTimer));
  }

  protected readonly panelClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      POPOVER_SURFACE_CLASS,
      this._leaving() ? 'animate-popover-out' : 'animate-popover-in',
      this.class(),
    ),
  );

  protected requestClose(): void {
    if (this._leaving() || !this.popover.isOpen()) return;
    this.popover.setOpen(false);
    // isOpen change triggers the effect which calls _startLeave
  }

  protected onDetach(): void {
    this._endLeave();
    if (this.popover.isOpen()) {
      this.popover.setOpen(false);
    }
  }

  /** 退場 CSS 動畫（animate-popover-out）真的播完時觸發，是結束 leaving 狀態的主要途徑 */
  protected onLeaveAnimationEnd(event: AnimationEvent): void {
    if (event.target !== event.currentTarget || !this._leaving()) return;
    this._endLeave();
  }

  protected handleOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.requestClose();
  }

  protected handlePositionChange(event: ConnectedOverlayPositionChange): void {
    this.renderedPlacement.set(getPlacementFromPosition(event.connectionPair));
  }

  private _startLeave(): void {
    this._leaving.set(true);
    // 保底 timer：animationend 因故沒觸發時（例如動畫被中途打斷）避免卡在 leaving 狀態出不來
    this._leaveTimer = setTimeout(() => this._endLeave(), LEAVE_DURATION_MS);
  }

  private _endLeave(): void {
    clearTimeout(this._leaveTimer);
    this._leaveTimer = undefined;
    this._leaving.set(false);
  }
}
