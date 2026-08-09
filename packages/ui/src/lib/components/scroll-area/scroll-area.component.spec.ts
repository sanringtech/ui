import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ScrollAreaComponent } from './scroll-area.component';
import { ScrollAreaDirective } from './scroll-area.directive';

@Component({
  imports: [ScrollAreaComponent, ScrollAreaDirective],
  template: `
    <sanring-scroll-area>Unlabelled</sanring-scroll-area>
    <sanring-scroll-area ariaLabel="Activity log">Labelled</sanring-scroll-area>
    <h2 id="scroll-heading">Directive scroll area</h2>
    <div sanringScrollArea ariaLabelledby="scroll-heading">Directive</div>
  `,
})
class ScrollAreaTestHost {}

describe('ScrollAreaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollAreaTestHost],
    }).compileComponents();
  });

  it('only exposes a region landmark when a label is provided', () => {
    const fixture = TestBed.createComponent(ScrollAreaTestHost);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const scrollAreas = nativeElement.querySelectorAll('sanring-scroll-area');
    const directiveArea = nativeElement.querySelector('[sanringScrollArea]');

    expect(scrollAreas[0].getAttribute('role')).toBeNull();
    expect(scrollAreas[0].getAttribute('aria-label')).toBeNull();
    expect(scrollAreas[1].getAttribute('role')).toBe('region');
    expect(scrollAreas[1].getAttribute('aria-label')).toBe('Activity log');
    expect(directiveArea?.getAttribute('role')).toBe('region');
    expect(directiveArea?.getAttribute('aria-labelledby')).toBe('scroll-heading');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(ScrollAreaTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
