import { Directive, inject } from '@angular/core';
import { TreeComponent } from './tree.component';
import { TreeNodeComponent } from './tree-node.component';

@Directive({
  selector: '[sanringTreeTrigger]',
  standalone: true,
  host: {
    '(click)': 'toggle()',
    '(keydown.enter)': 'toggle()',
    '(keydown.space)': 'toggle()',

    role: 'button',
    tabindex: '0',
    '[attr.aria-expanded]': 'isExpanded()',
  },
})
export class TreeTriggerDirective {
  private node = inject(TreeNodeComponent);
  private tree = inject(TreeComponent);

  // 告訴 HTML 目前是否處於展開狀態
  protected isExpanded(): boolean {
    return this.tree.isExpanded(this.node.value());
  }

  // 核心動作：通知大腦切換狀態！
  protected toggle(event?: Event) {
    // 避免事件冒泡，干擾到外層的其他點擊邏輯
    event?.stopPropagation();
    event?.preventDefault();

    // 呼叫我們剛剛在大腦寫好的方法
    this.tree.toggleExpand(this.node.value());
  }
}
