import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const treePage = {
  componentId: 'tree',
  titleKey: 'component.tree',
  descriptionKey: 'tree.description',
  registryDeps: ['utils'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'tree.examples.basic.description',
      level: 2,
    },
    {
      id: 'navigation',
      titleKey: 'tree.demo.navigation',
      descriptionKey: 'tree.examples.navigation.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'tree.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'tree.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'tree.composition.description',
      level: 2,
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'tree.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'tree.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'tree.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'tree.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'expandedValue',
      type: 'ModelSignal<string[]>',
      defaultValue: '[]',
      descriptionKey: 'tree.api.expandedValue.description',
    },
    {
      property: 'selectedValue',
      type: 'ModelSignal<string | null>',
      defaultValue: 'null',
      descriptionKey: 'tree.api.selectedValue.description',
    },
    {
      property: 'ariaLabel',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'tree.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'tree.api.ariaLabelledBy.description',
    },
    {
      property: 'value',
      type: 'string',
      defaultValue: 'required',
      descriptionKey: 'tree.api.value.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'tree.api.disabled.description',
    },
    {
      property: 'exportAs="sanringTreeNode"',
      type: 'TreeNodeComponent',
      defaultValue: '-',
      descriptionKey: 'tree.api.exportAs.description',
    },
    {
      property: 'sanringTreeTrigger',
      type: 'Directive',
      defaultValue: '-',
      descriptionKey: 'tree.api.trigger.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'tree.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: '↓', descriptionKey: 'tree.keyboard.arrowDown' },
    { keys: '↑', descriptionKey: 'tree.keyboard.arrowUp' },
    { keys: '→', descriptionKey: 'tree.keyboard.arrowRight' },
    { keys: '←', descriptionKey: 'tree.keyboard.arrowLeft' },
    { keys: 'Enter', descriptionKey: 'tree.keyboard.enter' },
    { keys: 'Tab', descriptionKey: 'tree.keyboard.tab' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const treePageExamples = {
  basic: `<sanring-tree
  ariaLabel="Project files"
  [expandedValue]="expandedValue()"
  (expandedValueChange)="expandedValue.set($event)"
  [selectedValue]="selectedValue()"
  (selectedValueChange)="selectedValue.set($event)"
  #tree
>
  <!--
    #srcNode="sanringTreeNode" exposes the node's own isExpanded()/isSelected(),
    so the template can react to its state directly instead of comparing value
    strings against expandedValue()/selectedValue() in the component class.
    tabindex="-1": the tree-node row is the tab stop (roving tabindex), not this button.
  -->
  <sanring-tree-node value="src" #srcNode="sanringTreeNode">
    <button type="button" tabindex="-1" sanringTreeTrigger>
      @if (srcNode.isExpanded()) {
        <svg lucideFolderOpen class="size-4"></svg>
      } @else {
        <svg lucideFolder class="size-4"></svg>
      }
      src
    </button>
    <sanring-tree-group>
      <sanring-tree-node value="src/app.component.ts">
        <button type="button" tabindex="-1" (click)="tree.selectNode('src/app.component.ts')">
          app.component.ts
        </button>
      </sanring-tree-node>
    </sanring-tree-group>
  </sanring-tree-node>
</sanring-tree>`,

  navigation: `<sanring-tree
  ariaLabel="Application navigation"
  [expandedValue]="expandedValue()"
  (expandedValueChange)="expandedValue.set($event)"
  [selectedValue]="selectedValue()"
  (selectedValueChange)="selectedValue.set($event)"
  #tree
>
  <sanring-tree-node value="dashboard">
    <button type="button" tabindex="-1" (click)="tree.selectNode('dashboard')">
      Dashboard
    </button>
  </sanring-tree-node>

  <sanring-tree-node value="reports" #reportsNode="sanringTreeNode">
    <button type="button" tabindex="-1" sanringTreeTrigger>
      <span [class.rotate-90]="reportsNode.isExpanded()">›</span>
      Reports
    </button>
    <sanring-tree-group>
      <sanring-tree-node value="reports/revenue">
        <button type="button" tabindex="-1" (click)="tree.selectNode('reports/revenue')">
          Revenue
        </button>
      </sanring-tree-node>
      <sanring-tree-node value="reports/customers">
        <button type="button" tabindex="-1" (click)="tree.selectNode('reports/customers')">
          Customers
        </button>
      </sanring-tree-node>
    </sanring-tree-group>
  </sanring-tree-node>

  <sanring-tree-node value="settings" #settingsNode="sanringTreeNode">
    <button type="button" tabindex="-1" sanringTreeTrigger>
      <span [class.rotate-90]="settingsNode.isExpanded()">›</span>
      Settings
    </button>
    <sanring-tree-group>
      <sanring-tree-node value="settings/profile">
        <button type="button" tabindex="-1" (click)="tree.selectNode('settings/profile')">
          Profile
        </button>
      </sanring-tree-node>
      <sanring-tree-node value="settings/team" disabled>
        <button type="button" tabindex="-1" (click)="tree.selectNode('settings/team')">
          Team
        </button>
      </sanring-tree-node>
    </sanring-tree-group>
  </sanring-tree-node>
</sanring-tree>`,

  usageImport: `import { Component, signal } from '@angular/core';
import { SANRING_TREE_IMPORTS } from './components/ui/tree';

@Component({
  imports: [SANRING_TREE_IMPORTS],
})
export class ExampleComponent {
  readonly expandedValue = signal<string[]>(['src']);
  readonly selectedValue = signal<string | null>('src/app.component.ts');
}`,

  usageIndividualImports: `import { Component } from '@angular/core';
import { TreeComponent, TreeNodeComponent, TreeGroupComponent, TreeTriggerDirective } from './components/ui/tree';

@Component({
  imports: [
    TreeComponent,
    TreeNodeComponent,
    TreeGroupComponent,
    TreeTriggerDirective,
  ],
})
export class ExampleComponent {}`,

  usageMain: `<sanring-tree
  ariaLabel="Component files"
  [expandedValue]="expandedValue()"
  (expandedValueChange)="expandedValue.set($event)"
  [selectedValue]="selectedValue()"
  (selectedValueChange)="selectedValue.set($event)"
  #tree
>
  <sanring-tree-node value="components">
    <button sanringTreeTrigger type="button" tabindex="-1">components</button>
    <sanring-tree-group>
      <sanring-tree-node value="button.ts">
        <button type="button" tabindex="-1" (click)="tree.selectNode('button.ts')">
          button.ts
        </button>
      </sanring-tree-node>
    </sanring-tree-group>
  </sanring-tree-node>
</sanring-tree>`,

  composition: `sanring-tree
└── sanring-tree-node
    ├── [sanringTreeTrigger]
    └── sanring-tree-group
        └── sanring-tree-node`,
} as const;
