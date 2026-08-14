import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { FileDropzoneComponent } from './file-dropzone.component';
import { FileUploadComponent } from './file-upload.component';

function file(name: string, size: number, type = 'text/plain'): File {
  return new File([new Uint8Array(size)], name, { type });
}

// jsdom has no DragEvent constructor — dragover/dragleave only need
// preventDefault/stopPropagation, not real DataTransfer, so a plain Event works.
function dragEvent(type: string): Event {
  return new Event(type, { bubbles: true, cancelable: true });
}

@Component({
  imports: [FileUploadComponent, FileDropzoneComponent],
  template: `
    <sanring-file-upload
      [multiple]="multiple"
      [accept]="accept"
      [maxSize]="maxSize"
      [maxFiles]="maxFiles"
      [disabled]="disabled"
    >
      <sanring-file-dropzone class="custom-dropzone-class">Drop here</sanring-file-dropzone>
    </sanring-file-upload>
  `,
})
class FileUploadTestHost {
  multiple = false;
  accept = '*';
  maxSize: number | null = null;
  maxFiles: number | null = null;
  disabled = false;
}

describe('FileUploadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadTestHost],
    }).compileComponents();
  });

  function setup(overrides: Partial<FileUploadTestHost> = {}) {
    const fixture = TestBed.createComponent(FileUploadTestHost);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    return fixture;
  }

  function upload(fixture: ReturnType<typeof setup>): FileUploadComponent {
    const debugEl = fixture.debugElement.query((n) => n.componentInstance instanceof FileUploadComponent);
    return debugEl.componentInstance as FileUploadComponent;
  }

  function dropzone(fixture: ReturnType<typeof setup>): HTMLElement {
    return fixture.nativeElement.querySelector('sanring-file-dropzone') as HTMLElement;
  }

  it('merges host class with consumer class on the dropzone', () => {
    const fixture = setup();
    expect(dropzone(fixture).classList.contains('custom-dropzone-class')).toBe(true);
  });

  it('accepts a matching file and rejects one that fails the accept filter', () => {
    const fixture = setup({ accept: 'image/*' });

    const comp = upload(fixture);
    comp.handleFiles([file('doc.txt', 10, 'text/plain')]);
    fixture.detectChanges();

    expect(comp.files()).toEqual([]);
    expect(comp.rejectedFiles().length).toBe(1);
  });

  it('rejects a file larger than maxSize', () => {
    const fixture = setup({ maxSize: 5 });

    const comp = upload(fixture);
    comp.handleFiles([file('big.txt', 100)]);
    fixture.detectChanges();

    expect(comp.files()).toEqual([]);
    expect(comp.rejectedFiles().length).toBe(1);
  });

  it('caps accepted files at maxFiles and rejects the overflow', () => {
    const fixture = setup({ multiple: true, maxFiles: 2 });

    const comp = upload(fixture);
    expect(comp.multiple()).toBe(true);
    expect(comp.maxFiles()).toBe(2);
    comp.handleFiles([file('a.txt', 1), file('b.txt', 1), file('c.txt', 1)]);
    fixture.detectChanges();

    expect(comp.files().map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
    expect(comp.rejectedFiles().length).toBe(1);
  });

  it('replaces the current file in single mode instead of accumulating', () => {
    const fixture = setup();
    const comp = upload(fixture);

    comp.handleFiles([file('a.txt', 1)]);
    fixture.detectChanges();
    comp.handleFiles([file('b.txt', 1)]);
    fixture.detectChanges();

    expect(comp.files().map((f) => f.name)).toEqual(['b.txt']);
  });

  it('deduplicates files with the same name and size in multiple mode', () => {
    const fixture = setup({ multiple: true });

    const comp = upload(fixture);
    comp.handleFiles([file('a.txt', 5)]);
    fixture.detectChanges();
    comp.handleFiles([file('a.txt', 5), file('b.txt', 5)]);
    fixture.detectChanges();

    expect(comp.files().map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
  });

  it('sets data-dragging on dragover and clears it on dragleave', () => {
    const fixture = setup();
    const zone = dropzone(fixture);

    zone.dispatchEvent(dragEvent('dragover'));
    fixture.detectChanges();
    expect(zone.getAttribute('data-dragging')).toBe('true');

    zone.dispatchEvent(dragEvent('dragleave'));
    fixture.detectChanges();
    expect(zone.getAttribute('data-dragging')).toBe('false');
  });

  it('ignores dropped files while disabled', () => {
    const fixture = setup({ disabled: true });

    const comp = upload(fixture);
    comp.handleFiles([file('a.txt', 1)]);
    fixture.detectChanges();

    expect(comp.files()).toEqual([]);
  });

  it('removes a file via the file-item remove button', () => {
    const fixture = setup();
    const comp = upload(fixture);
    comp.handleFiles([file('a.txt', 1)]);
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector(
      'sanring-file-item button',
    ) as HTMLButtonElement;
    expect(removeButton).toBeTruthy();
    removeButton.click();
    fixture.detectChanges();

    expect(comp.files()).toEqual([]);
    expect(fixture.nativeElement.querySelector('sanring-file-item')).toBeFalsy();
  });
});
