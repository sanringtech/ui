import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
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

@Component({
  imports: [TooltipComponent, TooltipContentComponent, TooltipTriggerDirective],
  template: `
    <sanring-tooltip [delayDuration]="0" class="custom-root-class">
      <button sanringTooltipTrigger type="button">Trigger</button>
      <sanring-tooltip-content class="custom-content-class">Helpful text</sanring-tooltip-content>
    </sanring-tooltip>
  `,
})
class TooltipClassTestHost {}

@Component({
  imports: [TooltipComponent, TooltipContentComponent, TooltipTriggerDirective],
  template: `
    <sanring-tooltip delayDuration="0">
      <button sanringTooltipTrigger type="button">Trigger</button>
      <sanring-tooltip-content sideOffset="12">Helpful text</sanring-tooltip-content>
    </sanring-tooltip>
  `,
})
class TooltipAttributeTestHost {}

describe('TooltipComponent', () => {
  let fixture: ComponentFixture<TooltipTestHost>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipTestHost, TooltipClassTestHost, TooltipAttributeTestHost],
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

  it('shows the tooltip on mouseenter and hides it on mouseleave', async () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await waitForTooltipDelay();
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('[role="tooltip"]')).toBeTruthy();

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('[role="tooltip"]')).toBeFalsy();
  });

  it('merges host class with consumer class on both the root and the content surface', async () => {
    const classFixture = TestBed.createComponent(TooltipClassTestHost);
    classFixture.detectChanges();

    const root = classFixture.nativeElement.querySelector('sanring-tooltip') as HTMLElement;
    expect(root.classList.contains('custom-root-class')).toBe(true);

    const trigger: HTMLButtonElement = classFixture.nativeElement.querySelector('button');
    trigger.dispatchEvent(new FocusEvent('focus'));
    await waitForTooltipDelay();
    classFixture.detectChanges();

    const tooltip = overlayContainer.getContainerElement().querySelector('[role="tooltip"]');
    expect(tooltip?.classList.contains('custom-content-class')).toBe(true);
  });

  it('coerces numeric attribute inputs', () => {
    const attrFixture = TestBed.createComponent(TooltipAttributeTestHost);
    attrFixture.detectChanges();

    const tooltipDebug = attrFixture.debugElement.query(
      (debugEl) => debugEl.componentInstance instanceof TooltipComponent,
    );
    const contentDebug = attrFixture.debugElement.query(
      (debugEl) => debugEl.componentInstance instanceof TooltipContentComponent,
    );

    expect((tooltipDebug.componentInstance as TooltipComponent).delayDuration()).toBe(0);
    expect((contentDebug.componentInstance as TooltipContentComponent).sideOffset()).toBe(12);
  });

  it('has no axe-detectable a11y violations, trigger and open tooltip together', async () => {
    document.body.appendChild(fixture.nativeElement);

    try {
      const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new FocusEvent('focus'));
      await waitForTooltipDelay();
      fixture.detectChanges();

      // "region" is a whole-page landmark check — meaningless below page
      // granularity, and this bare test fixture has no <main> regardless of
      // the tooltip's own markup (see select.component.spec.ts for the same call).
      await expectNoA11yViolations(document.body, { rules: { region: { enabled: false } } });
    } finally {
      fixture.nativeElement.remove();
    }
  });
});

function waitForTooltipDelay() {
  return new Promise((resolve) => setTimeout(resolve));
}
