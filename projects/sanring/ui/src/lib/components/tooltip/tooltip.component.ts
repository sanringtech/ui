import { Component, OnDestroy, computed, input, signal } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { cn } from '../../utils';

let nextTooltipId = 0;

@Component({
  selector: 'sanring-tooltip',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    style: 'display: contents',
    '[class]': 'tooltipClass()',
  },
})
export class TooltipComponent implements OnDestroy {
  readonly class = input<string | undefined>();
  readonly delayDuration = input(200);

  readonly isOpen = signal(false);
  readonly triggerOrigin = signal<CdkOverlayOrigin | null>(null);
  readonly contentId = `sanring-tooltip-${++nextTooltipId}`;
  protected readonly tooltipClass = computed(() => cn(this.class()));

  private timeoutId?: ReturnType<typeof setTimeout>;

  show() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.isOpen.set(true), this.delayDuration());
  }

  hide() {
    clearTimeout(this.timeoutId);
    this.isOpen.set(false);
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }
}
