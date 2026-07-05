import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SheetCloseDirective } from './sheet-close.directive';
import { SheetContentComponent } from './sheet-content.component';
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
    SheetTitleComponent,
    SheetTriggerDirective,
    SheetComponent,
  ],
  template: `
    <sanring-sheet>
      <button type="button" sanringSheetTrigger>Open</button>
      <sanring-sheet-content>
        <sanring-sheet-title>Settings</sanring-sheet-title>
        <button type="button" sanringSheetClose>Close</button>
      </sanring-sheet-content>
    </sanring-sheet>
  `,
})
class SheetTestHost {}

describe('SheetComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetTestHost],
    }).compileComponents();
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('renders nothing until opened', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens on trigger click, linking the panel to its title and locking scroll', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button[sanringSheetTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('sanring-sheet-title') as HTMLElement;

    expect(panel).toBeTruthy();
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes on backdrop click, unlocking scroll after the leave animation', async () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button[sanringSheetTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('[aria-hidden="true"]') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();

    await wait(250);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button[sanringSheetTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes via a sanringSheetClose button inside the panel', () => {
    const fixture = TestBed.createComponent(SheetTestHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button[sanringSheetTrigger]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('button[sanringSheetClose]') as HTMLElement;
    closeButton.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
