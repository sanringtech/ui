import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { BadgeDirective } from './badge.directive';

@Component({
  imports: [BadgeDirective],
  template: `
    <span sanringBadge class="custom-badge">Stable</span>
    <a sanringBadge variant="outline" href="/docs">Docs</a>
  `,
})
class BadgeTestHost {}

describe('BadgeDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeTestHost],
    }).compileComponents();
  });

  it('renders projected text and merges custom classes', () => {
    const fixture = TestBed.createComponent(BadgeTestHost);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('[sanringBadge]') as HTMLElement;

    expect(badge.textContent?.trim()).toBe('Stable');
    expect(badge.className).toContain('custom-badge');
    expect(badge.className).toContain('inline-flex');
  });

  it('can be applied to links without removing native link semantics', () => {
    const fixture = TestBed.createComponent(BadgeTestHost);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a[sanringBadge]') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.className).toContain('border-[var(--sanring-border-strong)]');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(BadgeTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
