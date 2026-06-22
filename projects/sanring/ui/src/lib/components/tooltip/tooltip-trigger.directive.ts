import { Directive, inject, OnInit } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[sanringTooltipTrigger]',
  standalone: true,
  hostDirectives: [CdkOverlayOrigin],
  host: {
    '[attr.aria-describedby]': 'tooltip.contentId',
    '(mouseenter)': 'tooltip.show()',
    '(mouseleave)': 'tooltip.hide()',
    '(focus)': 'tooltip.show()',
    '(blur)': 'tooltip.hide()',
    '(keydown.escape)': 'tooltip.hide()',
  },
})
export class TooltipTriggerDirective implements OnInit {
  protected tooltip = inject(TooltipComponent);
  private origin = inject(CdkOverlayOrigin);

  ngOnInit() {
    this.tooltip.triggerOrigin.set(this.origin);
  }
}
