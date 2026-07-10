export * from './tree.component';
export * from './tree-group.component';
export * from './tree-node.component';
export * from './tree-trigger.directive';

// 便利陣列：imports: [SANRING_TREE_IMPORTS] 一行搞定
import { TreeComponent } from './tree.component';
import { TreeGroupComponent } from './tree-group.component';
import { TreeNodeComponent } from './tree-node.component';
import { TreeTriggerDirective } from './tree-trigger.directive';

export const SANRING_TREE_IMPORTS = [
  TreeComponent,
  TreeNodeComponent,
  TreeGroupComponent,
  TreeTriggerDirective,
];
