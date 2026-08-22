export const treeTranslations = {
  'tree.description':
    'Composable tree primitives for file explorers, nested navigation, and hierarchical data.',
  'tree.examples.basic.description':
    'Compose tree, node, trigger, and group primitives to build an expandable hierarchy.',
  'tree.demo.navigation': 'Nested navigation',
  'tree.demo.filesLabel': 'Project files',
  'tree.demo.navigationLabel': 'Application navigation',
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
  'tree.api.ariaLabel.description':
    'Accessible name for the tree when no visible element labels it.',
  'tree.api.ariaLabelledBy.description':
    'ID of a visible element that provides the accessible name for the tree.',
  'tree.api.value.description': 'Unique value for a tree node.',
  'tree.api.disabled.description':
    'Marks a node unavailable and prevents pointer or keyboard selection and expansion.',
  'tree.api.exportAs.description':
    'Exposes the node instance in a template reference variable — read `isExpanded()`/`isSelected()` directly instead of comparing value strings in the component class.',
  'tree.api.trigger.description':
    'Directive applied to the interactive element that toggles a node group.',
  'tree.api.class.description': 'Additional classes merged with the corresponding tree primitive.',
  'tree.accessibility.description':
    "Provide ariaLabel or ariaLabelledBy to name the role='tree' host. Each sanring-tree-node uses role='treeitem'; aria-selected, aria-expanded, and aria-disabled reflect its state. Leaf nodes omit aria-expanded. Roving tabindex keeps only the focused node in the tab sequence.",
  'tree.keyboard.description': 'Full keyboard navigation via CDK TreeKeyManager.',
  'tree.keyboard.arrowDown': 'Move focus to the next visible node.',
  'tree.keyboard.arrowUp': 'Move focus to the previous visible node.',
  'tree.keyboard.arrowRight':
    'Expand a collapsed branch; if already expanded, move focus to its first child.',
  'tree.keyboard.arrowLeft':
    'Collapse an expanded branch; if already collapsed, move focus to the parent node.',
  'tree.keyboard.enter': 'Select the focused node.',
  'tree.keyboard.tab':
    'Enter the tree (first Tab) or exit to the page (second Tab). The tree uses roving tabindex.',
  'tree.stateModel.description':
    'expandedValue and selectedValue are model() signals supporting two-way binding. Use [(expandedValue)] and [(selectedValue)] for reactive state in the host component. Not CVA.',
} as const;
