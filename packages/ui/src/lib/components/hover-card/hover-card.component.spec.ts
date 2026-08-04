import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

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

describe('HoverCardComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverCardTestHost],
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
});
