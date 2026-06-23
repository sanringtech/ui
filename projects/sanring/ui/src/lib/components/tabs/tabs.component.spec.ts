import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { TabsContentComponent } from './tabs-content.component';
import { TabsListComponent } from './tabs-list.component';
import { TabsTriggerComponent } from './tabs-trigger.component';

@Component({
  imports: [TabsComponent, TabsContentComponent, TabsListComponent, TabsTriggerComponent],
  template: `
    <sanring-tabs defaultValue="account">
      <sanring-tabs-list>
        <sanring-tabs-trigger value="account">Account</sanring-tabs-trigger>
        <sanring-tabs-trigger value="password">Password</sanring-tabs-trigger>
      </sanring-tabs-list>

      <sanring-tabs-content value="account">Account settings</sanring-tabs-content>
      <sanring-tabs-content value="password">Password settings</sanring-tabs-content>
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

  it('links tabs to their panels with aria attributes', async () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const tabs = nativeElement.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = nativeElement.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(tabs.length).toBe(2);
    expect(panels.length).toBe(2);
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
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
});
