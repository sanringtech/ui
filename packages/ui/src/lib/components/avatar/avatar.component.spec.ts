import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { AvatarBadgeDirective } from './avatar-badge.directive';
import { AvatarFallbackComponent } from './avatar-fallback.component';
import { AvatarGroupCountComponent } from './avatar-group-count.component';
import { AvatarGroupComponent } from './avatar-group.component';
import { AvatarImageDirective } from './avatar-image.directive';
import { AvatarComponent } from './avatar.component';

@Component({
  imports: [
    AvatarComponent,
    AvatarImageDirective,
    AvatarFallbackComponent,
    AvatarBadgeDirective,
    AvatarGroupComponent,
    AvatarGroupCountComponent,
  ],
  template: `
    <sanring-avatar ariaLabel="Ada Lovelace" size="lg" class="custom-avatar">
      <img sanringAvatarImage src="/avatar.png" alt="" class="custom-image" />
      <sanring-avatar-fallback class="custom-fallback">AL</sanring-avatar-fallback>
      <span sanringAvatarBadge status="online" ariaLabel="Available"></span>
    </sanring-avatar>

    <sanring-avatar-group ariaLabel="Team" class="custom-group">
      <sanring-avatar ariaLabel="Grace Hopper" />
      <sanring-avatar-group-count
        [count]="3"
        [clickable]="true"
        class="custom-count"
        (clicked)="clicks = clicks + 1"
      />
    </sanring-avatar-group>
  `,
})
class AvatarTestHost {
  clicks = 0;
}

describe('AvatarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarTestHost],
    }).compileComponents();
  });

  it('renders image/fallback composition with accessible avatar and badge labels', () => {
    const fixture = TestBed.createComponent(AvatarTestHost);
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('sanring-avatar') as HTMLElement;
    const image = avatar.querySelector('img') as HTMLImageElement;
    const badge = avatar.querySelector('[sanringAvatarBadge]') as HTMLElement;

    expect(avatar.getAttribute('role')).toBe('img');
    expect(avatar.getAttribute('aria-label')).toBe('Ada Lovelace');
    expect(avatar.className).toContain('custom-avatar');
    expect(image.className).toContain('custom-image');
    expect(badge.getAttribute('role')).toBe('status');
    expect(badge.getAttribute('aria-label')).toBe('Available');
  });

  it('makes clickable group counts keyboard accessible', () => {
    const fixture = TestBed.createComponent(AvatarTestHost);
    fixture.detectChanges();

    const count = fixture.nativeElement.querySelector('sanring-avatar-group-count') as HTMLElement;

    expect(count.textContent?.trim()).toBe('+3');
    expect(count.getAttribute('role')).toBe('button');
    expect(count.getAttribute('tabindex')).toBe('0');
    expect(count.className).toContain('custom-count');

    count.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(AvatarTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
