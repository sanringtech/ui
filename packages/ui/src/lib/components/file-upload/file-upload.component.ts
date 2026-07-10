import { Component, computed, input, model, signal } from '@angular/core';

@Component({
  selector: 'sanring-file-upload',
  standalone: true,
  template: `<ng-content></ng-content>`,
  // 大腦通常不帶有太多外觀樣式，主要作為狀態容器
  host: { class: 'block w-full' },
})
export class FileUploadComponent {
  // ==========================================
  // 1. 外部設定 (Inputs)
  // ==========================================
  readonly accept = input<string>('*');
  readonly multiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  // ==========================================
  // 2. 雙向綁定的核心狀態 (Models)
  // ==========================================
  readonly files = model<File[]>([]);

  // ==========================================
  // 3. 給子元件 (Dropzone/Trigger) 呼叫的 API
  // ==========================================

  /** 接收來自外部的檔案並更新狀態 */
  handleFiles(newFiles: FileList | File[] | null) {
    if (this.disabled() || !newFiles || newFiles.length === 0) return;

    // 將 FileList 轉換為標準陣列
    const fileArray = Array.from(newFiles);

    // 簡單邏輯：如果是單選，就只取第一個；如果是多選，就附加到現有陣列後
    if (this.multiple()) {
      this.files.update((current) => [...current, ...fileArray]);
    } else {
      this.files.set([fileArray[0]]);
    }

    // TODO: 未來可以在這裡加入檔案大小與格式的驗證邏輯
  }

  /** 移除特定檔案 */
  removeFile(fileToRemove: File) {
    this.files.update((current) => current.filter((f) => f !== fileToRemove));
  }
}
