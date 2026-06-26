import { Directive, signal, computed } from '@angular/core';

// 定義圖片的生命週期狀態
export type AvatarImageState = 'idle' | 'loading' | 'loaded' | 'error';

@Directive({
  // 建議加上 img 限定，這樣編譯器會有更精準的型別推斷
  selector: 'img[sanringAvatarImage]',
  standalone: true,
  host: {
    // 1. 綁定瀏覽器原生事件
    '(load)': 'onLoad()',
    '(error)': 'onError()',

    // 2. 將 Signal 綁定到宿主元素的樣式與屬性
    '[style.display]': 'displayStyle()',
    '[attr.aria-hidden]': 'ariaHidden()',
  },
})
export class AvatarImageDirective {
  /** * 核心狀態 (Signal)
   * 預設為 'idle'，當瀏覽器開始解析 src 時會進入載入流程
   */
  readonly imageState = signal<AvatarImageState>('idle');

  /** * 樣式控制 (Computed)
   * 無頭組件的標準做法：圖片尚未載入完成（或破圖）前，完全隱藏 <img> 標籤。
   * 這樣父層的 AvatarFallback 才不會跟破圖圖示重疊。
   */
  protected readonly displayStyle = computed(() =>
    this.imageState() === 'loaded' ? 'block' : 'none',
  );

  /** * 無障礙 ARIA 支援 (Computed)
   * 如果圖片沒載入完成或破圖，對螢幕閱讀器隱藏這個 <img>，
   * 讓螢幕閱讀器去朗讀 Fallback 裡面的替代文字，避免重複或報錯。
   */
  protected readonly ariaHidden = computed(() => (this.imageState() !== 'loaded' ? 'true' : null));

  // --- 原生事件處理器 ---

  protected onLoad() {
    this.imageState.set('loaded');
  }

  protected onError() {
    this.imageState.set('error');
  }
}
