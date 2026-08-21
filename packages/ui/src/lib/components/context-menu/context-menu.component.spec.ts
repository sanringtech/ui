import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ContextMenuCheckboxItemComponent } from './context-menu-checkbox-item.component';
import { ContextMenuContentComponent } from './context-menu-content.component';
import { ContextMenuItemComponent } from './context-menu-item.component';
import { ContextMenuRadioGroupComponent } from './context-menu-radio-group.component';
import { ContextMenuRadioItemComponent } from './context-menu-radio-item.component';
import { ContextMenuSubContentComponent } from './context-menu-sub-content.component';
import { ContextMenuSubTriggerComponent } from './context-menu-sub-trigger.component';
import { ContextMenuSubComponent } from './context-menu-sub.component';
import { ContextMenuTriggerDirective } from './context-menu-trigger.directive';
import { ContextMenuComponent } from './context-menu.component';

@Component({
  imports: [
    ContextMenuComponent,
    ContextMenuTriggerDirective,
    ContextMenuContentComponent,
    ContextMenuItemComponent,
    ContextMenuCheckboxItemComponent,
    ContextMenuRadioGroupComponent,
    ContextMenuRadioItemComponent,
    ContextMenuSubComponent,
    ContextMenuSubTriggerComponent,
    ContextMenuSubContentComponent,
  ],
  template: `
    <button type="button" class="before-menu">Before menu</button>
    <sanring-context-menu (itemSelected)="onItemSelected($event)">
      <div sanringContextMenuTrigger>Right click here</div>

      <sanring-context-menu-content>
        <sanring-context-menu-item value="back">Back</sanring-context-menu-item>
        <sanring-context-menu-item value="forward" [disabled]="true"
          >Forward</sanring-context-menu-item
        >
        <sanring-context-menu-item value="reload">Reload</sanring-context-menu-item>

        <sanring-context-menu-checkbox-item [(checked)]="showBookmarks">
          Show Bookmarks
        </sanring-context-menu-checkbox-item>

        <sanring-context-menu-radio-group [(value)]="panelPosition">
          <sanring-context-menu-radio-item value="left">Left</sanring-context-menu-radio-item>
          <sanring-context-menu-radio-item value="right">Right</sanring-context-menu-radio-item>
        </sanring-context-menu-radio-group>

        <sanring-context-menu-sub>
          <sanring-context-menu-sub-trigger>More Tools</sanring-context-menu-sub-trigger>
          <sanring-context-menu-sub-content>
            <sanring-context-menu-item value="save-page">Save Page</sanring-context-menu-item>
            <sanring-context-menu-item value="print">Print</sanring-context-menu-item>
          </sanring-context-menu-sub-content>
        </sanring-context-menu-sub>
      </sanring-context-menu-content>
    </sanring-context-menu>
    <button type="button" class="after-menu">After menu</button>
  `,
})
class ContextMenuTestHost {
  showBookmarks = false;
  panelPosition = 'left';
  lastSelected: unknown = null;

  onItemSelected(value: unknown) {
    this.lastSelected = value;
  }
}

@Component({
  imports: [
    ContextMenuComponent,
    ContextMenuTriggerDirective,
    ContextMenuContentComponent,
    ContextMenuItemComponent,
  ],
  template: `
    <sanring-context-menu>
      <div sanringContextMenuTrigger>Right click here</div>

      <sanring-context-menu-content class="custom-menu-class">
        <sanring-context-menu-item value="back" class="custom-item-class"
          >Back</sanring-context-menu-item
        >
      </sanring-context-menu-content>
    </sanring-context-menu>
  `,
})
class ContextMenuClassTestHost {}

// CDK's overlay keydownEvents listener reads event.keyCode for some downstream consumers and
// requires cancelable/bubbles to behave like a real browser event — set every relevant field
// explicitly rather than relying on the KeyboardEvent constructor's (unreliable in jsdom)
// mapping from `key` to legacy properties.
function keydown(key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
}

describe('ContextMenuComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenuTestHost, ContextMenuClassTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  async function createFixture(): Promise<ComponentFixture<ContextMenuTestHost>> {
    const fixture = TestBed.createComponent(ContextMenuTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function trigger(fixture: ComponentFixture<ContextMenuTestHost>): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '[sanringcontextmenutrigger]',
    ) as HTMLElement;
  }

  async function openMenu(fixture: ComponentFixture<ContextMenuTestHost>): Promise<void> {
    trigger(fixture).dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }),
    );
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  // Scoped the same way focusAdjacentMenuItem scopes itself: only items whose nearest
  // role="menu" ancestor is the root menu — a closed submenu's items stay in the DOM (just
  // hidden via CSS) until opened, so an unscoped query would also pick those up.
  function menuItems(): HTMLElement[] {
    const menu = overlayContainer
      .getContainerElement()
      .querySelector('[role="menu"]') as HTMLElement;
    return Array.from(menu.querySelectorAll<HTMLElement>('[role^="menuitem"]')).filter(
      (item) => item.closest('[role="menu"]') === menu,
    );
  }

  it('merges host class with consumer class on the content panel and an item', async () => {
    const fixture = TestBed.createComponent(ContextMenuClassTestHost);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement)
      .querySelector('[sanringcontextmenutrigger]')
      ?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 10,
          clientY: 10,
        }),
      );
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const menu = overlayContainer.getContainerElement().querySelector('[role="menu"]');
    const item = overlayContainer.getContainerElement().querySelector('[role="menuitem"]');
    expect(menu?.classList.contains('custom-menu-class')).toBe(true);
    expect(item?.classList.contains('custom-item-class')).toBe(true);
  });

  it('opens on right-click and renders its items', async () => {
    const fixture = await createFixture();

    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false');

    await openMenu(fixture);

    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('true');
    const menu = overlayContainer.getContainerElement().querySelector('[role="menu"]');
    expect(menu).toBeTruthy();
    expect(menuItems().map((el) => el.textContent?.trim())).toEqual([
      'Back',
      'Forward',
      'Reload',
      'Show Bookmarks',
      'Left',
      'Right',
      'More Tools',
    ]);
  });

  it('is keyboard-focusable so Shift+F10/the Menu key can reach it', async () => {
    const fixture = await createFixture();

    expect(trigger(fixture).getAttribute('tabindex')).toBe('0');
  });

  it('moves focus between enabled items with ArrowDown/ArrowUp, skipping the disabled one', async () => {
    const fixture = await createFixture();
    await openMenu(fixture);

    const [back, forward, reload, , , , moreTools] = menuItems();
    expect(forward.getAttribute('aria-disabled')).toBe('true');
    expect(menuItems().filter((item) => item.tabIndex === 0)).toEqual([back]);

    // Nothing focused yet — ArrowDown lands on the first enabled item.
    document.activeElement?.dispatchEvent(keydown('ArrowDown'));
    fixture.detectChanges();
    expect(document.activeElement).toBe(back);

    // Forward is disabled and excluded entirely, so the next ArrowDown skips straight to Reload.
    document.activeElement?.dispatchEvent(keydown('ArrowDown'));
    fixture.detectChanges();
    expect(document.activeElement).toBe(reload);
    expect(back.tabIndex).toBe(-1);
    expect(reload.tabIndex).toBe(0);

    // ArrowUp from the first item wraps back around to the last enabled item (the submenu
    // trigger).
    back.focus();
    document.activeElement?.dispatchEvent(keydown('ArrowUp'));
    fixture.detectChanges();
    expect(document.activeElement).toBe(moreTools);
    expect(menuItems().filter((item) => item.tabIndex === 0)).toEqual([moreTools]);
  });

  it('uses a single roving tab stop and moves Tab beside the logical trigger', async () => {
    const fixture = await createFixture();
    document.body.appendChild(fixture.nativeElement);

    try {
      await openMenu(fixture);

      let [back] = menuItems();
      back.focus();
      back.dispatchEvent(keydown('Tab'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(
        fixture.nativeElement.querySelector('.after-menu') as HTMLButtonElement,
      );

      await openMenu(fixture);
      [back] = menuItems();
      back.focus();
      back.dispatchEvent(keydown('Tab', { shiftKey: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(
        fixture.nativeElement.querySelector('.before-menu') as HTMLButtonElement,
      );
    } finally {
      fixture.nativeElement.remove();
    }
  });

  it('selects the focused item on Enter, emits itemSelected, and closes the menu', async () => {
    const fixture = await createFixture();
    const host = fixture.componentInstance;
    await openMenu(fixture);

    const [back] = menuItems();
    back.focus();
    back.dispatchEvent(keydown('Enter'));
    fixture.detectChanges();

    expect(host.lastSelected).toBe('back');
    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Escape', async () => {
    const fixture = await createFixture();
    await openMenu(fixture);

    document.activeElement?.dispatchEvent(keydown('Escape'));
    fixture.detectChanges();

    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles a checkbox item on click without closing the menu', async () => {
    const fixture = await createFixture();
    const host = fixture.componentInstance;
    await openMenu(fixture);

    const checkboxItem = overlayContainer
      .getContainerElement()
      .querySelector('[role="menuitemcheckbox"]') as HTMLElement;
    expect(checkboxItem.getAttribute('aria-checked')).toBe('false');

    checkboxItem.click();
    fixture.detectChanges();

    expect(host.showBookmarks).toBe(true);
    expect(checkboxItem.getAttribute('aria-checked')).toBe('true');
    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('true');
  });

  it('selects a radio item and reflects the shared group value', async () => {
    const fixture = await createFixture();
    const host = fixture.componentInstance;
    await openMenu(fixture);

    const radioItems = overlayContainer
      .getContainerElement()
      .querySelectorAll<HTMLElement>('[role="menuitemradio"]');
    expect(radioItems[0].getAttribute('aria-checked')).toBe('true');
    expect(radioItems[1].getAttribute('aria-checked')).toBe('false');

    radioItems[1].click();
    fixture.detectChanges();

    expect(host.panelPosition).toBe('right');
    expect(radioItems[0].getAttribute('aria-checked')).toBe('false');
    expect(radioItems[1].getAttribute('aria-checked')).toBe('true');
  });

  it('opens a submenu on ArrowRight/Enter and closes it with ArrowLeft, restoring focus to the sub-trigger', async () => {
    const fixture = await createFixture();
    await openMenu(fixture);

    const subTrigger = overlayContainer
      .getContainerElement()
      .querySelector('[aria-haspopup="menu"]') as HTMLElement;
    subTrigger.focus();
    subTrigger.dispatchEvent(keydown('ArrowRight'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(subTrigger.getAttribute('aria-expanded')).toBe('true');
    const subContentHost = overlayContainer
      .getContainerElement()
      .querySelector('sanring-context-menu-sub-content') as HTMLElement;
    const subItems = Array.from(subContentHost.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    expect(subItems.map((el) => el.textContent?.trim())).toEqual(['Save Page', 'Print']);
    expect(subItems.filter((item) => item.tabIndex === 0)).toEqual([subItems[0]]);

    // Keyboard-initiated open must land focus on the first submenu item immediately —
    // matches native menus / the ARIA APG submenu pattern. Without this, a keyboard user
    // would need an extra ArrowDown press before Enter/typeahead does anything useful.
    expect(document.activeElement).toBe(subItems[0]);

    document.activeElement?.dispatchEvent(keydown('ArrowLeft'));
    fixture.detectChanges();

    expect(subTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(subTrigger);
  });

  it('opens a submenu on Space and focuses the first submenu item', async () => {
    const fixture = await createFixture();
    await openMenu(fixture);

    const subTrigger = overlayContainer
      .getContainerElement()
      .querySelector('[aria-haspopup="menu"]') as HTMLElement;
    subTrigger.focus();
    subTrigger.dispatchEvent(keydown(' '));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const subContentHost = overlayContainer
      .getContainerElement()
      .querySelector('sanring-context-menu-sub-content') as HTMLElement;
    const firstSubItem = subContentHost.querySelector('[role="menuitem"]') as HTMLElement;

    expect(subTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(firstSubItem);
  });

  it('closes the full menu and continues from the root trigger when tabbing from a submenu', async () => {
    const fixture = await createFixture();
    document.body.appendChild(fixture.nativeElement);

    try {
      await openMenu(fixture);
      const subTrigger = overlayContainer
        .getContainerElement()
        .querySelector('[aria-haspopup="menu"]') as HTMLElement;
      subTrigger.focus();
      subTrigger.dispatchEvent(keydown('ArrowRight'));
      fixture.detectChanges();
      await fixture.whenStable();

      const subItem = overlayContainer
        .getContainerElement()
        .querySelector('sanring-context-menu-sub-content [role="menuitem"]') as HTMLElement;
      expect(document.activeElement).toBe(subItem);

      subItem.dispatchEvent(keydown('Tab'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(
        fixture.nativeElement.querySelector('.after-menu') as HTMLButtonElement,
      );
    } finally {
      fixture.nativeElement.remove();
    }
  });

  it('does not steal focus into the submenu when opened by mouse hover', async () => {
    const fixture = await createFixture();
    await openMenu(fixture);

    const subTrigger = overlayContainer
      .getContainerElement()
      .querySelector('[aria-haspopup="menu"]') as HTMLElement;
    subTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(subTrigger.getAttribute('aria-expanded')).toBe('true');
    // Pointer-driven open must not move focus — only the keyboard path does.
    expect(document.activeElement).toBe(document.body);
  });

  it('has no axe-detectable a11y violations, trigger zone and open menu together', async () => {
    const fixture = await createFixture();
    document.body.appendChild(fixture.nativeElement);

    try {
      await openMenu(fixture);

      // "region" is a whole-page landmark check — meaningless below page
      // granularity, and this bare test fixture has no <main> regardless of
      // the menu's own markup (see select.component.spec.ts for the same call).
      await expectNoA11yViolations(document.body, { rules: { region: { enabled: false } } });
    } finally {
      fixture.nativeElement.remove();
    }
  });
});
