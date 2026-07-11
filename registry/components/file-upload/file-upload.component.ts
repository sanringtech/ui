import {
  Component,
  DestroyRef,
  Injector,
  OnInit,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { FieldType, SANRING_FIELD_CONTROL, SanringFieldControl } from '../field/field.type';
import { FileRejection, FileUploadErrorCode } from './file-upload.type';

@Component({
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
export class FileUploadComponent implements ControlValueAccessor, OnInit {
  // ==========================================
  // 1. 外部設定 (Inputs)
  // ==========================================
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

  // ==========================================
  // 3. 給子元件 (Dropzone/Trigger) 呼叫的 API
  // ==========================================

  readonly id = `sanring-file-upload-${nextFileUploadId++}`;
  focused = false;
  ngControl: NgControl | null = null;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly describedByIds = signal<string[]>([]);
  private readonly disabledState = signal(false);
  private readonly stateVersion = signal(0);
  private readonly stateChangesSubject = new Subject<void>();
  readonly stateChanges = this.stateChangesSubject.asObservable();

  private triggerInput: HTMLInputElement | null = null;
  private onChange: (value: File[]) => void = () => {};
  private onTouched: () => void = () => {};

  get fieldValue(): File[] {
    return this.files();
  }

  get fieldEmpty(): boolean {
    return this.files().length === 0;
  }

  get errorState(): boolean {
    this.stateVersion();
    return this.rejectedFiles().length > 0 || !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  get isDisabled(): boolean {
    return this.disabled() || this.disabledState();
  }

  get fieldRequired(): boolean {
    this.stateVersion();
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  readonly describedByAttr = computed(() => {
    const ids = this.describedByIds();
    return ids.length ? ids.join(' ') : null;
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.stateChangesSubject.complete());
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { optional: true, self: true });
    // Listen to control.events rather than statusChanges only: markAsTouched() does not
    // emit statusChanges, but it still needs to refresh Field error state.
    this.ngControl?.control?.events
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitStateChanges());
  }

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

  writeValue(value: File[] | null): void {
    this.files.set(value ?? []);
    this.rejectedFiles.set([]);
    this.emitStateChanges();
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    this.triggerInput?.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.describedByIds.set(ids);
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

  private emitStateChanges(): void {
    this.stateVersion.update((v) => v + 1);
    this.stateChangesSubject.next();
  }
}

class FileUploadFieldControlAdapter implements SanringFieldControl<File[]> {
  readonly controlType = FieldType.fileUpload;

  constructor(private readonly host: FileUploadComponent) {}

  get id(): string {
    return this.host.id;
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

  get ngControl(): NgControl | null {
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

let nextFileUploadId = 0;

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
