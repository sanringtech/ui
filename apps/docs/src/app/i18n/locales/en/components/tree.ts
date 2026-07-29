export const treeTranslations = {
  'tree.description':
    'Composable tree primitives for file explorers, nested navigation, and hierarchical data.',
  'tree.examples.basic.description':
    'Compose tree, node, trigger, and group primitives to build an expandable hierarchy.',
  'tree.demo.navigation': 'Nested navigation',
  'tree.examples.navigation.description':
    'Use the tree primitives for sidebar navigation, with group expansion and the current page selection controlled by external signals.',
  'tree.usage.description':
    'Import the tree primitives and control expanded and selected values with signals.',
  'tree.installation.description':
    'Add the component with the CLI, then import the tree primitives into the standalone component that renders the hierarchy.',
  'tree.composition.description':
    'Tree separates the root state container, node semantics, expandable group, and trigger interaction.',
  'tree.api.description': 'Inputs, models, and directives supported by the tree primitives.',
  'tree.api.expandedValue.description': 'Expanded node values controlled by the tree root.',
  'tree.api.selectedValue.description':
    'Currently selected node value controlled by the tree root.',
  'tree.api.value.description': 'Unique value for a tree node.',
  'tree.api.exportAs.description':
    'Exposes the node instance in a template reference variable — read `isExpanded()`/`isSelected()` directly instead of comparing value strings in the component class.',
  'tree.api.trigger.description':
    'Directive applied to the interactive element that toggles a node group.',
  'tree.api.class.description': 'Additional classes merged with the corresponding tree primitive.',

} as const;
