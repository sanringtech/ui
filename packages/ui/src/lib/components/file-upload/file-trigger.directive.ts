import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FileUploadComponent } from './file-upload.component';

@Directive({
  // 簡化 Selector 提升 DX (開發者體驗)
  selector: '[sanringFileTrigger]',
  standalone: true,
})
export class FileTriggerDirective implements OnDestroy {
  // 🌟 1. 注入大腦與 DOM 操作工具
  private upload = inject(FileUploadComponent);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // 存放動態生成的隱藏 input
  private hiddenInput!: HTMLInputElement;
  private readonly hiddenInputReady = signal(false);
  private removeChangeListener: (() => void) | null = null;

  constructor() {
    effect(() => {
      if (!this.hiddenInputReady()) return;
      this.syncHiddenInputAttributes();
    });

    // 用 afterNextRender 而不是 ngOnInit：這顆按鈕現在可能被投影在 @if 區塊裡
    // (見 FileDropzoneComponent)，ngOnInit 觸發時投影節點不一定已經真的接到 DOM
    // 上，這時 el.nativeElement.parentNode 會是 null，導致 appendChild 直接炸掉。
    // afterNextRender 保證這次渲染真的跑完、DOM 已經定位好才執行。
    afterNextRender(() => this.createHiddenInput());
  }

  private createHiddenInput(): void {
    // 🌟 2. 建立隱藏的原生 input
    this.hiddenInput = this.renderer.createElement('input');
    this.renderer.setAttribute(this.hiddenInput, 'type', 'file');
    this.renderer.setStyle(this.hiddenInput, 'display', 'none');
    this.syncHiddenInputAttributes();

    // 🌟 4. 監聽原生 input 的 change 事件 (當使用者選好檔案時)
    this.removeChangeListener = this.renderer.listen(this.hiddenInput, 'change', (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      this.upload.handleFiles(files);

      // ⚠️ 關鍵細節：清空 value，這樣如果使用者馬上再選一次「同一個檔案」，依然能觸發 change 事件
      this.hiddenInput.value = '';
    });

    // 將這個隱藏的 input 附加到畫面上 (插在當前按鈕的旁邊)
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.hiddenInput);
    this.upload.registerTriggerInput(this.hiddenInput);
    this.hiddenInputReady.set(true);
  }

  // 🌟 5. 攔截宿主元素的點擊事件
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    if (this.upload.isDisabled) return;

    // 代為點擊那個隱藏的原生 input（afterNextRender 還沒跑完之前點擊視為無效）
    this.hiddenInput?.click();
  }

  ngOnDestroy() {
    this.removeChangeListener?.();
    if (!this.hiddenInput) return;

    this.upload.unregisterTriggerInput(this.hiddenInput);

    // 🧹 清理機制：元件銷毀時，記得把動態生成的 input 拔掉，避免 Memory Leak
    if (this.hiddenInput.parentNode) {
      this.renderer.removeChild(this.hiddenInput.parentNode, this.hiddenInput);
    }
  }

  private syncHiddenInputAttributes(): void {
    if (this.upload.multiple()) {
      this.renderer.setAttribute(this.hiddenInput, 'multiple', '');
    } else {
      this.renderer.removeAttribute(this.hiddenInput, 'multiple');
    }

    const accept = this.upload.accept();
    if (accept && accept !== '*') {
      this.renderer.setAttribute(this.hiddenInput, 'accept', accept);
    } else {
      this.renderer.removeAttribute(this.hiddenInput, 'accept');
    }

    if (this.upload.isDisabled) {
      this.renderer.setAttribute(this.hiddenInput, 'disabled', '');
    } else {
      this.renderer.removeAttribute(this.hiddenInput, 'disabled');
    }
  }
}
