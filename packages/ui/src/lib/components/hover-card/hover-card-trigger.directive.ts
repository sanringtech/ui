import { Directive, OnDestroy, OnInit, inject } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { HoverCardComponent } from './hover-card.component';

@Directive({
  selector: '[sanringHoverCardTrigger]',
  standalone: true,
  hostDirectives: [CdkOverlayOrigin],
  host: {
    '(mouseenter)': 'hoverCard.open()',
    '(mouseleave)': 'hoverCard.close()',
    '(focus)': 'hoverCard.open()',
    '(blur)': 'hoverCard.close()',
    '(keydown.escape)': 'handleEscape($event)',
  },
})
export class HoverCardTriggerDirective implements OnInit, OnDestroy {
  protected hoverCard = inject(HoverCardComponent);
  private origin = inject(CdkOverlayOrigin);

  ngOnInit() {
    this.hoverCard.triggerOrigin.set(this.origin);
  }

  ngOnDestroy() {
    if (this.hoverCard.triggerOrigin() === this.origin) {
      this.hoverCard.triggerOrigin.set(null);
      this.hoverCard.closeImmediately();
    }
  }

  protected handleEscape(event: Event) {
    if (!this.hoverCard.isOpen()) return;

    event.preventDefault();
    event.stopPropagation();
    this.hoverCard.closeImmediately();
  }
}
