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
