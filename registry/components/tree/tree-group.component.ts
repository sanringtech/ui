import { Component, computed, inject, input } from '@angular/core';
import { TreeNodeComponent } from './tree-node.component';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-tree-group',
  standalone: true,
  template: `
    @if (isExpanded()) {
      <div role="group" [class]="groupClass()" data-state="open">
        <ng-content></ng-content>
      </div>
    }
  `,
  host: {
    // 將 host 設為 contents 避免多餘的 DOM 層級破壞排版
    style: 'display: contents;',
  },
})
export class TreeGroupComponent {
  // 允許外部微調樣式
  readonly class = input<string | undefined>();

  // 🪄 依賴注入：尋找包裹著自己的父親節點 (TreeNode)
  private node = inject(TreeNodeComponent);

  // 🔍 衍生狀態：跟隨父親的展開狀態
  protected readonly isExpanded = computed(() => this.node.isExpanded());

  // 🎨 視覺魔法：縮排與過渡動畫
  protected readonly groupClass = computed(() =>
    cn(
      // 1. 排版與樹狀輔助線：往右縮排 (ml-3)、加上左邊框 (border-l)、內部留白 (pl-3)
      'ml-3 flex flex-col gap-1 border-l pl-3 mt-1',
      // 2. 展開時的進場動畫。這個 div 只在展開時才存在於 DOM（見上面 @if），
      // 所以不需要 data-[state=]variant——每次掛載都是「剛展開」。原本這裡寫的是
      // tailwindcss-animate 外掛的 class 命名慣例，但這個專案沒裝那個外掛，animate-in
      // 等 class 一直是死的、不會播放；換成專案自己 styles.css @theme 定義的動畫。
      'animate-tree-group-in',
      this.class(),
    ),
  );
}
