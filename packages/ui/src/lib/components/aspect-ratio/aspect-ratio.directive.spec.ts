import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AspectRatioDirective } from './aspect-ratio.directive';

@Component({
  imports: [AspectRatioDirective],
  template: `
    <div sanringAspectRatio class="overflow-hidden"></div>
    <figure sanringAspectRatio="16 / 9"></figure>
  `,
})
class AspectRatioTestHost {}

describe('AspectRatioDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectRatioTestHost],
    }).compileComponents();
  });

  it('applies a square ratio by default', () => {
    const fixture = TestBed.createComponent(AspectRatioTestHost);
    fixture.detectChanges();

    const aspectRatio = fixture.nativeElement.querySelector('[sanringAspectRatio]') as HTMLElement;

    expect(aspectRatio.getAttribute('style')).toContain('aspect-ratio: 1 / 1');
  });

  it('accepts the ratio from the sanringAspectRatio attribute', () => {
    const fixture = TestBed.createComponent(AspectRatioTestHost);
    fixture.detectChanges();

    const aspectRatio = fixture.nativeElement.querySelector('figure') as HTMLElement;

    expect(aspectRatio.getAttribute('style')).toContain('aspect-ratio: 16 / 9');
  });

  it('preserves custom classes alongside the base container classes', () => {
    const fixture = TestBed.createComponent(AspectRatioTestHost);
    fixture.detectChanges();

    const aspectRatio = fixture.nativeElement.querySelector('[sanringAspectRatio]') as HTMLElement;

    expect(aspectRatio.classList.contains('relative')).toBe(true);
    expect(aspectRatio.classList.contains('w-full')).toBe(true);
    expect(aspectRatio.classList.contains('overflow-hidden')).toBe(true);
  });
});
