import { Component, computed, inject, input } from '@angular/core';
import { TreeComponent } from './tree.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-tree-node',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'treeitem',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-expanded]': 'isExpanded()',
    '[class]': 'nodeClass()',
  },
})
export class TreeNodeComponent {
  readonly value = input.required<string>();
  readonly class = input<string | undefined>();

  protected tree = inject(TreeComponent);

  // 🌟 修正：把 protected 拿掉，讓外部的 Group 和 Trigger 可以讀取這些 Signal
  readonly isSelected = computed(() => this.tree.selectedValue() === this.value());
  readonly isExpanded = computed(() => this.tree.isExpanded(this.value()));

  protected readonly nodeClass = computed(() => cn('flex flex-col outline-none', this.class()));
}
