import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipComponent } from './tooltip.component';
import { TooltipContentComponent } from './tooltip-content.component';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';

@Component({
  imports: [TooltipComponent, TooltipContentComponent, TooltipTriggerDirective],
  template: `
    <sanring-tooltip [delayDuration]="0">
      <button sanringTooltipTrigger type="button">Trigger</button>
      <sanring-tooltip-content>Helpful text</sanring-tooltip-content>
    </sanring-tooltip>
  `,
})
class TooltipTestHost {}

describe('TooltipComponent', () => {
  let fixture: ComponentFixture<TooltipTestHost>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(TooltipTestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('only connects aria-describedby while the tooltip is open', async () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(trigger.hasAttribute('aria-describedby')).toBe(false);

    trigger.dispatchEvent(new FocusEvent('focus'));
    await waitForTooltipDelay();
    fixture.detectChanges();

    const tooltip = overlayContainer.getContainerElement().querySelector('[role="tooltip"]');

    expect(tooltip).toBeTruthy();
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip?.id);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.hasAttribute('aria-describedby')).toBe(false);
  });
});

function waitForTooltipDelay() {
  return new Promise((resolve) => setTimeout(resolve));
}
