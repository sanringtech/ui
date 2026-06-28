import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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
});
