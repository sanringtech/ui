import { Component, HostListener, computed, inject, input, signal } from '@angular/core';
import { FileItemComponent } from './file-item.component';
import { FileUploadComponent } from './file-upload.component';
import { cn } from '../shared/utils';

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
      'relative rounded-lg border-2',
      // p-0 讓外層 border 直接貼在 sanring-file-item 自己的 border 上——平常外層是透明的
      // 看不出來，但拖曳時外層變色，兩條 border 會緊貼著同時出現，看起來像重複的線。
      // 留一點 padding 讓兩層 border 之間有間距，拖曳變色時才不會黏在一起。
      this.hasContent() ? 'border-transparent p-2' : 'border-dashed border-[var(--sanring-border-strong)] p-6',
      !this.hasContent() && 'flex flex-col items-center justify-center hover:bg-[var(--sanring-surface-strong)]',
      // transition-colors 只在拖曳中才加，不要放在最外層當基礎 class：空狀態的邊框是
      // border-dashed，一旦選到檔案（不管是拖放還是點按鈕），hasContent 從 false → true
      // 會同時把 border-style 從 dashed 切成 solid、border-color 從 border-strong 切成
      // transparent——瀏覽器沒辦法把 dashed 平滑轉成 solid，兩者疊在一起造成圓角處噴出
      // 破碎殘影（看起來像兩側凸起的小三角形）。拿掉基礎 transition-colors 後，這個切換
      // 會直接跳過去，不再嘗試動畫化一個做不到的轉場；只有 isDragging 這個「同一個狀態內」
      // 的顏色變化才需要、也才能被平滑轉場。
      this.isDragging() && 'transition-colors border-[var(--sanring-active)] bg-[var(--sanring-active)]/30',
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
