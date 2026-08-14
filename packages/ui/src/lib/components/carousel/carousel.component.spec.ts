import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { CarouselContentComponent } from './carousel-content.component';
import { CarouselItemComponent } from './carousel-item.component';
import { CarouselNextDirective } from './carousel-next.directive';
import { CarouselPreviousDirective } from './carousel-previous.directive';
import { CarouselComponent } from './carousel.component';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

@Component({
  imports: [
    CarouselComponent,
    CarouselContentComponent,
    CarouselItemComponent,
    CarouselPreviousDirective,
    CarouselNextDirective,
  ],
  template: `
    <sanring-carousel
      ariaLabel="Featured testimonials"
      class="custom-carousel"
      orientation="vertical"
    >
      <sanring-carousel-content class="custom-content">
        <sanring-carousel-item class="custom-item">Slide A</sanring-carousel-item>
        <sanring-carousel-item>Slide B</sanring-carousel-item>
      </sanring-carousel-content>
      <button sanringCarouselPrevious class="previous">Previous</button>
      <button sanringCarouselNext class="next">Next</button>
    </sanring-carousel>
  `,
})
class CarouselTestHost {
  @ViewChild(CarouselComponent) carousel!: CarouselComponent;
}

describe('CarouselComponent', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: MockResizeObserver,
    });

    await TestBed.configureTestingModule({
      imports: [CarouselTestHost],
    }).compileComponents();
  });

  async function setup() {
    const fixture = TestBed.createComponent(CarouselTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders carousel region, viewport, and slide semantics', async () => {
    const fixture = await setup();

    const carousel = fixture.nativeElement.querySelector('sanring-carousel') as HTMLElement;
    const content = fixture.nativeElement.querySelector('sanring-carousel-content') as HTMLElement;
    const slides = fixture.nativeElement.querySelectorAll('sanring-carousel-item');

    expect(carousel.getAttribute('role')).toBe('region');
    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
    expect(carousel.getAttribute('aria-label')).toBe('Featured testimonials');
    expect(carousel.getAttribute('data-orientation')).toBe('vertical');
    expect(carousel.className).toContain('custom-carousel');
    expect(content.className).toContain('custom-content');
    expect(slides[0].getAttribute('role')).toBe('group');
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(slides[0].className).toContain('custom-item');
  });

  it('renders previous and next controls as native buttons', async () => {
    const fixture = await setup();

    const previous = fixture.nativeElement.querySelector('.previous') as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector('.next') as HTMLButtonElement;

    expect(previous.type).toBe('button');
    expect(next.type).toBe('button');
  });

  it('wires the previous/next buttons to scrollPrev/scrollNext', async () => {
    const fixture = await setup();
    const carousel = fixture.componentInstance.carousel;
    const scrollPrev = vi.spyOn(carousel, 'scrollPrev');
    const scrollNext = vi.spyOn(carousel, 'scrollNext');

    // Both buttons start disabled (canScrollPrev/canScrollNext default false) — enable
    // them so the click actually reaches the host listener, same as a real carousel
    // with content on both sides of the current slide.
    carousel.canScrollPrev.set(true);
    carousel.canScrollNext.set(true);
    fixture.detectChanges();

    const previous = fixture.nativeElement.querySelector('.previous') as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector('.next') as HTMLButtonElement;

    previous.click();
    expect(scrollPrev).toHaveBeenCalledTimes(1);

    next.click();
    expect(scrollNext).toHaveBeenCalledTimes(1);
  });

  it('disables the previous/next buttons based on canScrollPrev/canScrollNext', async () => {
    const fixture = await setup();
    const carousel = fixture.componentInstance.carousel;

    carousel.canScrollPrev.set(false);
    carousel.canScrollNext.set(true);
    fixture.detectChanges();

    const previous = fixture.nativeElement.querySelector('.previous') as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector('.next') as HTMLButtonElement;
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    carousel.canScrollPrev.set(true);
    carousel.canScrollNext.set(false);
    fixture.detectChanges();

    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(true);
  });

  it('scrolls with ArrowUp/ArrowDown when vertical, ignoring the horizontal keys', async () => {
    const fixture = await setup();
    const carousel = fixture.componentInstance.carousel;
    const scrollPrev = vi.spyOn(carousel, 'scrollPrev');
    const scrollNext = vi.spyOn(carousel, 'scrollNext');
    const root = fixture.nativeElement.querySelector('sanring-carousel') as HTMLElement;

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(scrollPrev).not.toHaveBeenCalled();

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(scrollPrev).toHaveBeenCalledTimes(1);

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(scrollNext).toHaveBeenCalledTimes(1);
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = await setup();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
