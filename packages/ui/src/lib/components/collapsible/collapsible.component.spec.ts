import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CollapsibleComponent } from './collapsible.component';
import { CollapsibleContentDirective } from './collapsible-content.directive';
import { CollapsibleTriggerDirective } from './collapsible-trigger.directive';

@Component({
  imports: [CollapsibleComponent, CollapsibleContentDirective, CollapsibleTriggerDirective],
  template: `
    <sanring-collapsible>
      <button type="button" sanringCollapsibleTrigger>Toggle</button>
      <div sanringCollapsibleContent>Body</div>
    </sanring-collapsible>

    <sanring-collapsible [disabled]="true">
      <button type="button" sanringCollapsibleTrigger>Toggle</button>
      <div sanringCollapsibleContent>Body</div>
    </sanring-collapsible>

    <sanring-collapsible>
      <span sanringCollapsibleTrigger>Toggle</span>
      <div sanringCollapsibleContent>Body</div>
    </sanring-collapsible>
  `,
})
class CollapsibleTestHost {}

describe('CollapsibleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleTestHost],
    }).compileComponents();
  });

  it('opens on trigger click, updating aria-expanded, hidden, and data-state', () => {
    const fixture = TestBed.createComponent(CollapsibleTestHost);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelectorAll('sanring-collapsible')[0] as HTMLElement;
    const trigger = root.querySelector('button') as HTMLElement;
    const content = root.querySelector('[sanringCollapsibleContent]') as HTMLElement;

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.hidden).toBe(true);
    expect(root.getAttribute('data-state')).toBe('closed');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(content.hidden).toBe(false);
    expect(root.getAttribute('data-state')).toBe('open');
    expect(content.getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('ignores clicks and key activation while disabled', () => {
    const fixture = TestBed.createComponent(CollapsibleTestHost);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelectorAll('sanring-collapsible')[1] as HTMLElement;
    const trigger = root.querySelector('button') as HTMLButtonElement;

    expect(trigger.disabled).toBe(true);

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('adds role="button" and tabindex to non-button triggers, and toggles on Space', () => {
    const fixture = TestBed.createComponent(CollapsibleTestHost);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelectorAll('sanring-collapsible')[2] as HTMLElement;
    const trigger = root.querySelector('span') as HTMLElement;

    expect(trigger.getAttribute('role')).toBe('button');
    expect(trigger.getAttribute('tabindex')).toBe('0');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
