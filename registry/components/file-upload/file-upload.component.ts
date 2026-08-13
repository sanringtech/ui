import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { SanringCvaBase } from '../shared/cva-base';
import { FieldType, SANRING_FIELD_CONTROL, SanringFieldControl } from '../field/field.type';
import { FileRejection, FileUploadErrorCode } from './file-upload.type';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-file-upload',
  standalone: true,
  exportAs: 'sanringFileUpload',
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: FileUploadComponent) => new FileUploadFieldControlAdapter(host),
      deps: [forwardRef(() => FileUploadComponent)],
    },
  ],
  // 大腦通常不帶有太多外觀樣式，主要作為狀態容器
  host: {
    class: 'block w-full',
    '[attr.aria-invalid]': 'errorState ? "true" : null',
    '[attr.aria-required]': 'fieldRequired ? "true" : null',
    '[attr.aria-describedby]': 'describedByAttr()',
  },
})
export class FileUploadComponent extends SanringCvaBase<File[]> {
  // ==========================================
  // 1. 外部設定 (Inputs)
  // ==========================================
  readonly id = input(inject(_IdGenerator).getId('sanring-file-upload-', true));
  readonly accept = input<string>('*');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly maxSize = input<number | null, unknown>(null, { transform: nullableNumberAttribute });
  readonly maxFiles = input<number | null, unknown>(null, { transform: nullableNumberAttribute });

  // ==========================================
  // 2. 雙向綁定的核心狀態 (Models)
  // ==========================================
  readonly files = model<File[]>([]);
  readonly rejectedFiles = signal<FileRejection[]>([]);

  readonly describedByAttr = this.makeComputedAriaDescribedBy();

  get isDisabled(): boolean {
    return this.disabled() || this.disabledState();
  }

  // file-upload errorState includes rejected files in addition to the standard invalid+touched check
  override get errorState(): boolean {
    this._stateVersion();
    return (
      this.rejectedFiles().length > 0 || !!(this.ngControl?.invalid && this.ngControl?.touched)
    );
  }

  get fieldValue(): File[] {
    return this.files();
  }

  get fieldEmpty(): boolean {
    return this.files().length === 0;
  }

  get fieldDisabled(): boolean {
    return this.isDisabled;
  }

  protected override hasInputRequired(): boolean {
    return this.required();
  }

  private triggerInput: HTMLInputElement | null = null;

  /** 接收來自外部的檔案、驗證後更新狀態 */
  handleFiles(newFiles: FileList | File[] | null) {
    if (this.isDisabled || !newFiles || newFiles.length === 0) return;

    const fileArray = Array.from(newFiles);
    const { accepted: validFiles, rejected } = this.validateFiles(fileArray);
    const currentFiles = this.files();
    const candidateFiles = this.multiple() ? getUniqueFiles(validFiles, currentFiles) : validFiles;
    const availableSlots = this.multiple() ? this.remainingSlots(currentFiles.length) : 1;
    const accepted = candidateFiles.slice(0, availableSlots);
    const overflow = candidateFiles.slice(availableSlots);

    this.rejectedFiles.set([
      ...rejected,
      ...overflow.map((file) => ({ file, errors: [FileUploadErrorCode.MaxFiles] })),
    ]);

    if (accepted.length === 0) {
      this.onTouched();
      this.emitStateChanges();
      return;
    }

    if (this.multiple()) {
      this.files.set([...currentFiles, ...accepted]);
    } else {
      this.files.set([accepted[0]]);
    }

    this.syncValue();
  }

  /** 移除特定檔案 */
  removeFile(fileToRemove: File) {
    this.files.update((current) => current.filter((f) => f !== fileToRemove));
    this.rejectedFiles.set([]);
    this.syncValue();
  }

  /** 關閉單一被拒絕的檔案通知，不影響已接受的檔案 */
  dismissRejection(fileToDismiss: File) {
    this.rejectedFiles.update((current) => current.filter((r) => r.file !== fileToDismiss));
  }

  clearFiles() {
    this.files.set([]);
    this.rejectedFiles.set([]);
    this.syncValue();
  }

  registerTriggerInput(input: HTMLInputElement): void {
    this.triggerInput = input;
  }

  unregisterTriggerInput(input: HTMLInputElement): void {
    if (this.triggerInput === input) {
      this.triggerInput = null;
    }
  }

  override writeValue(value: File[] | null): void {
    this.files.set(value ?? []);
    this.rejectedFiles.set([]);
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    this.triggerInput?.focus(options);
  }

  markTouched(): void {
    this.onTouched();
    this.emitStateChanges();
  }

  private validateFiles(files: File[]): FileValidationResult {
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    for (const file of files) {
      const errors = this.getFileErrors(file);
      if (errors.length) {
        rejected.push({ file, errors });
      } else {
        accepted.push(file);
      }
    }

    return { accepted, rejected };
  }

  private getFileErrors(file: File): FileUploadErrorCode[] {
    const errors: FileUploadErrorCode[] = [];
    const maxSize = this.maxSize();

    if (maxSize !== null && file.size > maxSize) {
      errors.push(FileUploadErrorCode.MaxSize);
    }

    if (!isAcceptedFile(file, this.accept())) {
      errors.push(FileUploadErrorCode.Accept);
    }

    return errors;
  }

  private remainingSlots(currentCount: number): number {
    const maxFiles = this.maxFiles();
    if (maxFiles === null) return Number.POSITIVE_INFINITY;
    return Math.max(maxFiles - currentCount, 0);
  }

  private syncValue(): void {
    const files = this.files();
    this.onChange(files);
    this.onTouched();
    this.emitStateChanges();
  }
}

// file-upload has a plain-string `id` (not an input signal) and `isDisabled` instead of `fieldDisabled`,
// so it uses its own slim adapter rather than SanringFieldControlAdapter.
class FileUploadFieldControlAdapter implements SanringFieldControl<File[]> {
  readonly controlType = FieldType.fileUpload;

  constructor(private readonly host: FileUploadComponent) {}

  get id(): string {
    return this.host.id();
  }

  get value(): File[] {
    return this.host.fieldValue;
  }

  get empty(): boolean {
    return this.host.fieldEmpty;
  }

  get focused(): boolean {
    return this.host.focused;
  }

  get errorState(): boolean {
    return this.host.errorState;
  }

  get disabled(): boolean {
    return this.host.isDisabled;
  }

  get required(): boolean {
    return this.host.fieldRequired;
  }

  get ngControl() {
    return this.host.ngControl;
  }

  get stateChanges(): Observable<void> {
    return this.host.stateChanges;
  }

  focus(options?: FocusOptions): void {
    this.host.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.host.setDescribedByIds(ids);
  }
}

interface FileValidationResult {
  accepted: File[];
  rejected: FileRejection[];
}

function nullableNumberAttribute(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = numberAttribute(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isAcceptedFile(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);

  if (rules.length === 0 || rules.includes('*') || rules.includes('*/*')) return true;

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith('.')) return fileName.endsWith(rule);
    if (rule.endsWith('/*')) return fileType.startsWith(rule.slice(0, -1));
    return fileType === rule;
  });
}

function getUniqueFiles(files: File[], existingFiles: File[]): File[] {
  return files.filter(
    (newFile) =>
      !existingFiles.some(
        (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size,
      ),
  );
}
