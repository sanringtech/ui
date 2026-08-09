import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { TagComponent } from './tag.component';

@Component({
  imports: [TagComponent],
  template: `
    <sanring-tag closable>Default</sanring-tag>
    <sanring-tag closable removeAriaLabel="Remove Angular tag">Angular</sanring-tag>
  `,
})
class TagTestHost {}

describe('TagComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagTestHost],
    }).compileComponents();
  });

  it('allows the remove button label to be customized', () => {
    const fixture = TestBed.createComponent(TagTestHost);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons[0].getAttribute('aria-label')).toBe('Remove tag');
    expect(buttons[1].getAttribute('aria-label')).toBe('Remove Angular tag');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(TagTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
