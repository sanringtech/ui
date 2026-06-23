import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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
});
