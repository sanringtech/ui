import { TreeKeyManagerItem } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../shared/utils';
import { TreeComponent } from './tree.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-tree-node',
  standalone: true,
  exportAs: 'sanringTreeNode',
  template: `<ng-content></ng-content>`,
  host: {
    role: 'treeitem',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.data-disabled]': 'isDisabled() || null',
    // aria-expanded 只該出現在真的有子節點的 treeitem 上，葉節點完全不該有這個屬性
    '[attr.aria-expanded]': 'hasChildren() ? isExpanded() : null',
    // roving tabindex：同一時間整棵樹只有一個節點是 tab stop，其餘 -1，
    // 由 TreeComponent 的 TreeKeyManager 決定目前是哪一個。
    '[attr.tabindex]': 'tree.isActiveNode(this) ? 0 : -1',
    '[class]': 'nodeClass()',
    '(focus)': 'onFocus()',
  },
})
export class TreeNodeComponent implements TreeKeyManagerItem {
  readonly value = input.required<string>();
  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly tree = inject(TreeComponent);
  // 找最近的祖先節點（如果有巢狀），不是 self——用來讓 CDK TreeKeyManager 知道
  // Left 鍵該把焦點移去哪、getChildren() 又該怎麼篩出「只有直接子節點」。
  private readonly parentNode = inject(TreeNodeComponent, { optional: true, skipSelf: true });
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly isSelected = computed(() => this.tree.selectedValue() === this.value());
  readonly isExpanded = computed(() => this.tree.isExpanded(this.value()));
  readonly isDisabled = computed(() => this.disabled());
  readonly hasChildren = computed(() => this.getChildren().length > 0);

  protected readonly nodeClass = computed(() =>
    cn(
      'flex flex-col outline-none',
      this.isDisabled() && 'cursor-not-allowed opacity-50',
      this.class(),
    ),
  );

  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() ?? this.value();
  }

  activate(): void {
    if (this.isDisabled()) return;
    this.tree.selectNode(this.value());
  }

  getParent(): TreeNodeComponent | null {
    return this.parentNode;
  }

  getChildren(): TreeNodeComponent[] {
    return this.tree.childrenOf(this);
  }

  collapse(): void {
    if (this.isDisabled()) return;
    if (this.isExpanded()) this.tree.toggleExpand(this.value());
  }

  expand(): void {
    if (this.isDisabled()) return;
    if (!this.isExpanded()) this.tree.toggleExpand(this.value());
  }

  focus(): void {
    this.el.nativeElement.focus();
  }

  makeFocusable(): void {
    // CDK calls this during initial setup to mark an item as the roving tab stop
    // without moving DOM focus or emitting a focus-change event.
  }

  unfocus(): void {
    // 交給瀏覽器原生 blur/下一個 focus 目標處理，這裡不用主動做什麼
  }

  // 滑鼠點擊、Tab 進來等任何讓這個節點真的拿到 DOM focus 的情況，
  // 都要讓 TreeKeyManager 同步知道，方向鍵才能接著從這裡繼續動作。
  protected onFocus(): void {
    this.tree.focusNode(this);
  }
}
