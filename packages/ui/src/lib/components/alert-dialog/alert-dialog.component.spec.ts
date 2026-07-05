import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { AlertDialogActionDirective } from './alert-dialog-action.directive';
import { AlertDialogCancelDirective } from './alert-dialog-cancel.directive';
import { AlertDialogContentComponent } from './alert-dialog-content.component';
import { AlertDialogTriggerDirective } from './alert-dialog-trigger.directive';
import { AlertDialogService } from './alert-dialog.service';
import { DialogDescriptionDirective } from '../dialog/dialog-description.directive';
import { DialogTitleDirective } from '../dialog/dialog-title.directive';

@Component({
  imports: [
    AlertDialogActionDirective,
    AlertDialogCancelDirective,
    AlertDialogContentComponent,
    AlertDialogTriggerDirective,
    DialogDescriptionDirective,
    DialogTitleDirective,
  ],
  template: `
    <button type="button" [sanringAlertDialogTrigger]="alertDialog">Open</button>
    <button
      type="button"
      [sanringAlertDialogTrigger]="alertDialog"
      [sanringAlertDialogConfig]="{ disableClose: false }"
    >
      Open (attempts to unlock disableClose)
    </button>

    <ng-template #alertDialog>
      <sanring-alert-dialog-content>
        <h2 sanringDialogTitle>Delete item?</h2>
        <p sanringDialogDescription>This cannot be undone.</p>
        <button type="button" sanringAlertDialogCancel>Cancel</button>
        <button type="button" sanringAlertDialogAction>Delete</button>
      </sanring-alert-dialog-content>
    </ng-template>

    <ng-template #customResultAlertDialog>
      <sanring-alert-dialog-content>
        <h2 sanringDialogTitle>Delete item?</h2>
        <button type="button" [sanringAlertDialogCancel]="'dismissed'">Cancel</button>
        <button type="button" [sanringAlertDialogAction]="'delete-42'">Delete</button>
      </sanring-alert-dialog-content>
    </ng-template>
  `,
})
class AlertDialogTestHost {
  @ViewChild('alertDialog') readonly alertDialog!: TemplateRef<unknown>;
  @ViewChild('customResultAlertDialog') readonly customResultAlertDialog!: TemplateRef<unknown>;

  readonly alertDialogService = inject(AlertDialogService);
}

describe('AlertDialog', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertDialogTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('sets role="alertdialog", hides the close button by default, and wires title/description ids', () => {
    const fixture = TestBed.createComponent(AlertDialogTestHost);
    fixture.detectChanges();

    fixture.componentInstance.alertDialogService.open(fixture.componentInstance.alertDialog);
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const dialogContainer = overlayElement.querySelector('cdk-dialog-container');
    const title = overlayElement.querySelector('[sanringDialogTitle]');
    const description = overlayElement.querySelector('[sanringDialogDescription]');

    expect(dialogContainer?.getAttribute('role')).toBe('alertdialog');
    expect(dialogContainer?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(dialogContainer?.getAttribute('aria-describedby')).toBe(description?.id);
    expect(overlayElement.querySelector('button[aria-label="關閉對話框"]')).toBeNull();
  });

  it('opens via sanringAlertDialogTrigger and locks disableClose even if the trigger config tries to unset it', () => {
    const fixture = TestBed.createComponent(AlertDialogTestHost);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    (buttons[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const dialogContainer = overlayElement.querySelector('cdk-dialog-container');

    expect(dialogContainer?.getAttribute('role')).toBe('alertdialog');

    const backdrop = overlayElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('cdk-dialog-container')).not.toBeNull();
  });

  it('does not close on backdrop click or Escape', () => {
    const fixture = TestBed.createComponent(AlertDialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.alertDialogService.open(
      fixture.componentInstance.alertDialog,
    );
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const backdrop = overlayElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    overlayElement
      .querySelector('cdk-dialog-container')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('cdk-dialog-container')).not.toBeNull();
    expect(ref.disableClose).toBe(true);
  });

  it('cannot have disableClose overridden by caller-supplied config', () => {
    const fixture = TestBed.createComponent(AlertDialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.alertDialogService.open(
      fixture.componentInstance.alertDialog,
      { disableClose: false },
    );
    fixture.detectChanges();

    expect(ref.disableClose).toBe(true);
  });

  it('supports a custom result value on the action/cancel directives', () => {
    const fixture = TestBed.createComponent(AlertDialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.alertDialogService.open<string>(
      fixture.componentInstance.customResultAlertDialog,
    );
    fixture.detectChanges();

    let result: string | undefined;
    ref.closed.subscribe((value) => (result = value));

    // 這裡是 property binding（非 bare attribute），Angular 不會把它反映成 DOM
    // attribute，所以改用文字內容找按鈕，而不是 attribute selector。
    const buttons = Array.from(
      overlayContainer.getContainerElement().querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.includes('Delete'))?.click();
    fixture.detectChanges();

    expect(result).toBe('delete-42');
  });

  it('closes with true when the action button is clicked', () => {
    const fixture = TestBed.createComponent(AlertDialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.alertDialogService.open<boolean>(
      fixture.componentInstance.alertDialog,
    );
    fixture.detectChanges();

    let result: boolean | undefined;
    ref.closed.subscribe((value) => (result = value));

    overlayContainer
      .getContainerElement()
      .querySelector<HTMLButtonElement>('[sanringAlertDialogAction]')
      ?.click();
    fixture.detectChanges();

    expect(result).toBe(true);
  });

  it('closes with false when the cancel button is clicked', () => {
    const fixture = TestBed.createComponent(AlertDialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.alertDialogService.open<boolean>(
      fixture.componentInstance.alertDialog,
    );
    fixture.detectChanges();

    let result: boolean | undefined;
    ref.closed.subscribe((value) => (result = value));

    overlayContainer
      .getContainerElement()
      .querySelector<HTMLButtonElement>('[sanringAlertDialogCancel]')
      ?.click();
    fixture.detectChanges();

    expect(result).toBe(false);
  });
});
