import {
  ComponentPageApiRow,
  ComponentPageDefinition,
  ComponentPageKeyboardRow,
} from '../../../docs-schema/component-page.types';

export const contextMenuPage = {
  componentId: 'context-menu',
  titleKey: 'component.contextMenu',
  descriptionKey: 'contextMenu.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'contextMenu.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'contextMenu.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'contextMenu.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'contextMenu.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-checkbox',
          titleKey: 'contextMenu.demo.checkbox',
          level: 3,
        },
        {
          id: 'example-radio',
          titleKey: 'contextMenu.demo.radio',
          level: 3,
        },
        {
          id: 'example-submenu',
          titleKey: 'contextMenu.demo.submenu',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'contextMenu.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'contextMenu.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'contextMenu.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'contextMenu.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'ContextMenuComponent.itemSelected',
      type: 'Output<unknown>',
      defaultValue: '-',
      descriptionKey: 'contextMenu.api.itemSelected.description',
    },
    {
      property: 'ContextMenuItemComponent.value',
      type: 'unknown',
      defaultValue: 'required',
      descriptionKey: 'contextMenu.api.value.description',
    },
    {
      property: 'ContextMenuItemComponent.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'contextMenu.api.disabled.description',
    },
    {
      property: 'ContextMenuItemComponent.variant',
      type: "'default' | 'destructive'",
      defaultValue: "'default'",
      descriptionKey: 'contextMenu.api.variant.description',
    },
    {
      property: 'ContextMenuCheckboxItemComponent.checked',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'contextMenu.api.checked.description',
    },
    {
      property: 'ContextMenuRadioGroupComponent.value',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'contextMenu.api.radioValue.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'contextMenu.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: '↑ / ↓', descriptionKey: 'contextMenu.keyboard.navigateItems' },
    { keys: 'Enter', descriptionKey: 'contextMenu.keyboard.enter' },
    { keys: 'Escape', descriptionKey: 'contextMenu.keyboard.escape' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const contextMenuPageExamples = {
  composition: `[sanringContextMenuTrigger]
sanring-context-menu-content
├── sanring-context-menu-label
├── sanring-context-menu-item
│   └── sanring-context-menu-shortcut
├── sanring-context-menu-checkbox-item
├── sanring-context-menu-radio-group
│   └── sanring-context-menu-radio-item
├── sanring-context-menu-separator
└── sanring-context-menu-sub
    ├── sanring-context-menu-sub-trigger
    └── sanring-context-menu-sub-content
        └── sanring-context-menu-item`,
  basic: `<sanring-context-menu (itemSelected)="onBasicAction($event)">
  <div
    sanringContextMenuTrigger
    class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
  >
    Right click here
  </div>

  <sanring-context-menu-content class="w-56">
    <sanring-context-menu-label>Actions</sanring-context-menu-label>
    <sanring-context-menu-item value="back">
      Back
      <sanring-context-menu-shortcut>⌘[</sanring-context-menu-shortcut>
    </sanring-context-menu-item>
    <sanring-context-menu-item value="forward" disabled>
      Forward
      <sanring-context-menu-shortcut>⌘]</sanring-context-menu-shortcut>
    </sanring-context-menu-item>
    <sanring-context-menu-item value="reload">
      Reload
      <sanring-context-menu-shortcut>⌘R</sanring-context-menu-shortcut>
    </sanring-context-menu-item>
    <sanring-context-menu-separator />
    <sanring-context-menu-item value="delete" variant="destructive">Delete</sanring-context-menu-item>
  </sanring-context-menu-content>
</sanring-context-menu>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_CONTEXT_MENU_IMPORTS } from './components/ui/context-menu';

@Component({
  imports: [SANRING_CONTEXT_MENU_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-context-menu (itemSelected)="onAction($event)">
  <div sanringContextMenuTrigger class="h-40 w-full rounded-[var(--sanring-radius-sm)] border">
    Right click here
  </div>

  <sanring-context-menu-content>
    <sanring-context-menu-item value="profile">Profile</sanring-context-menu-item>
    <sanring-context-menu-item value="settings">Settings</sanring-context-menu-item>
  </sanring-context-menu-content>
</sanring-context-menu>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  ContextMenuComponent,
  ContextMenuContentComponent,
  ContextMenuItemComponent,
  ContextMenuTriggerDirective,
} from './components/ui/context-menu';

@Component({
  imports: [
    ContextMenuComponent,
    ContextMenuTriggerDirective,
    ContextMenuContentComponent,
    ContextMenuItemComponent,
  ],
})
export class ExampleComponent {}`,
  checkbox: `<sanring-context-menu>
  <div
    sanringContextMenuTrigger
    class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
  >
    Right click here
  </div>

  <sanring-context-menu-content class="w-56">
    <sanring-context-menu-label>Panels</sanring-context-menu-label>
    <sanring-context-menu-checkbox-item [(checked)]="showStatusBar">
      Status bar
    </sanring-context-menu-checkbox-item>
    <sanring-context-menu-checkbox-item [(checked)]="showActivityBar">
      Activity bar
    </sanring-context-menu-checkbox-item>
  </sanring-context-menu-content>
</sanring-context-menu>`,
  radio: `<sanring-context-menu>
  <div
    sanringContextMenuTrigger
    class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
  >
    Right click here
  </div>

  <sanring-context-menu-content class="w-56">
    <sanring-context-menu-label>Density</sanring-context-menu-label>
    <sanring-context-menu-radio-group [(value)]="density">
      <sanring-context-menu-radio-item value="compact">Compact</sanring-context-menu-radio-item>
      <sanring-context-menu-radio-item value="comfortable">
        Comfortable
      </sanring-context-menu-radio-item>
    </sanring-context-menu-radio-group>
  </sanring-context-menu-content>
</sanring-context-menu>`,
  submenu: `<sanring-context-menu (itemSelected)="onFileAction($event)">
  <div
    sanringContextMenuTrigger
    class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
  >
    Right click here
  </div>

  <sanring-context-menu-content class="w-52">
    <sanring-context-menu-item value="save-page">Save Page As...</sanring-context-menu-item>
    <sanring-context-menu-sub>
      <sanring-context-menu-sub-trigger>More Tools</sanring-context-menu-sub-trigger>
      <sanring-context-menu-sub-content class="w-48">
        <sanring-context-menu-item value="developer-tools">Developer Tools</sanring-context-menu-item>
        <sanring-context-menu-item value="task-manager">Task Manager</sanring-context-menu-item>
        <sanring-context-menu-separator />
        <sanring-context-menu-item value="clear-cache">Clear Cache</sanring-context-menu-item>
      </sanring-context-menu-sub-content>
    </sanring-context-menu-sub>
    <sanring-context-menu-separator />
    <sanring-context-menu-item value="delete" variant="destructive">Delete</sanring-context-menu-item>
  </sanring-context-menu-content>
</sanring-context-menu>`,
} as const;
