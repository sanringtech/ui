import { Component, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { CommandDialogComponent } from './command-dialog.component';

@Component({
  imports: [CommandDialogComponent],
  template: `
    <sanring-command-dialog ariaLabel="Command palette" class="custom-dialog-class">
      <div>Palette content</div>
    </sanring-command-dialog>
  `,
})
class CommandDialogTestHost {
  @ViewChild(CommandDialogComponent) readonly dialog!: CommandDialogComponent;
}

describe('CommandDialogComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandDialogTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('opens via toggle() and closes via close()', () => {
    const fixture = TestBed.createComponent(CommandDialogTestHost);
    fixture.detectChanges();
    const cmp = fixture.componentInstance.dialog;

    cmp.toggle();
    fixture.detectChanges();

    expect(cmp.isOpen()).toBe(true);
    expect(overlayContainer.getContainerElement().querySelector('cdk-dialog-container')).toBeTruthy();

    cmp.close();
    fixture.detectChanges();

    expect(cmp.isOpen()).toBe(false);
  });

  it('toggle() closes an already-open dialog instead of opening a second one', () => {
    const fixture = TestBed.createComponent(CommandDialogTestHost);
    fixture.detectChanges();
    const cmp = fixture.componentInstance.dialog;

    cmp.open();
    fixture.detectChanges();
    expect(cmp.isOpen()).toBe(true);

    cmp.toggle();
    fixture.detectChanges();
    expect(cmp.isOpen()).toBe(false);
  });

  it('passes ariaLabel to the CDK dialog and merges consumer class onto the panel', () => {
    const fixture = TestBed.createComponent(CommandDialogTestHost);
    fixture.detectChanges();

    fixture.componentInstance.dialog.open();
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const dialogContainer = overlayElement.querySelector('cdk-dialog-container');
    expect(dialogContainer?.getAttribute('aria-label')).toBe('Command palette');
    expect(overlayElement.querySelector('.custom-dialog-class')).toBeTruthy();
  });

  it('opens on the platform-appropriate Cmd/Ctrl+K shortcut, ignoring other keys', () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform');
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });

    try {
      const fixture = TestBed.createComponent(CommandDialogTestHost);
      fixture.detectChanges();
      const cmp = fixture.componentInstance.dialog;

      expect(cmp.shortcutHint()).toBe('⌘K');

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', metaKey: true, bubbles: true }));
      fixture.detectChanges();
      expect(cmp.isOpen()).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
      fixture.detectChanges();
      expect(cmp.isOpen()).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
      fixture.detectChanges();
      expect(cmp.isOpen()).toBe(true);
    } finally {
      if (originalPlatform) {
        Object.defineProperty(navigator, 'platform', originalPlatform);
      }
    }
  });
});
