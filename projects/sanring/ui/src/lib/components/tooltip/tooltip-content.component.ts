import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import {
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  OverlayModule,
} from '@angular/cdk/overlay';
import { cn } from '../../utils';
import { TooltipComponent } from './tooltip.component';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'sanring-tooltip-content',
  standalone: true,
  imports: [OverlayModule],
  template: `
    @if (tooltip.triggerOrigin(); as origin) {
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayOpen]="tooltip.isOpen()"
        [cdkConnectedOverlayPositions]="positions"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayViewportMargin]="8"
        (positionChange)="handlePositionChange($event)"
      >
        <div
          [id]="tooltip.contentId"
          [class]="tooltipContentClass"
          [attr.data-side]="renderedSide"
          role="tooltip"
        >
          <ng-content></ng-content>
          <span [class]="tooltipArrowClass" aria-hidden="true"></span>
        </div>
      </ng-template>
    }
  `,
  // 💡 整個 styles 區塊都刪除了，保持元件極致乾淨
})
export class TooltipContentComponent implements OnChanges, OnInit {
  @Input() class: string = '';
  @Input() side: TooltipSide = 'top';
  @Input() sideOffset = 6;

  protected tooltip = inject(TooltipComponent);

  positions: ConnectionPositionPair[] = [];
  renderedSide: TooltipSide = this.side;

  ngOnInit() {
    this.updatePositions();
  }

  ngOnChanges() {
    this.updatePositions();
  }

  private updatePositions() {
    this.positions = this.getPositions(this.side, this.sideOffset);
    this.renderedSide = this.side;
  }

  protected handlePositionChange(event: ConnectedOverlayPositionChange) {
    this.renderedSide = this.getSideFromPosition(event.connectionPair);
  }

  private getPositions(side: TooltipSide, offset: number): ConnectionPositionPair[] {
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
      default:
        return [topPair, bottomPair];
    }
  }

  private getSideFromPosition(position: ConnectionPositionPair): TooltipSide {
    // ... (維持你原本的邏輯) ...
    if (position.originY === 'top' && position.overlayY === 'bottom') return 'top';
    if (position.originY === 'bottom' && position.overlayY === 'top') return 'bottom';
    if (position.originX === 'end' && position.overlayX === 'start') return 'right';
    return 'left';
  }

  protected get tooltipContentClass() {
    return cn(
      // 1. 基礎樣式 + 加入 break-words 防止長文字破版
      'relative z-50 max-w-64 break-words rounded-md border border-[var(--sanring-border-strong)] bg-[var(--sanring-foreground)] px-3 py-1.5 text-xs font-medium leading-5 text-[var(--sanring-background)] shadow-md',

      // 2. 結合 tailwindcss-animate 的超滑順進場動畫
      'animate-in fade-in-0 zoom-in-95',

      // 3. 根據目前渲染的邊，決定它從哪個方向「滑入」
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',

      this.class,
    );
  }

  protected get tooltipArrowClass() {
    return cn(
      'pointer-events-none absolute size-2 rotate-45 border border-[var(--sanring-border-strong)] bg-[var(--sanring-foreground)]',
      this.renderedSide === 'top' && '-bottom-1 left-1/2 -translate-x-1/2 border-l-0 border-t-0',
      this.renderedSide === 'bottom' && '-top-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0',
      this.renderedSide === 'left' && '-right-1 top-1/2 -translate-y-1/2 border-b-0 border-l-0',
      this.renderedSide === 'right' && '-left-1 top-1/2 -translate-y-1/2 border-r-0 border-t-0',
    );
  }
}
