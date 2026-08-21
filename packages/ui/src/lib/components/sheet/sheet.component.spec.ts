import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { SheetCloseDirective } from './sheet-close.directive';
import { SheetContentComponent } from './sheet-content.component';
import { SheetDescriptionComponent } from './sheet-description.component';
import { SheetHeaderComponent } from './sheet-header.component';
import { SheetTitleComponent } from './sheet-title.component';
import { SheetTriggerDirective } from './sheet-trigger.directive';
import { SheetComponent } from './sheet.component';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Component({
  imports: [
    SheetCloseDirective,
    SheetContentComponent,
    SheetDescriptionComponent,
    SheetHeaderComponent,
    SheetTitleComponent,
    SheetTriggerDirective,
    SheetComponent,
  ],
  template: `
    <sanring-sheet>
      <button type="button" sanringSheetTrigger>Open</button>
      <sanring-sheet-content class="custom-sheet-class">
        <sanring-sheet-header>
          <sanring-sheet-title>Settings</sanring-sheet-title>
          <sanring-sheet-description>Update panel settings.</sanring-sheet-description>
        </sanring-sheet-header>
        <button type="button" sanringSheetClose>Close</button>
      </sanring-sheet-content>
    </sanring-sheet>
  `,
})
class SheetTestHost {}

@Component({
  imports: [SheetContentComponent, SheetTriggerDirective, SheetComponent],
  template: `
    <sanring-sheet>
      <button type="button" sanringSheetTrigger>Open fallback</button>
      <sanring-sheet-content ariaLabel="Filters" ariaDescribedBy="external-help">
        <p id="external-help">Choose filters</p>
      </sanring-sheet-content>
    </sanring-sheet>
  `,
})
class UntitledSheetTestHost {}

describe('SheetComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    overlayContainer.ngOnDestroy();
  });

  it('renders nothing until opened', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens on trigger click, focusing and linking the panel to its title', async () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const overlayElement = overlayContainer.getContainerElement();
    const panel = overlayElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = overlayElement.querySelector('sanring-sheet-title') as HTMLElement;
    const description = overlayElement.querySelector('sanring-sheet-description') as HTMLElement;

    await fixture.whenStable();

    expect(panel).toBeTruthy();
    expect(document.activeElement).toBe(panel);
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
    expect(panel.hasAttribute('aria-label')).toBe(false);
    expect(panel.getAttribute('aria-describedby')).toBe(description.id);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('uses explicit aria inputs when no title is projected', () => {
    const fixture = TestBed.createComponent(UntitledSheetTestHost);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('button') as HTMLElement).click();
    fixture.detectChanges();

    const panel = overlayContainer
      .getContainerElement()
      .querySelector('[role="dialog"]') as HTMLElement;

    expect(panel.getAttribute('aria-label')).toBe('Filters');
    expect(panel.hasAttribute('aria-labelledby')).toBe(false);
    expect(panel.getAttribute('aria-describedby')).toBe('external-help');
  });

  it('opens without touching document.activeElement/body.children when Platform reports non-browser (SSR safety)', () => {
    const platform = TestBed.inject(Platform);
    Object.defineProperty(platform, 'isBrowser', { value: false, configurable: true });
    const activeElementSpy = vi.spyOn(document, 'activeElement', 'get');
    const bodyChildrenSpy = vi.spyOn(document.body, 'children', 'get');

    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    expect(() => {
      trigger.click();
      fixture.detectChanges();
    }).not.toThrow();

    const panel = overlayContainer.getContainerElement().querySelector('[role="dialog"]');
    expect(panel).toBeTruthy();
    expect(activeElementSpy).not.toHaveBeenCalled();
    expect(bodyChildrenSpy).not.toHaveBeenCalled();

    activeElementSpy.mockRestore();
    bodyChildrenSpy.mockRestore();
  });

  it('merges host class with consumer class on the content panel', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const panel = overlayContainer.getContainerElement().querySelector('[role="dialog"]');
    expect(panel?.classList.contains('custom-sheet-class')).toBe(true);
  });

  it('hides other body content from assistive tech while open, and restores it on close', async () => {
    const marker = document.createElement('div');
    document.body.appendChild(marker);

    try {
      const fixture = TestBed.createComponent(SheetTestHost);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        'button[sanringSheetTrigger]',
      ) as HTMLElement;
      trigger.click();
      fixture.detectChanges();

      expect(marker.getAttribute('aria-hidden')).toBe('true');

      const overlayElement = overlayContainer.getContainerElement();
      (overlayElement.querySelector('[aria-hidden="true"]') as HTMLElement).click();
      fixture.detectChanges();

      // Stays hidden through the leave animation, only restored once the panel is actually removed
      await wait(250);
      fixture.detectChanges();

      expect(marker.hasAttribute('aria-hidden')).toBe(false);
    } finally {
      marker.remove();
    }
  });

  it('restores focus to the trigger after closing', async () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    trigger.focus();
    trigger.click();
    fixture.detectChanges();

    const closeButton = overlayContainer
      .getContainerElement()
      .querySelector('button[sanringSheetClose]') as HTMLElement;
    closeButton.focus();
    closeButton.click();
    fixture.detectChanges();

    await wait(250);
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
  });

  it('closes on backdrop click, unlocking scroll after the leave animation', async () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const backdrop = overlayElement.querySelector('[aria-hidden="true"]') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(overlayContainer.getContainerElement().querySelector('[role="dialog"]')).toBeTruthy();

    await wait(250);
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('restores pre-existing inline body scroll styles after closing', async () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '12px';

    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('hidden');

    const backdrop = overlayContainer
      .getContainerElement()
      .querySelector('[aria-hidden="true"]') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    await wait(250);
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.paddingRight).toBe('12px');
  });

  it('closes on Escape', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes via a sanringSheetClose button inside the panel', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button[sanringSheetTrigger]',
    ) as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const closeButton = overlayContainer
      .getContainerElement()
      .querySelector('button[sanringSheetClose]') as HTMLElement;
    closeButton.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('has no axe-detectable a11y violations, trigger and open panel together', async () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    try {
      const trigger = fixture.nativeElement.querySelector(
        'button[sanringSheetTrigger]',
      ) as HTMLElement;
      trigger.click();
      fixture.detectChanges();

      await expectNoA11yViolations(document.body);
    } finally {
      fixture.nativeElement.remove();
    }
  });
});
