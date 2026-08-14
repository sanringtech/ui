import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { TabsComponent } from './tabs.component';
import { TabsContentComponent } from './tabs-content.component';
import { TabsListComponent } from './tabs-list.component';
import { TabsTriggerComponent } from './tabs-trigger.component';

@Component({
  imports: [TabsComponent, TabsContentComponent, TabsListComponent, TabsTriggerComponent],
  template: `
    <sanring-tabs defaultValue="account" class="custom-class">
      <sanring-tabs-list>
        <sanring-tabs-trigger value="account">Account</sanring-tabs-trigger>
        <sanring-tabs-trigger value="password">Password</sanring-tabs-trigger>
        <sanring-tabs-trigger value="billing" [disabled]="true">Billing</sanring-tabs-trigger>
      </sanring-tabs-list>

      <sanring-tabs-content value="account">Account settings</sanring-tabs-content>
      <sanring-tabs-content value="password">Password settings</sanring-tabs-content>
      <sanring-tabs-content value="billing">Billing settings</sanring-tabs-content>
    </sanring-tabs>
  `,
})
class TabsTestHost {}

describe('TabsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsTestHost],
    }).compileComponents();
  });

  it('renders without error', () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement).toBeTruthy();
  });

  it('merges host class with consumer class', () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const tabsRoot = nativeElement.querySelector('sanring-tabs');
    expect(tabsRoot?.classList.contains('custom-class')).toBe(true);
  });

  it('links tabs to their panels with aria attributes', async () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const tabs = nativeElement.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = nativeElement.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(tabs.length).toBe(3);
    expect(panels.length).toBe(3);
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('selects a tab when clicked', async () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const tabs = nativeElement.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = nativeElement.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    tabs[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
  });

  it('moves selection with ArrowRight, and leaves the disabled tab focusable but unselected', async () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const tabs = nativeElement.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = nativeElement.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[1].hidden).toBe(false);

    // 第三個 tab 是 disabled——`softDisabled` 預設 true,ArrowRight 會把焦點移過去
    // (roving tabindex 序列仍包含它),但它不能被選取/啟用,所以 aria-selected 應該
    // 還停在 tab[1] 上,對應的 panel 也不該切換。
    tabs[1].focus();
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs[2].getAttribute('aria-selected')).not.toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[1].hidden).toBe(false);
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
