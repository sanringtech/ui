import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import type { PopoverAlign } from './popover.type';

let _nextPopoverId = 0;

@Component({
  selector: 'sanring-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
})
export class PopoverComponent {
  private readonly _id = ++_nextPopoverId;

  readonly isOpen = model(false);
  readonly align  = input<PopoverAlign>('center');

  /** 供 PopoverTitle 綁定 id，讓面板 aria-labelledby 自動關聯 */
  readonly titleId = `sanring-popover-${this._id}-title`;
  /** 供 PopoverDescription 綁定 id，讓面板 aria-describedby 自動關聯 */
  readonly descId  = `sanring-popover-${this._id}-desc`;
  /** 供 trigger aria-controls 與 content id 關聯 */
  readonly contentId = `sanring-popover-${this._id}-content`;

  /** 由 PopoverTriggerDirective 登記，供 CDK ConnectedOverlay 定位 */
  triggerOrigin?: CdkOverlayOrigin;

  setOpen(open: boolean): void {
    this.isOpen.set(open);
  }
}
