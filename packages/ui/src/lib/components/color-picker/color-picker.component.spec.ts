import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ColorPickerComponent } from './color-picker.component';

@Component({
  imports: [ColorPickerComponent, FormsModule],
  template: `
    <sanring-color-picker
      [value]="color"
      [swatches]="swatches"
      [ariaLabel]="'Brand color'"
      (valueChange)="latestValue = $event"
    />
    <sanring-color-picker disabled [value]="'#111111'" ariaLabel="Locked color" />
    <sanring-color-picker [(ngModel)]="modelValue" ariaLabel="Model color" class="custom-class" />
  `,
})
class ColorPickerTestHost {
  color = '#2563eb';
  latestValue: string | null = null;
  modelValue = '#16a34a';
  swatches = ['#0f172a', '#2563eb', '#fff'];
}

describe('ColorPickerComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function firstTrigger(fixture: { nativeElement: HTMLElement }): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[sanringpopovertrigger]') as HTMLButtonElement;
  }

  function openFirst(fixture: { nativeElement: HTMLElement; detectChanges: () => void }): void {
    firstTrigger(fixture).click();
    fixture.detectChanges();
  }

  it('renders the current hex on the trigger', () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();

    expect(firstTrigger(fixture).textContent?.trim()).toBe('#2563eb');
  });

  it('commits a native color change and emits valueChange', () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();
    openFirst(fixture);

    const native = overlayContainer
      .getContainerElement()
      .querySelector('input[type="color"]') as HTMLInputElement;
    native.value = '#ef4444';
    native.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.latestValue).toBe('#ef4444');
    expect(firstTrigger(fixture).textContent?.trim()).toBe('#ef4444');
  });

  it('commits a 6-digit hex as the user types and expands a short hex on blur', () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();
    openFirst(fixture);

    const hex = overlayContainer
      .getContainerElement()
      .querySelector('input[sanringinput]') as HTMLInputElement;

    hex.value = '#aabbcc';
    hex.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.latestValue).toBe('#aabbcc');

    hex.value = '#f00';
    hex.dispatchEvent(new Event('input', { bubbles: true }));
    hex.dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.latestValue).toBe('#ff0000');
    expect(hex.value).toBe('#ff0000');
  });

  it('reverts an invalid hex draft on blur', () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();
    openFirst(fixture);

    const hex = overlayContainer
      .getContainerElement()
      .querySelector('input[sanringinput]') as HTMLInputElement;

    hex.value = 'not-a-color';
    hex.dispatchEvent(new Event('input', { bubbles: true }));
    hex.dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.latestValue).toBeNull();
    expect(hex.value).toBe('#2563eb');
  });

  it('selects a swatch and expands 3-digit presets', () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();
    openFirst(fixture);

    const swatch = overlayContainer
      .getContainerElement()
      .querySelector('button[aria-label="#ffffff"]') as HTMLButtonElement;
    swatch.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.latestValue).toBe('#ffffff');
    expect(swatch.getAttribute('aria-pressed')).toBe('true');
  });

  it('does not open while disabled', () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();

    const disabled = fixture.nativeElement.querySelectorAll(
      'button[sanringpopovertrigger]',
    )[1] as HTMLButtonElement;
    expect(disabled.disabled).toBe(true);
    disabled.click();
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('[role="dialog"]')).toBeNull();
  });

  it('keeps an ngModel value instead of resetting to the value input default', async () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const modeled = fixture.nativeElement.querySelectorAll(
      'button[sanringpopovertrigger]',
    )[2] as HTMLButtonElement;
    expect(modeled.textContent?.trim()).toBe('#16a34a');
  });

  it('merges a consumer class onto the host', () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();

    const picker = fixture.nativeElement.querySelectorAll('sanring-color-picker')[2] as HTMLElement;
    expect(picker.classList.contains('custom-class')).toBe(true);
    expect(picker.classList.contains('inline-flex')).toBe(true);
  });

  it('has no axe-detectable a11y violations when given an accessible name', async () => {
    const fixture = TestBed.createComponent(ColorPickerTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement.querySelector('sanring-color-picker')!);
  });
});
