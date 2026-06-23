import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { DialogContentComponent } from './dialog-content.component';
import { DialogDescriptionDirective } from './dialog-description.directive';
import { DialogTitleDirective } from './dialog-title.directive';
import { DialogTriggerDirective } from './dialog-trigger.directive';

@Component({
  imports: [
    DialogContentComponent,
    DialogDescriptionDirective,
    DialogTitleDirective,
    DialogTriggerDirective,
  ],
  template: `
    <button type="button" [sanringDialogTrigger]="dialog">Open</button>

    <ng-template #dialog>
      <sanring-dialog-content>
        <h2 sanringDialogTitle>Dialog title</h2>
        <p sanringDialogDescription>Dialog description</p>
      </sanring-dialog-content>
    </ng-template>
  `,
})
class DialogTestHost {}

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
  });
});
