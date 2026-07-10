import { Component, HostListener, computed, inject, input, signal } from '@angular/core';
import { FileUploadComponent } from './file-upload.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-file-dropzone',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'dropzoneClass()',
    // 讓外部可以透過 CSS 的 data-dragging 狀態來改變樣式 (例如發光或變色)
    '[attr.data-dragging]': 'isDragging()',
  },
})
export class FileDropzoneComponent {
  readonly class = input<string | undefined>();

  // 🌟 連線到大腦
  protected upload = inject(FileUploadComponent);

  // 紀錄目前滑鼠是否正拖著檔案懸停在上方
  readonly isDragging = signal(false);

  // 🎨 預設的虛線框與互動樣式
  protected readonly dropzoneClass = computed(() =>
    cn(
      'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors',
      'hover:bg-accent/50',
      // 當有檔案拖曳進來時的視覺回饋
      this.isDragging() && 'border-primary bg-accent opacity-80',
      this.upload.disabled() && 'pointer-events-none opacity-50 cursor-not-allowed',
      this.class(),
    ),
  );

  // ==========================================
  // DOM 拖曳事件攔截
  // ==========================================

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault(); // 🛑 必須阻止預設行為，否則無法觸發 drop
    event.stopPropagation();
    if (!this.upload.disabled()) {
      this.isDragging.set(true);
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault(); // 🛑 避免瀏覽器直接開啟圖片或 PDF
    event.stopPropagation();
    this.isDragging.set(false);

    if (this.upload.disabled()) return;

    // 🌟 將攔截到的檔案交給大腦處理！
    const files = event.dataTransfer?.files;
    if (files) {
      this.upload.handleFiles(files);
    }
  }
}
