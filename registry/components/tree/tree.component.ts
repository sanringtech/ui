import { TreeKeyManager } from '@angular/cdk/a11y';
import { toObservable } from '@angular/core/rxjs-interop';
import { Component, Injector, computed, contentChildren, inject, input, model, signal } from '@angular/core';
import { map } from 'rxjs';
import { cn } from '../shared/utils';
import { TreeNodeComponent } from './tree-node.component';

@Component({
  selector: 'sanring-tree',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'tree',
    '[class]': 'treeClass()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class TreeComponent {
  readonly class = input<string | undefined>();
  readonly expandedValue = model<string[]>([]);
  readonly selectedValue = model<string | null>(null);

  private readonly injector = inject(Injector);
  private readonly nodes = contentChildren(TreeNodeComponent, { descendants: true });

  // ARIA treeview 規範要求方向鍵在節點間移動焦點、左右鍵展開/收合、且同一時間只有
  // 一個節點是 tab stop（roving tabindex）——這些全部交給 CDK 的 TreeKeyManager 處理，
  // 不自己刻，避免漏掉邊界情況（例如巢狀展開/收合時焦點該落在哪）。
  private readonly keyManager = new TreeKeyManager(
    toObservable(this.nodes, { injector: this.injector }).pipe(map((nodes) => [...nodes])),
    { shouldActivationFollowFocus: false },
  );

  // 使用者實際用鍵盤/滑鼠互動過後，TreeKeyManager 回報的 active 節點
  private readonly explicitActiveNode = signal<TreeNodeComponent | null>(null);
  // 互動前的預設 tab stop：有選取節點就落在選取節點，沒有就落在第一個節點，
  // 這樣使用者第一次按 Tab 才真的進得去樹狀結構，不會找不到入口。
  private readonly fallbackActiveNode = computed(() => {
    const nodes = this.nodes();
    if (nodes.length === 0) return null;
    return nodes.find((node) => node.value() === this.selectedValue()) ?? nodes[0];
  });
  private readonly activeNode = computed(() => this.explicitActiveNode() ?? this.fallbackActiveNode());

  protected readonly treeClass = computed(() => cn('flex flex-col gap-1 w-full', this.class()));

  constructor() {
    this.keyManager.change.subscribe((node) => this.explicitActiveNode.set(node));
  }

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

  isActiveNode(node: TreeNodeComponent): boolean {
    return this.activeNode() === node;
  }

  focusNode(node: TreeNodeComponent): void {
    this.keyManager.focusItem(node);
  }

  protected onKeydown(event: KeyboardEvent) {
    this.keyManager.onKeydown(event);
  }
}
