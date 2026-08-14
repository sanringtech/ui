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
    <sanring-navigation-menu ariaLabel="Main" class="custom-nav-class">
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

@Component({
  imports: [NavigationMenuLinkDirective],
  template: `
    <a sanringNavigationMenuLink href="/menuitem" role="menuitem" tabindex="0" [disabled]="disabled">
      Item
    </a>
  `,
})
class DisabledLinkTestHost {
  disabled = false;
}

function keydown(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
}

describe('NavigationMenuComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationMenuTestHost, DisabledLinkTestHost],
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

  it('merges host class with consumer class', () => {
    const fixture = createFixture();
    const root = (fixture.nativeElement as HTMLElement).querySelector('sanring-navigation-menu');
    expect(root?.classList.contains('custom-nav-class')).toBe(true);
  });

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

    // Keyboard-initiated open should land focus on the first submenu item immediately,
    // matching native menu conventions (no extra ArrowDown needed to start navigating).
    const firstItem = overlay.querySelector('[role="menuitem"]');
    expect(document.activeElement).toBe(firstItem);

    overlay.dispatchEvent(keydown('ArrowLeft'));
    fixture.detectChanges();

    expect(subTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(subTrigger);
  });

  it('moves focus between submenu items with ArrowDown/ArrowUp', async () => {
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
    const items = overlay.querySelectorAll('[role="menuitem"]');
    expect(document.activeElement).toBe(items[0]);

    overlay.dispatchEvent(keydown('ArrowDown'));
    fixture.detectChanges();
    expect(document.activeElement).toBe(items[1]);

    overlay.dispatchEvent(keydown('ArrowUp'));
    fixture.detectChanges();
    expect(document.activeElement).toBe(items[0]);
  });

  it('preserves a template-set tabindex when enabled, and forces "-1" when disabled', () => {
    const enabledFixture = TestBed.createComponent(DisabledLinkTestHost);
    enabledFixture.detectChanges();
    const enabledLink = enabledFixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(enabledLink.getAttribute('tabindex')).toBe('0');
    expect(enabledLink.getAttribute('aria-disabled')).toBeNull();

    const disabledFixture = TestBed.createComponent(DisabledLinkTestHost);
    disabledFixture.componentInstance.disabled = true;
    disabledFixture.detectChanges();
    const disabledLink = disabledFixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(disabledLink.getAttribute('tabindex')).toBe('-1');
    expect(disabledLink.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not steal focus when the submenu is opened via mouse hover', () => {
    const fixture = createFixture();
    trigger(fixture).click();
    fixture.detectChanges();

    const subTrigger = (fixture.nativeElement as HTMLElement).querySelector(
      'sanring-navigation-menu-sub-trigger',
    ) as HTMLElement;

    subTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    expect(subTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).not.toBe(
      overlayContainer.getContainerElement().querySelector('[role="menuitem"]'),
    );
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
