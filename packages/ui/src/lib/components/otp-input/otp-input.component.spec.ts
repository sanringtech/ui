import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { OtpInputComponent } from './otp-input.component';
import { OtpInputSeparatorComponent } from './otp-input-separator.component';
import { OtpInputSlotComponent } from './otp-input-slot.component';
import { OtpInputValueChangeEvent } from './otp-input.types';

@Component({
  imports: [OtpInputComponent, ReactiveFormsModule],
  template: `
    <sanring-otp-input
      class="custom-class"
      [length]="4"
      [value]="value"
      [pattern]="pattern"
      (valueChange)="latestValue = $event"
      (stateChange)="latestState = $event"
      (complete)="latestComplete = $event.value"
    />
  `,
})
class OtpInputTestHost {
  value = '';
  pattern: RegExp | string | null = null;
  latestValue = '';
  latestState: OtpInputValueChangeEvent | null = null;
  latestComplete = '';
}

@Component({
  imports: [ErrorMessageComponent, OtpInputComponent, ReactiveFormsModule, SanringFieldComponent],
  template: `
    <sanring-field>
      <sanring-otp-input [formControl]="control" ariaLabel="Verification code" />
      <sanring-error-message>Code is required.</sanring-error-message>
    </sanring-field>
  `,
})
class OtpInputFieldTestHost {
  readonly control = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
}

@Component({
  imports: [OtpInputComponent, OtpInputSeparatorComponent, OtpInputSlotComponent],
  template: `
    <sanring-otp-input [length]="6" [value]="'123456'" ariaLabel="Separated code">
      <sanring-otp-input-slot [index]="0" />
      <sanring-otp-input-slot [index]="1" />
      <sanring-otp-input-slot [index]="2" />
      <sanring-otp-input-separator />
      <sanring-otp-input-slot [index]="3" />
      <sanring-otp-input-slot [index]="4" />
      <sanring-otp-input-slot [index]="5" />
    </sanring-otp-input>
  `,
})
class OtpInputComposedTestHost {}

function inputAt(fixture: { nativeElement: HTMLElement }, index: number): HTMLInputElement {
  return fixture.nativeElement.querySelectorAll('input')[index] as HTMLInputElement;
}

function setInputValue(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new InputEvent('input', { bubbles: true }));
}

function slotValues(fixture: { nativeElement: HTMLElement }): string[] {
  return Array.from(fixture.nativeElement.querySelectorAll<HTMLElement>('[data-otp-slot]')).map(
    (slot) => slot.textContent?.trim() ?? '',
  );
}

describe('OtpInputComponent', () => {
  it('renders without error', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement).toBeTruthy();
  });

  it('merges host class with consumer class', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('sanring-otp-input');
    expect(host?.classList.contains('custom-class')).toBe(true);
  });

  it('renders the requested number of slots', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(1);
    expect(fixture.nativeElement.querySelectorAll('[data-otp-slot]')).toHaveLength(4);
  });

  it('keeps the native input mobile-safe and lets slots shrink without a scrollbar', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('sanring-otp-input') as HTMLElement;
    const input = inputAt(fixture, 0);
    const slot = fixture.nativeElement.querySelector('[data-otp-slot]') as HTMLElement;

    expect(input.type).toBe('text');
    expect(input.classList.contains('inset-0')).toBe(true);
    expect(input.classList.contains('text-base')).toBe(true);
    expect(host.classList.contains('overflow-x-auto')).toBe(false);
    expect(slot.classList.contains('min-w-0')).toBe(true);
    expect(slot.classList.contains('shrink')).toBe(true);
    expect(slot.classList.contains('shrink-0')).toBe(false);
  });

  it('renders focus inside the active slot without moving it', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    const input = inputAt(fixture, 0);
    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    fixture.detectChanges();

    const activeSlot = fixture.nativeElement.querySelector(
      '[data-otp-slot][data-state="active"]',
    ) as HTMLElement;
    expect(activeSlot.classList.contains('ring-inset')).toBe(true);
    expect(activeSlot.classList.contains('ring-offset-2')).toBe(false);
  });

  it('supports projected slots and separators', () => {
    const fixture = TestBed.createComponent(OtpInputComposedTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(1);
    expect(fixture.nativeElement.querySelectorAll('[data-otp-slot]')).toHaveLength(6);
    expect(
      fixture.nativeElement.querySelector('sanring-otp-input-separator')?.textContent,
    ).toContain('-');
    expect(slotValues(fixture)).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('filters numeric input and emits value/state changes', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    setInputValue(inputAt(fixture, 0), 'a1');
    fixture.detectChanges();

    expect(inputAt(fixture, 0).value).toBe('1');
    expect(slotValues(fixture)).toEqual(['1', '', '', '']);
    expect(fixture.componentInstance.latestValue).toBe('1');
    expect(fixture.componentInstance.latestState?.complete).toBe(false);
  });

  it('uses a custom pattern when provided', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.componentInstance.pattern = /^[A-Z]$/;
    fixture.detectChanges();

    setInputValue(inputAt(fixture, 0), '1A');
    fixture.detectChanges();

    expect(inputAt(fixture, 0).value).toBe('A');
    expect(slotValues(fixture)).toEqual(['A', '', '', '']);
    expect(fixture.componentInstance.latestValue).toBe('A');
  });

  it('fills multiple slots when a user pastes a code', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    const pasteEvent = new Event('paste', { bubbles: true }) as ClipboardEvent;
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: () => '12a345' },
    });
    inputAt(fixture, 0).dispatchEvent(pasteEvent);
    fixture.detectChanges();

    expect(fixture.componentInstance.latestValue).toBe('1234');
    expect(fixture.componentInstance.latestComplete).toBe('1234');
    expect(slotValues(fixture)).toEqual(['1', '2', '3', '4']);
  });

  it('clears the current slot on backspace without shifting later slots', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.componentInstance.value = '1234';
    fixture.detectChanges();

    const slots = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[data-otp-slot]',
    );
    slots[1].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    inputAt(fixture, 0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }),
    );
    fixture.detectChanges();

    expect(slotValues(fixture)).toEqual(['1', '', '3', '4']);
    expect(fixture.componentInstance.latestValue).toBe('134');
  });

  it('moves the active slot with ArrowLeft/ArrowRight/Home/End', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.componentInstance.value = '1234';
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const activeState = () =>
      Array.from(nativeElement.querySelectorAll<HTMLElement>('[data-otp-slot]')).findIndex(
        (slot) => slot.getAttribute('data-state') === 'active',
      );

    const input = inputAt(fixture, 0);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(activeState()).toBe(3);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(activeState()).toBe(2);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(activeState()).toBe(3);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(activeState()).toBe(0);
  });

  it('does not emit changes while disabled', () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    const component = fixture.debugElement.children[0].componentInstance as OtpInputComponent;
    component.setDisabledState(true);
    fixture.detectChanges();

    setInputValue(inputAt(fixture, 0), '1');
    fixture.detectChanges();

    expect(fixture.componentInstance.latestValue).toBe('');
    expect(inputAt(fixture, 0).disabled).toBe(true);
  });

  it('integrates with sanring-field error state', async () => {
    const fixture = TestBed.createComponent(OtpInputFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
  });

  it('marks touched when focus leaves all slots', async () => {
    const fixture = TestBed.createComponent(OtpInputTestHost);
    fixture.detectChanges();

    const component = fixture.debugElement.children[0].componentInstance as OtpInputComponent;
    const touched = vi.fn();
    component.registerOnTouched(touched);

    inputAt(fixture, 0).dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    inputAt(fixture, 0).dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await fixture.whenStable();

    expect(touched).toHaveBeenCalledOnce();
  });

  it('has no axe-detectable a11y violations when given an accessible name', async () => {
    const fixture = TestBed.createComponent(OtpInputComposedTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
