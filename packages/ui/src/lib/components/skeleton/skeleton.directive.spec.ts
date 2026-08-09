import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { SkeletonDirective } from './skeleton.directive';

@Component({
  imports: [SkeletonDirective],
  template: `<div sanringSkeleton class="h-4 w-24"></div>`,
})
class SkeletonTestHost {}

describe('SkeletonDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTestHost],
    }).compileComponents();
  });

  it('hides decorative loading placeholders from assistive technologies', () => {
    const fixture = TestBed.createComponent(SkeletonTestHost);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('[sanringSkeleton]') as HTMLElement;

    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(SkeletonTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
