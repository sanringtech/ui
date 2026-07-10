import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { FileUploadComponent } from './file-upload.component';

@Directive({
  // 簡化 Selector 提升 DX (開發者體驗)
  selector: '[sanringFileTrigger]',
  standalone: true,
})
export class FileTriggerDirective implements OnInit, OnDestroy {
  // 🌟 1. 注入大腦與 DOM 操作工具
  private upload = inject(FileUploadComponent);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // 存放動態生成的隱藏 input
  private hiddenInput!: HTMLInputElement;

  ngOnInit() {
    // 🌟 2. 建立隱藏的原生 input
    this.hiddenInput = this.renderer.createElement('input');
    this.renderer.setAttribute(this.hiddenInput, 'type', 'file');
    this.renderer.setStyle(this.hiddenInput, 'display', 'none');

    // 🌟 3. 同步大腦的設定 (支援多選與格式限制)
    if (this.upload.multiple()) {
      this.renderer.setAttribute(this.hiddenInput, 'multiple', 'true');
    }
    if (this.upload.accept()) {
      this.renderer.setAttribute(this.hiddenInput, 'accept', this.upload.accept()!);
    }

    // 🌟 4. 監聽原生 input 的 change 事件 (當使用者選好檔案時)
    this.renderer.listen(this.hiddenInput, 'change', (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      this.upload.handleFiles(files);

      // ⚠️ 關鍵細節：清空 value，這樣如果使用者馬上再選一次「同一個檔案」，依然能觸發 change 事件
      this.hiddenInput.value = '';
    });

    // 將這個隱藏的 input 附加到畫面上 (插在當前按鈕的旁邊)
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.hiddenInput);
  }

  // 🌟 5. 攔截宿主元素的點擊事件
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    if (this.upload.disabled()) return;

    // 代為點擊那個隱藏的原生 input
    this.hiddenInput.click();
  }

  ngOnDestroy() {
    // 🧹 清理機制：元件銷毀時，記得把動態生成的 input 拔掉，避免 Memory Leak
    if (this.hiddenInput && this.hiddenInput.parentNode) {
      this.renderer.removeChild(this.hiddenInput.parentNode, this.hiddenInput);
    }
  }
}
