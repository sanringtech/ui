import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
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

@Component({
  imports: [ButtonDirective],
  // sanringBtn adds tabindex/keydown handling itself for a hrefless <a> — the
  // lint rules below can't see cross-directive host bindings.
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <a sanringBtn (click)="activate()">Action</a>
  `,
})
class AnchorNoHrefHost {
  activated = 0;
  activate() {
    this.activated++;
  }
}

@Component({
  imports: [ButtonDirective],
  template: `<a sanringBtn href="/docs">Docs</a>`,
})
class AnchorWithHrefHost {}

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

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });

  it('sets role="button" on an anchor without href', async () => {
    await TestBed.configureTestingModule({ imports: [AnchorNoHrefHost] }).compileComponents();
    const fixture = TestBed.createComponent(AnchorNoHrefHost);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('role')).toBe('button');
  });

  it('does not set role on an anchor with href', async () => {
    await TestBed.configureTestingModule({ imports: [AnchorWithHrefHost] }).compileComponents();
    const fixture = TestBed.createComponent(AnchorWithHrefHost);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('role')).toBeNull();
  });

  it('is keyboard-focusable and activates on Enter/Space when acting as a hrefless button', async () => {
    await TestBed.configureTestingModule({ imports: [AnchorNoHrefHost] }).compileComponents();
    const fixture = TestBed.createComponent(AnchorNoHrefHost);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('tabindex')).toBe('0');

    anchor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(fixture.componentInstance.activated).toBe(1);

    anchor.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(fixture.componentInstance.activated).toBe(2);
  });

  it('does not add a tabindex on an anchor with href (already natively focusable)', async () => {
    await TestBed.configureTestingModule({ imports: [AnchorWithHrefHost] }).compileComponents();
    const fixture = TestBed.createComponent(AnchorWithHrefHost);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('tabindex')).toBeNull();
  });
});
