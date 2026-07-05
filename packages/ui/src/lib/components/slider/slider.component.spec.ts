import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SliderComponent } from './slider.component';

@Component({
  imports: [SliderComponent],
  template: `
    <sanring-slider
      [min]="0"
      [max]="10"
      [step]="2"
      [value]="3"
      [ariaLabel]="'Volume'"
      (valueChange)="latestValue = $event"
    />
    <sanring-slider disabled [value]="4" />
  `,
})
class SliderTestHost {
  latestValue: number | null = null;
}

describe('SliderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderTestHost],
    }).compileComponents();
  });

  it('normalizes value and exposes slider aria attributes', () => {
    const fixture = TestBed.createComponent(SliderTestHost);
    fixture.detectChanges();

    const slider = fixture.nativeElement.querySelector('sanring-slider[role="slider"]');

    expect(slider.getAttribute('aria-label')).toBe('Volume');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('10');
    expect(slider.getAttribute('aria-valuenow')).toBe('4');
  });

  it('updates with keyboard steps and emits value changes', () => {
    const fixture = TestBed.createComponent(SliderTestHost);
    fixture.detectChanges();

    const slider = fixture.nativeElement.querySelector('sanring-slider[role="slider"]');
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(slider.getAttribute('aria-valuenow')).toBe('6');
    expect(fixture.componentInstance.latestValue).toBe(6);
  });

  it('drops the left transition while dragging so the thumb tracks the pointer instantly', () => {
    const fixture = TestBed.createComponent(SliderTestHost);
    fixture.detectChanges();

    const slider = fixture.nativeElement.querySelector('sanring-slider[role="slider"]') as HTMLElement;
    const thumb = slider.querySelector('span') as HTMLElement & {
      setPointerCapture: (id: number) => void;
      hasPointerCapture: (id: number) => boolean;
      releasePointerCapture: (id: number) => void;
    };

    // jsdom doesn't implement the Pointer Capture API; stub it so drag handling can run.
    slider.setPointerCapture = () => {};
    slider.hasPointerCapture = () => false;
    slider.releasePointerCapture = () => {};

    expect(thumb.classList.contains('transition-[left]')).toBe(true);

    slider.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1 }));
    fixture.detectChanges();

    expect(thumb.classList.contains('transition-[left]')).toBe(false);

    slider.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
    fixture.detectChanges();

    expect(thumb.classList.contains('transition-[left]')).toBe(true);
  });

  it('does not update when disabled', () => {
    const fixture = TestBed.createComponent(SliderTestHost);
    fixture.detectChanges();

    const sliders = fixture.nativeElement.querySelectorAll('sanring-slider[role="slider"]');
    const disabledSlider = sliders[1];

    disabledSlider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(disabledSlider.getAttribute('aria-disabled')).toBe('true');
    expect(disabledSlider.getAttribute('tabindex')).toBe('-1');
    expect(disabledSlider.getAttribute('aria-valuenow')).toBe('4');
  });
});
