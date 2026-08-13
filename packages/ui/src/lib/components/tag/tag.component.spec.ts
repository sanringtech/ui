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

@Component({
  imports: [TagComponent],
  template: `<sanring-tag class="my-tag">Label</sanring-tag>`,
})
class TagClassHost {}

@Component({
  imports: [TagComponent],
  template: `<sanring-tag closable (remove)="onRemove()">Label</sanring-tag>`,
})
class TagRemoveHost {
  removed = false;
  onRemove() { this.removed = true; }
}

describe('TagComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagTestHost, TagClassHost, TagRemoveHost],
    }).compileComponents();
  });

  it('allows the remove button label to be customized', () => {
    const fixture = TestBed.createComponent(TagTestHost);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons[0].getAttribute('aria-label')).toBe('Remove tag');
    expect(buttons[1].getAttribute('aria-label')).toBe('Remove Angular tag');
  });

  it('merges consumer class onto the inner badge span', () => {
    const fixture = TestBed.createComponent(TagClassHost);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span[sanringBadge]') as HTMLElement;

    expect(span.className).toContain('my-tag');
    expect(span.className).toContain('inline-flex');
  });

  it('emits remove event when the close button is clicked', () => {
    const fixture = TestBed.createComponent(TagRemoveHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(TagTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
