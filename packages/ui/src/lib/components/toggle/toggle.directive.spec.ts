import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ToggleDirective } from './toggle.directive';

@Component({
  imports: [ToggleDirective],
  template: `
    <button type="button" sanringToggle>Bold</button>
    <button type="button" sanringToggle [disabled]="true">Italic</button>
  `,
})
class ToggleTestHost {}

describe('ToggleDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleTestHost],
    }).compileComponents();
  });

  it('toggles pressed state and aria-pressed/data-state on click', () => {
    const fixture = TestBed.createComponent(ToggleTestHost);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelectorAll('button')[0] as HTMLButtonElement;
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(toggle.getAttribute('data-state')).toBe('off');

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(toggle.getAttribute('data-state')).toBe('on');

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });

  it('ignores clicks while disabled', () => {
    const fixture = TestBed.createComponent(ToggleTestHost);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelectorAll('button')[1] as HTMLButtonElement;
    expect(toggle.disabled).toBe(true);

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });
});
