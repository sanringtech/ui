import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ButtonDirective } from './button.directive';

@Component({
  imports: [ButtonDirective],
  template: `
    <button type="button" sanringBtn>Save</button>
    <button type="button" sanringBtn [disabled]="true">Save</button>
    <a sanringBtn href="/docs" [disabled]="true">Docs</a>
  `,
})
class ButtonTestHost {}

describe('ButtonDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonTestHost],
    }).compileComponents();
  });

  it('sets the native disabled attribute and blocks the click on a disabled button', () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelectorAll('button')[1] as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');

    const event = new MouseEvent('click', { cancelable: true, bubbles: true });
    button.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('uses tabindex instead of the disabled attribute on a disabled anchor', () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.hasAttribute('disabled')).toBe(false);
    expect(anchor.getAttribute('tabindex')).toBe('-1');
    expect(anchor.getAttribute('aria-disabled')).toBe('true');

    const event = new MouseEvent('click', { cancelable: true, bubbles: true });
    anchor.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves an enabled button free of disabled/aria-disabled', () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelectorAll('button')[0] as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBeNull();
  });
});
