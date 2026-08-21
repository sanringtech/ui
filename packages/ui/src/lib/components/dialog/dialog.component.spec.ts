import { Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { DialogCloseDirective } from './dialog-close.directive';
import { DialogContentComponent } from './dialog-content.component';
import { DialogDescriptionDirective } from './dialog-description.directive';
import { DialogHeaderComponent } from './dialog-header.component';
import { DialogService } from './dialog.service';
import { DialogTitleDirective } from './dialog-title.directive';
import { DialogTriggerDirective } from './dialog-trigger.directive';

@Component({
  imports: [
    DialogCloseDirective,
    DialogContentComponent,
    DialogDescriptionDirective,
    DialogHeaderComponent,
    DialogTitleDirective,
    DialogTriggerDirective,
  ],
  template: `
    <button type="button" [sanringDialogTrigger]="dialog">Open</button>
    <button
      type="button"
      [sanringDialogTrigger]="dialog"
      [sanringDialogConfig]="{ disableClose: true }"
    >
      Open locked
    </button>

    <ng-template #dialog>
      <sanring-dialog-content class="custom-content-class">
        <sanring-dialog-header>
          <h2 sanringDialogTitle>Dialog title</h2>
          <p sanringDialogDescription>Dialog description</p>
        </sanring-dialog-header>
        <button type="button" [sanringDialogClose]="'saved'">Save</button>
        <button type="button" sanringDialogClose>Dismiss</button>
      </sanring-dialog-content>
    </ng-template>

    <ng-template #untitledDialog>
      <sanring-dialog-content ariaLabel="Account confirmation">
        <button type="button" sanringDialogClose>Dismiss</button>
      </sanring-dialog-content>
    </ng-template>

    <ng-template #configLabelDialog>
      <sanring-dialog-content>
        <button type="button" sanringDialogClose>Dismiss</button>
      </sanring-dialog-content>
    </ng-template>

    <ng-template #dynamicDialog>
      <sanring-dialog-content [ariaLabel]="dynamicLabel()">
        @if (showDynamicTitle()) {
          <h2 sanringDialogTitle>Dynamic title</h2>
        }
        <button type="button" sanringDialogClose>Dismiss</button>
      </sanring-dialog-content>
    </ng-template>
  `,
})
class DialogTestHost {
  @ViewChild('dialog') readonly dialog!: TemplateRef<unknown>;
  @ViewChild('untitledDialog') readonly untitledDialog!: TemplateRef<unknown>;
  @ViewChild('configLabelDialog') readonly configLabelDialog!: TemplateRef<unknown>;
  @ViewChild('dynamicDialog') readonly dynamicDialog!: TemplateRef<unknown>;

  readonly dynamicLabel = signal('Initial dynamic label');
  readonly showDynamicTitle = signal(false);

  readonly dialogService = inject(DialogService);
}

describe('DialogComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('connects the dialog container to title and description ids', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const dialogContainer = overlayElement.querySelector('cdk-dialog-container');
    const title = overlayElement.querySelector('[sanringDialogTitle]');
    const description = overlayElement.querySelector('[sanringDialogDescription]');

    expect(dialogContainer).toBeTruthy();
    expect(dialogContainer?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(dialogContainer?.getAttribute('aria-describedby')).toBe(description?.id);
    expect(dialogContainer?.getAttribute('aria-modal')).toBe('true');
    expect(dialogContainer?.hasAttribute('aria-label')).toBe(false);
  });

  it('uses ariaLabel as an accessible-name fallback when no title is projected', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    fixture.componentInstance.dialogService.open(fixture.componentInstance.untitledDialog);
    fixture.detectChanges();

    const dialogContainer = overlayContainer
      .getContainerElement()
      .querySelector('cdk-dialog-container');

    expect(dialogContainer?.getAttribute('aria-label')).toBe('Account confirmation');
    expect(dialogContainer?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('preserves an accessible name provided through DialogConfig', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    fixture.componentInstance.dialogService.open(fixture.componentInstance.configLabelDialog, {
      ariaLabel: 'Billing settings',
    });
    fixture.detectChanges();

    const dialogContainer = overlayContainer
      .getContainerElement()
      .querySelector('cdk-dialog-container');

    expect(dialogContainer?.getAttribute('aria-label')).toBe('Billing settings');
  });

  it('keeps the container ARIA relationship in sync with changing inputs and projected title', async () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    fixture.componentInstance.dialogService.open(fixture.componentInstance.dynamicDialog);
    fixture.detectChanges();
    const dialogContainer = overlayContainer
      .getContainerElement()
      .querySelector('cdk-dialog-container') as HTMLElement;
    expect(dialogContainer.getAttribute('aria-label')).toBe('Initial dynamic label');

    fixture.componentInstance.dynamicLabel.set('Updated dynamic label');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialogContainer.getAttribute('aria-label')).toBe('Updated dynamic label');

    fixture.componentInstance.showDynamicTitle.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const title = overlayContainer.getContainerElement().querySelector('[sanringDialogTitle]');
    expect(dialogContainer.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(dialogContainer.hasAttribute('aria-label')).toBe(false);

    fixture.componentInstance.showDynamicTitle.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialogContainer.hasAttribute('aria-labelledby')).toBe(false);
    expect(dialogContainer.getAttribute('aria-label')).toBe('Updated dynamic label');
  });

  it('passes trigger config to the CDK dialog', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('button')[1].click();
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const backdrop = overlayElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    overlayElement
      .querySelector('cdk-dialog-container')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(
      overlayContainer.getContainerElement().querySelector('cdk-dialog-container'),
    ).not.toBeNull();
  });

  it('closes with the provided close result', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.dialogService.open<string>(
      fixture.componentInstance.dialog,
    );
    fixture.detectChanges();

    let result: string | undefined;
    ref.closed.subscribe((value) => (result = value));

    const buttons = overlayContainer
      .getContainerElement()
      .querySelectorAll<HTMLButtonElement>('button');
    [...buttons].find((button) => button.textContent?.trim() === 'Save')?.click();
    fixture.detectChanges();

    expect(result).toBe('saved');
  });

  it('closes with undefined when sanringDialogClose is used bare (no result binding)', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.dialogService.open<string>(
      fixture.componentInstance.dialog,
    );
    fixture.detectChanges();

    let result: string | undefined = 'not-emitted' as unknown as string;
    ref.closed.subscribe((value) => (result = value));

    const buttons = overlayContainer
      .getContainerElement()
      .querySelectorAll<HTMLButtonElement>('button');
    [...buttons].find((button) => button.textContent?.trim() === 'Dismiss')?.click();
    fixture.detectChanges();

    expect(result).toBeUndefined();
  });

  it('merges host class with consumer class on the content panel', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    const content = overlayContainer.getContainerElement().querySelector('sanring-dialog-content');
    expect(content?.classList.contains('custom-content-class')).toBe(true);
  });

  it('moves focus into the dialog on open and restores it to the trigger on close', async () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    document.body.appendChild(fixture.nativeElement);

    try {
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;
      trigger.focus();

      const ref = fixture.componentInstance.dialogService.open(fixture.componentInstance.dialog);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const dialogContainer = overlayContainer
        .getContainerElement()
        .querySelector('cdk-dialog-container') as HTMLElement;
      // autoFocus: 'first-tabbable' — focus should land inside the dialog panel, not stay
      // on the trigger (which is now behind the modal backdrop).
      expect(dialogContainer.contains(document.activeElement)).toBe(true);

      ref.close();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      // restoreFocus: true — closing should hand focus back to whatever opened the dialog.
      expect(document.activeElement).toBe(trigger);
    } finally {
      fixture.nativeElement.remove();
    }
  });

  it('has no axe-detectable a11y violations, trigger and open dialog content together', async () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    try {
      fixture.nativeElement.querySelector('button').click();
      fixture.detectChanges();

      // CDK Overlay portals dialog content out to the overlay container, a
      // sibling of the fixture under document.body — checking document.body
      // (not fixture.nativeElement) covers both the trigger and the open dialog.
      await expectNoA11yViolations(document.body);
    } finally {
      fixture.nativeElement.remove();
    }
  });
});
