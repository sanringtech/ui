import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { POPOVER_LEAVE_DURATION_MS } from '../component-timing';
import { HoverCardContentComponent } from './hover-card-content.component';
import { HoverCardTriggerDirective } from './hover-card-trigger.directive';
import { HoverCardComponent } from './hover-card.component';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Component({
  imports: [HoverCardComponent, HoverCardTriggerDirective, HoverCardContentComponent],
  template: `
    <sanring-hover-card [openDelay]="0" [closeDelay]="0">
      <button type="button" sanringHoverCardTrigger>Profile</button>
      <sanring-hover-card-content side="right" class="custom-hover-card">
        Details
      </sanring-hover-card-content>
    </sanring-hover-card>
  `,
})
class HoverCardTestHost {}

// Non-zero closeDelay so a content mouseenter has a window to cancel a
// pending close before it fires — closeDelay=0 (used by HoverCardTestHost)
// closes synchronously and can't exercise that cancellation path.
@Component({
  imports: [HoverCardComponent, HoverCardTriggerDirective, HoverCardContentComponent],
  template: `
    <sanring-hover-card [openDelay]="0" [closeDelay]="50">
      <button type="button" sanringHoverCardTrigger>Profile</button>
      <sanring-hover-card-content class="custom-hover-card">Details</sanring-hover-card-content>
    </sanring-hover-card>
  `,
})
class HoverCardCloseDelayTestHost {}

describe('HoverCardComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverCardTestHost, HoverCardCloseDelayTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  async function setup() {
    const fixture = TestBed.createComponent(HoverCardTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  async function setupCloseDelay() {
    const fixture = TestBed.createComponent(HoverCardCloseDelayTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('opens on trigger focus and renders content in an overlay', async () => {
    const fixture = await setup();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;

    trigger.dispatchEvent(new FocusEvent('focus'));
    await wait(0);
    fixture.detectChanges();

    const content = overlayContainer.getContainerElement().querySelector('.custom-hover-card');

    expect(content?.textContent).toContain('Details');
    expect(content?.getAttribute('data-side')).toBe('right');
  });

  it('starts closing when Escape is pressed on the trigger', async () => {
    const fixture = await setup();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;

    trigger.dispatchEvent(new FocusEvent('focus'));
    await wait(0);
    fixture.detectChanges();
    expect(overlayContainer.getContainerElement().querySelector('.custom-hover-card')).toBeTruthy();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    let content = overlayContainer.getContainerElement().querySelector('.custom-hover-card');
    expect(content?.className).toContain('animate-popover-out');

    await wait(POPOVER_LEAVE_DURATION_MS + 20);
    fixture.detectChanges();

    content = overlayContainer.getContainerElement().querySelector('.custom-hover-card');
    expect(content).toBeNull();
  });

  it('opens on trigger mouseenter and closes on mouseleave', async () => {
    const fixture = await setup();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await wait(0);
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('.custom-hover-card')).toBeTruthy();

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    // isOpen flips synchronously-ish (closeDelay=0) but the element stays in the
    // DOM through the leave animation (see the Escape test above for the same wait).
    await wait(POPOVER_LEAVE_DURATION_MS + 20);
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('.custom-hover-card')).toBeFalsy();
  });

  it('stays open when the pointer moves from the trigger onto the card content itself', async () => {
    const fixture = await setupCloseDelay();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await wait(0);
    fixture.detectChanges();

    const content = overlayContainer
      .getContainerElement()
      .querySelector('.custom-hover-card') as HTMLElement;
    expect(content).toBeTruthy();

    // Leaving the trigger starts the (50ms) close timer, but moving onto the
    // content itself before it fires should cancel it — this is the whole
    // point of the content div also having its own mouseenter handler.
    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    content.dispatchEvent(new MouseEvent('mouseenter'));
    await wait(80);
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('.custom-hover-card')).toBeTruthy();
  });

  it('has no axe-detectable a11y violations, trigger and open card together', async () => {
    const fixture = await setup();
    document.body.appendChild(fixture.nativeElement);

    try {
      const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent('focus'));
      await wait(0);
      fixture.detectChanges();

      // "region" is a whole-page landmark check — meaningless below page
      // granularity, and this bare test fixture has no <main> regardless of
      // the hover card's own markup (see select.component.spec.ts for the same call).
      await expectNoA11yViolations(document.body, { rules: { region: { enabled: false } } });
    } finally {
      fixture.nativeElement.remove();
    }
  });
});
