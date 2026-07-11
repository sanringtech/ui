import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { FileDropzoneComponent } from './file-dropzone.component';
import { FileTriggerDirective } from './file-trigger.directive';
import { FileUploadComponent } from './file-upload.component';

@Component({
  imports: [FileUploadComponent, FileDropzoneComponent, FileTriggerDirective, FormsModule],
  template: `
    <sanring-file-upload [(ngModel)]="files">
      <sanring-file-dropzone>
        <button sanringFileTrigger type="button">Browse</button>
      </sanring-file-dropzone>
    </sanring-file-upload>
  `,
})
class FileUploadTestHost {
  @ViewChild(FileUploadComponent) upload!: FileUploadComponent;
  files: File[] = [];
}

describe('FileTriggerDirective projected through a conditional dropzone slot', () => {
  it('creates the hidden input without throwing (regression: FileDropzoneComponent wraps its ng-content in @if)', async () => {
    const fixture = TestBed.createComponent(FileUploadTestHost);

    expect(() => fixture.detectChanges()).not.toThrow();
    await fixture.whenStable();
    fixture.detectChanges();

    const hiddenInput = fixture.nativeElement.querySelector('input[type="file"]');
    expect(hiddenInput).toBeTruthy();
  });

  it('lets the trigger button re-create its hidden input after the dropzone swaps content back', async () => {
    const fixture = TestBed.createComponent(FileUploadTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    fixture.componentInstance.upload.handleFiles([file]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // dropzone 現在應該顯示 sanring-file-item，而不是原本投影的 trigger 按鈕
    expect(fixture.nativeElement.querySelector('sanring-file-item')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button[sanringfiletrigger]')).toBeFalsy();

    fixture.componentInstance.upload.removeFile(file);
    expect(() => fixture.detectChanges()).not.toThrow();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[sanringfiletrigger]')).toBeTruthy();
  });
});
