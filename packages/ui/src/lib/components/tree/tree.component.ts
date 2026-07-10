import { Component, computed, input, model } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-tree',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'tree',
    '[class]': 'treeClass()',
  },
})
export class TreeComponent {
  readonly class = input<string | undefined>();
  readonly expandedValue = model<string[]>([]);
  readonly selectedValue = model<string | null>(null);

  protected readonly treeClass = computed(() =>
    cn(
      // 預設給一點基礎樣式，避免破版
      'flex flex-col gap-1 w-full',
      this.class(),
    ),
  );

  toggleExpand(value: string) {
    const current = this.expandedValue();
    if (current.includes(value)) {
      // 如果已經在名單內，就把它移除 (收合)
      this.expandedValue.set(current.filter((v) => v !== value));
    } else {
      // 如果不在名單內，就加進去 (展開)
      this.expandedValue.set([...current, value]);
    }
  }

  // 📥 開放給 Node 呼叫：選取某個檔案
  selectNode(value: string) {
    this.selectedValue.set(value);
  }

  // 🔍 查詢工具：讓子節點能快速知道自己是不是展開狀態
  isExpanded(value: string): boolean {
    return this.expandedValue().includes(value);
  }
}
