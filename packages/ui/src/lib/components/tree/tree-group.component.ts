import { Component, computed, inject, input } from '@angular/core';
import { TreeNodeComponent } from './tree-node.component';
import { cn } from '../../utils';

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
      // 2. 展開時的平滑進場動畫 (搭配 tailwindcss-animate)
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1',
      this.class(),
    ),
  );
}
