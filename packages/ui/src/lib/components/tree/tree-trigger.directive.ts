import { Directive, inject } from '@angular/core';
import { TreeComponent } from './tree.component';
import { TreeNodeComponent } from './tree-node.component';

// 純粹的點擊展開/收合開關（例如資料夾圖示）。鍵盤互動（方向鍵、Enter）已經集中
// 交給 TreeComponent 上的 CDK TreeKeyManager 處理，所以這裡不再需要自己的
// tabindex/role="button"/keydown 綁定——保留的話會讓同一列出現兩個 tab stop，
// 破壞 roving tabindex（一次只有一個節點是 tab stop）的規則。
@Directive({
  selector: '[sanringTreeTrigger]',
  standalone: true,
  host: {
    '(click)': 'toggle()',
  },
})
export class TreeTriggerDirective {
  private node = inject(TreeNodeComponent);
  private tree = inject(TreeComponent);

  protected toggle(event?: Event) {
    event?.stopPropagation();
    event?.preventDefault();
    this.tree.toggleExpand(this.node.value());
  }
}
