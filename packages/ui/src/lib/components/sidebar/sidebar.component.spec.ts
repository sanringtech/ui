import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import {
  CollapsibleComponent,
  CollapsibleContentDirective,
  CollapsibleTriggerDirective,
} from '../collapsible';
import { SidebarContentComponent } from './sidebar-content.component';
import { SidebarFooterComponent } from './sidebar-footer.component';
import { SidebarGroupContentComponent } from './sidebar-group-content.component';
import { SidebarGroupLabelComponent } from './sidebar-group-label.component';
import { SidebarGroupComponent } from './sidebar-group.component';
import { SidebarHeaderComponent } from './sidebar-header.component';
import { SidebarInsetDirective } from './sidebar-inset.directive';
import { SidebarMenuActionDirective } from './sidebar-menu-action.directive';
import { SidebarMenuBadgeComponent } from './sidebar-menu-badge.component';
import { SidebarMenuButtonDirective } from './sidebar-menu-button.directive';
import { SidebarMenuItemComponent } from './sidebar-menu-item.component';
import { SidebarMenuSubItemComponent } from './sidebar-menu-sub-item.component';
import { SidebarMenuSubComponent } from './sidebar-menu-sub.component';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { SidebarProviderComponent } from './sidebar-provider.component';
import { SidebarRailDirective } from './sidebar-rail.directive';
import { SidebarTriggerDirective } from './sidebar-trigger.directive';
import { SidebarComponent } from './sidebar.component';

@Component({
  imports: [
    CollapsibleComponent,
    CollapsibleContentDirective,
    CollapsibleTriggerDirective,
    SidebarProviderComponent,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarContentComponent,
    SidebarFooterComponent,
    SidebarGroupComponent,
    SidebarGroupContentComponent,
    SidebarGroupLabelComponent,
    SidebarMenuComponent,
    SidebarMenuItemComponent,
    SidebarMenuButtonDirective,
    SidebarMenuActionDirective,
    SidebarMenuBadgeComponent,
    SidebarMenuSubComponent,
    SidebarMenuSubItemComponent,
    SidebarRailDirective,
    SidebarInsetDirective,
    SidebarTriggerDirective,
  ],
  template: `
    <sanring-sidebar-provider collapsible="icon">
      <sanring-sidebar>
        <sanring-sidebar-header>
          <button type="button" sanringSidebarTrigger aria-label="Toggle sidebar">Toggle</button>
        </sanring-sidebar-header>

        <sanring-sidebar-content>
          <sanring-sidebar-group>
            <sanring-sidebar-group-label>Platform</sanring-sidebar-group-label>
            <sanring-sidebar-group-content>
              <sanring-sidebar-menu>
                <sanring-sidebar-menu-item>
                  <sanring-collapsible [open]="true">
                    <button type="button" sanringSidebarMenuButton active sanringCollapsibleTrigger>
                      Dashboard
                    </button>
                    <sanring-sidebar-menu-sub sanringCollapsibleContent>
                      <sanring-sidebar-menu-sub-item>
                        <a href="#">Overview</a>
                      </sanring-sidebar-menu-sub-item>
                      <sanring-sidebar-menu-sub-item>
                        <a href="#">Reports</a>
                      </sanring-sidebar-menu-sub-item>
                    </sanring-sidebar-menu-sub>
                  </sanring-collapsible>
                </sanring-sidebar-menu-item>

                <sanring-sidebar-menu-item>
                  <a href="#" sanringSidebarMenuButton>
                    Inbox
                    <sanring-sidebar-menu-badge>3</sanring-sidebar-menu-badge>
                  </a>
                  <button type="button" sanringSidebarMenuAction aria-label="Inbox actions">…</button>
                </sanring-sidebar-menu-item>
              </sanring-sidebar-menu>
            </sanring-sidebar-group-content>
          </sanring-sidebar-group>
        </sanring-sidebar-content>

        <sanring-sidebar-footer>
          <a href="#" sanringSidebarMenuButton>Account</a>
        </sanring-sidebar-footer>

        <button type="button" sanringSidebarRail aria-label="Toggle sidebar"></button>
      </sanring-sidebar>

      <main sanringSidebarInset>
        <button type="button" sanringSidebarTrigger aria-label="Toggle sidebar">Toggle</button>
        Main content
      </main>
    </sanring-sidebar-provider>
  `,
})
class SidebarTestHost {}

describe('SidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarTestHost],
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(SidebarTestHost);
    fixture.detectChanges();
    return fixture;
  }

  it('toggles open state through sanringSidebarTrigger, reflected as data-state on the sidebar', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const sidebar = root.querySelector('sanring-sidebar') as HTMLElement;
    const [sidebarTrigger] = Array.from(root.querySelectorAll('button[sanringSidebarTrigger]'));

    expect(sidebar.getAttribute('data-state')).toBe('open');
    expect(sidebar.getAttribute('data-open')).toBe('');

    (sidebarTrigger as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(sidebar.getAttribute('data-state')).toBe('closed');
    expect(sidebar.getAttribute('data-open')).toBeNull();
  });

  it('renders menu roles and a labelled group', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('sanring-sidebar-menu')?.getAttribute('role')).toBe('list');
    expect(
      root.querySelectorAll('sanring-sidebar-menu-item')[0]?.getAttribute('role'),
    ).toBe('listitem');
    expect(root.querySelector('sanring-sidebar-group-label')?.textContent?.trim()).toBe('Platform');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = createFixture();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
