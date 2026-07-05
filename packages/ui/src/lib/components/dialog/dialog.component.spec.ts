import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { DialogCloseDirective } from './dialog-close.directive';
import { DialogContentComponent } from './dialog-content.component';
import { DialogDescriptionDirective } from './dialog-description.directive';
import { DialogService } from './dialog.service';
import { DialogTitleDirective } from './dialog-title.directive';
import { DialogTriggerDirective } from './dialog-trigger.directive';

@Component({
  imports: [
    DialogCloseDirective,
    DialogContentComponent,
    DialogDescriptionDirective,
    DialogTitleDirective,
    DialogTriggerDirective,
  ],
  template: `
    <button type="button" [sanringDialogTrigger]="dialog">Open</button>
    <button type="button" [sanringDialogTrigger]="dialog" [sanringDialogConfig]="{ disableClose: true }">
      Open locked
    </button>

    <ng-template #dialog>
      <sanring-dialog-content>
        <h2 sanringDialogTitle>Dialog title</h2>
        <p sanringDialogDescription>Dialog description</p>
        <button type="button" [sanringDialogClose]="'saved'">Save</button>
        <button type="button" sanringDialogClose>Dismiss</button>
      </sanring-dialog-content>
    </ng-template>
  `,
})
class DialogTestHost {
  @ViewChild('dialog') readonly dialog!: TemplateRef<unknown>;

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

    expect(overlayContainer.getContainerElement().querySelector('cdk-dialog-container')).not.toBeNull();
  });

  it('closes with the provided close result', () => {
    const fixture = TestBed.createComponent(DialogTestHost);
    fixture.detectChanges();

    const ref = fixture.componentInstance.dialogService.open<string>(fixture.componentInstance.dialog);
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

    const ref = fixture.componentInstance.dialogService.open<string>(fixture.componentInstance.dialog);
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
});
