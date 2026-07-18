import { Injectable, signal } from '@angular/core';

/**
 * 橋接 header 跟 DocsSidebarComponent：header 在所有頁面共用一份，但手機版的
 * 漢堡選單只該在有側邊導覽的頁面（DocsArticleShellComponent 底下）出現，
 * 且觸發的 Sheet 開關狀態要跟 DocsSidebarComponent 裡實際擁有導覽內容的
 * <sanring-sheet> 同步，所以用一個共用 service 存這兩個旗標。
 */
@Injectable({ providedIn: 'root' })
export class DocsNavStateService {
  readonly hasSidebar = signal(false);
  readonly mobileNavOpen = signal(false);
}
