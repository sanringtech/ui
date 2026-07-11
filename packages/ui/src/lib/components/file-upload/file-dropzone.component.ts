import { Component, HostListener, computed, inject, input, signal } from '@angular/core';
import { FileItemComponent } from './file-item.component';
import { FileUploadComponent } from './file-upload.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-file-dropzone',
  standalone: true,
  imports: [FileItemComponent],
  template: `
    <!-- 一旦有已接受或被拒絕的檔案，虛線提示框就讓位給檔案清單；
         host 上的拖放監聽不受影響，multiple 模式下仍可以繼續拖新檔案進來疊加 -->
    @if (upload.files().length === 0 && upload.rejectedFiles().length === 0) {
      <!-- 空狀態的圖示不內建：一旦要跟文字/按鈕做精準的行內排版（例如 icon 緊貼在
           「Browse files」文字前面），內建在這層、跟投影內容分開的圖示就做不到，
           所以圖示改由外部自己放進 <ng-content> 裡，跟文字排在一起 -->
      <ng-content></ng-content>
    } @else {
      <div class="grid w-full gap-2">
        @for (file of upload.files(); track file) {
          <sanring-file-item [file]="file" />
        }
        @for (rejection of upload.rejectedFiles(); track rejection.file) {
          <sanring-file-item [file]="rejection.file" [errors]="rejection.errors" />
        }
      </div>
    }
  `,
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

  protected readonly hasContent = computed(
    () => this.upload.files().length > 0 || this.upload.rejectedFiles().length > 0,
  );

  // 🎨 空狀態時是虛線提示框；一旦顯示檔案清單，改成單純的容器（不再是「請把檔案丟進來」的視覺）。
  // 拖曳中的變色不綁在空狀態分支下——multiple 模式下已經有檔案時繼續拖新檔案進來，
  // 一樣要有視覺回饋，所以 isDragging 的樣式獨立在最外層、跟 hasContent 是否顯示清單無關。
  protected readonly dropzoneClass = computed(() =>
    cn(
      'relative rounded-lg border-2 transition-colors',
      this.hasContent() ? 'border-transparent p-0' : 'border-dashed border-[var(--sanring-border-strong)] p-6',
      !this.hasContent() && 'flex flex-col items-center justify-center hover:bg-[var(--sanring-surface-strong)]',
      // 拖曳中的視覺回饋：不管有沒有已存在的檔案都要變色。用 --sanring-active（跟 select-item
      // 選中狀態同一個 token）而不是 --sanring-primary，因為後者在 docs app 沒有實際定義成
      // CSS 變數（只有橋接給 Tailwind 的 --color-primary），直接當 var() 用會是空值
      this.isDragging() && 'border-[var(--sanring-active)] bg-[var(--sanring-active)]/30',
      this.upload.isDisabled && 'pointer-events-none opacity-50 cursor-not-allowed',
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
    if (!this.upload.isDisabled) {
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

    if (this.upload.isDisabled) return;

    // 🌟 將攔截到的檔案交給大腦處理！
    const files = event.dataTransfer?.files;
    if (files) {
      this.upload.handleFiles(files);
    }
  }
}
