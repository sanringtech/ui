import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { PopoverComponent } from './popover.component';
import { PopoverContentComponent } from './popover-content.component';
import { PopoverDescriptionComponent } from './popover-description.component';
import { PopoverTitleComponent } from './popover-title.component';
import { PopoverTriggerDirective } from './popover-trigger.directive';

@Component({
  imports: [
    PopoverComponent,
    PopoverContentComponent,
    PopoverDescriptionComponent,
    PopoverTitleComponent,
    PopoverTriggerDirective,
  ],
  template: `
    <sanring-popover>
      <button type="button" sanringPopoverTrigger>Open</button>
      <sanring-popover-content>
        <sanring-popover-title>Title</sanring-popover-title>
        <sanring-popover-description>Description</sanring-popover-description>
      </sanring-popover-content>
    </sanring-popover>
  `,
})
class PopoverTestHost {}

describe('PopoverComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('starts closed with no dialog rendered', () => {
    const fixture = TestBed.createComponent(PopoverTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeNull();
    expect(overlayContainer.getContainerElement().querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens the panel on trigger click and links it to the title/description', () => {
    const fixture = TestBed.createComponent(PopoverTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();

    const overlayElement = overlayContainer.getContainerElement();
    const panel = overlayElement.querySelector('[role="dialog"]');
    const title = overlayElement.querySelector('sanring-popover-title');
    const description = overlayElement.querySelector('sanring-popover-description');

    expect(panel).toBeTruthy();
    expect(panel?.id).toBe(trigger.getAttribute('aria-controls'));
    expect(panel?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(panel?.getAttribute('aria-describedby')).toBe(description?.id);
  });

  it('closes on a second trigger click, after the leave animation removes the panel', async () => {
    const fixture = TestBed.createComponent(PopoverTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await wait(200);
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes when Escape is pressed inside the panel', async () => {
    const fixture = TestBed.createComponent(PopoverTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const panel = overlayContainer.getContainerElement().querySelector('[role="dialog"]') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await wait(200);
    fixture.detectChanges();
  });
});
