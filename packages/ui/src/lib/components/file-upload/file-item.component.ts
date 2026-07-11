import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LucideFileText, LucideX } from '@lucide/angular';
import { cn } from '../../utils';
import { FileUploadComponent, FileUploadErrorCode } from './file-upload.component';

const ERROR_HINTS: Record<FileUploadErrorCode, string> = {
  [FileUploadErrorCode.Accept]: 'Unsupported file type',
  [FileUploadErrorCode.MaxSize]: 'File is too large',
  [FileUploadErrorCode.MaxFiles]: 'Too many files',
};

@Component({
  selector: 'sanring-file-item',
  standalone: true,
  imports: [LucideFileText, LucideX],
  template: `
    <div [class]="itemClass()">
      <div
        class="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[var(--sanring-radius-sm)] bg-[var(--sanring-surface-strong)] text-[var(--sanring-muted)]"
      >
        @if (previewUrl(); as url) {
          <img [src]="url" [attr.alt]="file().name" class="size-full object-cover" />
        } @else {
          <svg lucideFileText class="size-6"></svg>
        }
      </div>

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-[var(--sanring-foreground)]">
          {{ file().name }}
        </p>
        <!-- hint 只在這個檔案被拒絕時才顯示，取代原本的檔案大小 -->
        @if (hint(); as hintText) {
          <p class="truncate text-xs text-red-500">{{ hintText }}</p>
        } @else {
          <p class="text-xs text-[var(--sanring-muted)]">{{ formattedSize() }}</p>
        }
      </div>

      <button
        type="button"
        class="flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--sanring-muted)] opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sanring-border-strong)]"
        [attr.aria-label]="'Remove ' + file().name"
        (click)="remove()"
      >
        <svg lucideX class="size-3.5"></svg>
      </button>
    </div>
  `,
})
export class FileItemComponent {
  readonly class = input<string | undefined>();
  readonly file = input.required<File>();
  // 只有「被拒絕」的檔案才會帶 errors 進來（見 FileDropzoneComponent），一般已接受的檔案是空陣列
  readonly errors = input<readonly FileUploadErrorCode[]>([]);

  private readonly upload = inject(FileUploadComponent);

  protected readonly formattedSize = computed(() => formatFileSize(this.file().size));
  protected readonly hasError = computed(() => this.errors().length > 0);

  // 圖片檔案顯示真正的縮圖，而不是圖示；用 object URL 讀本機檔案，
  // 記得在檔案換掉或元件銷毀時 revoke，不然每張圖都會洩漏一個 blob URL
  protected readonly previewUrl = signal<string | null>(null);

  protected readonly hint = computed(() => {
    const errors = this.errors();
    if (!errors.length) return null;
    return errors.map((code) => ERROR_HINTS[code]).join(', ');
  });

  constructor() {
    effect((onCleanup) => {
      const file = this.file();
      if (!file.type.startsWith('image/')) {
        this.previewUrl.set(null);
        return;
      }

      const url = URL.createObjectURL(file);
      this.previewUrl.set(url);
      onCleanup(() => URL.revokeObjectURL(url));
    });
  }

  protected readonly itemClass = computed(() =>
    cn(
      'flex items-center gap-3 rounded-[var(--sanring-radius)] border p-2',
      this.hasError()
        ? 'border-red-500/50 bg-red-500/5'
        : 'border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)]',
      this.class(),
    ),
  );

  remove(): void {
    if (this.hasError()) {
      this.upload.dismissRejection(this.file());
    } else {
      this.upload.removeFile(this.file());
    }
  }
}

function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}
