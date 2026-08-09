import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { NavigationMenuContentComponent } from './navigation-menu-content.component';
import { NavigationMenuItemComponent } from './navigation-menu-item.component';
import { NavigationMenuLinkDirective } from './navigation-menu-link.directive';
import { NavigationMenuListComponent } from './navigation-menu-list.component';
import { NavigationMenuSubContentComponent } from './navigation-menu-sub-content.component';
import { NavigationMenuSubTriggerComponent } from './navigation-menu-sub-trigger.component';
import { NavigationMenuSubComponent } from './navigation-menu-sub.component';
import { NavigationMenuTriggerDirective } from './navigation-menu-trigger.directive';
import { NavigationMenuComponent } from './navigation-menu.component';

@Component({
  imports: [
    NavigationMenuComponent,
    NavigationMenuListComponent,
    NavigationMenuItemComponent,
    NavigationMenuTriggerDirective,
    NavigationMenuContentComponent,
    NavigationMenuLinkDirective,
    NavigationMenuSubComponent,
    NavigationMenuSubTriggerComponent,
    NavigationMenuSubContentComponent,
  ],
  template: `
    <sanring-navigation-menu ariaLabel="Main">
      <sanring-navigation-menu-list>
        <sanring-navigation-menu-item value="docs">
          <button sanringNavigationMenuTrigger>Docs</button>
          <sanring-navigation-menu-content>
            <a sanringNavigationMenuLink href="/overview"> Overview </a>
            <sanring-navigation-menu-sub>
              <sanring-navigation-menu-sub-trigger>
                Components
              </sanring-navigation-menu-sub-trigger>
              <sanring-navigation-menu-sub-content>
                <a sanringNavigationMenuLink href="/forms" role="menuitem" tabindex="0">
                  Forms
                </a>
                <a sanringNavigationMenuLink href="/overlays" role="menuitem" tabindex="0">
                  Overlays
                </a>
              </sanring-navigation-menu-sub-content>
            </sanring-navigation-menu-sub>
          </sanring-navigation-menu-content>
        </sanring-navigation-menu-item>
      </sanring-navigation-menu-list>
    </sanring-navigation-menu>
  `,
})
class NavigationMenuTestHost {}

function keydown(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
}

describe('NavigationMenuComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationMenuTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function createFixture(): ComponentFixture<NavigationMenuTestHost> {
    const fixture = TestBed.createComponent(NavigationMenuTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function trigger(fixture: ComponentFixture<NavigationMenuTestHost>): HTMLButtonElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      'button[sanringnavigationmenutrigger]',
    ) as HTMLButtonElement;
  }

  function content(fixture: ComponentFixture<NavigationMenuTestHost>): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      'sanring-navigation-menu-content',
    ) as HTMLElement;
  }

  it('opens a content panel and connects trigger aria-controls to the content id', () => {
    const fixture = createFixture();
    const triggerEl = trigger(fixture);
    const contentEl = content(fixture);

    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
    expect(contentEl.hidden).toBe(true);

    triggerEl.click();
    fixture.detectChanges();

    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');
    expect(triggerEl.getAttribute('aria-controls')).toBe(contentEl.id);
    expect(contentEl.hidden).toBe(false);
  });

  it('opens submenu content in a CDK overlay and closes it with ArrowLeft', async () => {
    const fixture = createFixture();
    trigger(fixture).click();
    fixture.detectChanges();

    const subTrigger = (fixture.nativeElement as HTMLElement).querySelector(
      'sanring-navigation-menu-sub-trigger',
    ) as HTMLElement;

    subTrigger.dispatchEvent(keydown('ArrowRight'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.textContent).toContain('Forms');
    expect(subTrigger.getAttribute('aria-expanded')).toBe('true');

    overlay.dispatchEvent(keydown('ArrowLeft'));
    fixture.detectChanges();

    expect(subTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(subTrigger);
  });

  it('has no axe-detectable a11y violations with the menu and submenu open', async () => {
    const fixture = createFixture();
    document.body.appendChild(fixture.nativeElement);

    try {
      trigger(fixture).click();
      fixture.detectChanges();

      const subTrigger = (fixture.nativeElement as HTMLElement).querySelector(
        'sanring-navigation-menu-sub-trigger',
      ) as HTMLElement;
      subTrigger.dispatchEvent(keydown('ArrowRight'));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      // "region" is a whole-page landmark check — meaningless below page
      // granularity, and this bare test fixture has no <main> regardless of
      // the menu's own markup (see select.component.spec.ts for the same call).
      await expectNoA11yViolations(document.body, { rules: { region: { enabled: false } } });
    } finally {
      fixture.nativeElement.remove();
    }
  });
});
