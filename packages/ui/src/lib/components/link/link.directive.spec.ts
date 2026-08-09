import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { LinkDirective } from './link.directive';

@Component({
  imports: [LinkDirective],
  template: `
    <a sanringLink href="/docs" class="custom-link">Docs</a>
    <a sanringLink href="https://example.com" target="_blank" rel="nofollow noopener">External</a>
  `,
})
class LinkTestHost {}

describe('LinkDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkTestHost],
    }).compileComponents();
  });

  it('preserves link semantics and merges classes', () => {
    const fixture = TestBed.createComponent(LinkTestHost);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.textContent?.trim()).toBe('Docs');
    expect(link.className).toContain('custom-link');
    expect(link.className).toContain('underline');
  });

  it('adds noopener and noreferrer for target blank links without duplicating existing rel values', () => {
    const fixture = TestBed.createComponent(LinkTestHost);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll('a')[1] as HTMLAnchorElement;
    const rel = link.getAttribute('rel')?.split(' ').sort();

    expect(link.getAttribute('target')).toBe('_blank');
    expect(rel).toEqual(['nofollow', 'noopener', 'noreferrer']);
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(LinkTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
