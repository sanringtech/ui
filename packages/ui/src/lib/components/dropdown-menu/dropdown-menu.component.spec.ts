import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { DropdownMenuComponent } from './dropdown-menu.component';
import { DropdownMenuContentComponent } from './dropdown-menu-content.component';
import { DropdownMenuItemDirective } from './dropdown-menu-item.directive';
import { DropdownMenuTriggerDirective } from './dropdown-menu-trigger.directive';

@Component({
  imports: [
    DropdownMenuComponent,
    DropdownMenuContentComponent,
    DropdownMenuItemDirective,
    DropdownMenuTriggerDirective,
  ],
  template: `
    <sanring-dropdown-menu>
      <button type="button" sanringDropdownMenuTrigger [menu]="menu.menu">Open</button>
      <sanring-dropdown-menu-content #menu="sanringDropdownMenuContent">
        <button type="button" sanringDropdownMenuItem value="a">Item A</button>
        <button type="button" sanringDropdownMenuItem value="b" [disabled]="true">Item B</button>
      </sanring-dropdown-menu-content>
    </sanring-dropdown-menu>
  `,
})
class DropdownMenuTestHost {}

@Component({
  imports: [
    DropdownMenuComponent,
    DropdownMenuContentComponent,
    DropdownMenuItemDirective,
    DropdownMenuTriggerDirective,
  ],
  template: `
    <sanring-dropdown-menu>
      <button type="button" sanringDropdownMenuTrigger [menu]="menu.menu">Open</button>
      <sanring-dropdown-menu-content #menu="sanringDropdownMenuContent" class="custom-menu-class">
        <button type="button" sanringDropdownMenuItem value="a" class="custom-item-class">
          Item A
        </button>
      </sanring-dropdown-menu-content>
    </sanring-dropdown-menu>
  `,
})
class DropdownMenuClassTestHost {}

describe('DropdownMenuComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMenuTestHost, DropdownMenuClassTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  async function setup() {
    const fixture = TestBed.createComponent(DropdownMenuTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('starts closed', async () => {
    const fixture = await setup();

    const trigger = fixture.nativeElement.querySelector('[sanringDropdownMenuTrigger]') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    const menu = overlayContainer.getContainerElement().querySelector('[role="menu"]');
    expect(menu?.getAttribute('data-visible')).toBe('false');
  });

  it('opens the menu on trigger click, revealing its items', async () => {
    const fixture = await setup();

    const trigger = fixture.nativeElement.querySelector('[sanringDropdownMenuTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const overlayElement = overlayContainer.getContainerElement();
    const menu = overlayElement.querySelector('[role="menu"]');
    const items = overlayElement.querySelectorAll('[role="menuitem"]');

    expect(menu?.getAttribute('data-visible')).toBe('true');
    expect(items.length).toBe(2);
    expect(trigger.getAttribute('aria-controls')).toBe(menu?.id);
  });

  it('marks a disabled item with aria-disabled', async () => {
    const fixture = await setup();

    const trigger = fixture.nativeElement.querySelector('[sanringDropdownMenuTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const items = overlayContainer.getContainerElement().querySelectorAll('[role="menuitem"]');
    expect(items[0].getAttribute('aria-disabled')).toBe('false');
    expect(items[1].getAttribute('aria-disabled')).toBe('true');
  });

  it('closes again on a second trigger click', async () => {
    const fixture = await setup();

    const trigger = fixture.nativeElement.querySelector('[sanringDropdownMenuTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu on Escape', async () => {
    const fixture = await setup();

    const trigger = fixture.nativeElement.querySelector('[sanringDropdownMenuTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const menu = overlayContainer.getContainerElement().querySelector('[role="menu"]') as HTMLElement;
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('merges host class with consumer class on both the content and an item', async () => {
    const fixture = TestBed.createComponent(DropdownMenuClassTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[sanringDropdownMenuTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const menu = overlayElement.querySelector('[role="menu"]');
    const item = overlayElement.querySelector('[role="menuitem"]');

    expect(menu?.classList.contains('custom-menu-class')).toBe(true);
    expect(item?.classList.contains('custom-item-class')).toBe(true);
  });

  it('has no axe-detectable a11y violations, trigger and open menu together', async () => {
    const fixture = await setup();
    document.body.appendChild(fixture.nativeElement);

    try {
      const trigger = fixture.nativeElement.querySelector('[sanringDropdownMenuTrigger]') as HTMLElement;
      trigger.click();
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
