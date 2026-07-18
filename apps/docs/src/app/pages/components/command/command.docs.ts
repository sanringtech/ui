import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const commandPage = {
  componentId: 'command',
  titleKey: 'component.command',
  descriptionKey: 'command.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'command.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'command.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'command.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'command.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-dialog', titleKey: 'command.demo.dialog', level: 3 },
        { id: 'example-shortcuts', titleKey: 'command.demo.shortcuts', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'command.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'value',
      type: 'string',
      defaultValue: 'required',
      descriptionKey: 'command.api.value.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'command.api.disabled.description',
    },
    {
      property: 'heading',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'command.api.heading.description',
    },
    {
      property: 'placeholder',
      type: 'string',
      defaultValue: "'Search...'",
      descriptionKey: 'command.api.placeholder.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'command.api.class.description',
    },
    {
      property: 'selected',
      type: 'OutputEmitterRef<string>',
      defaultValue: '-',
      descriptionKey: 'command.api.selected.description',
    },
    {
      property: 'valueChange',
      type: 'OutputEmitterRef<string>',
      defaultValue: '-',
      descriptionKey: 'command.api.valueChange.description',
    },
    {
      property: 'shortcutHint',
      type: 'Signal<string>',
      defaultValue: '-',
      descriptionKey: 'command.api.shortcutHint.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const commandPageExamples = {
  basic: `<sanring-command class="rounded-[var(--sanring-radius)] border">
  <sanring-command-input placeholder="Search commands..." />
  <sanring-command-list>
    <sanring-command-empty>No results found.</sanring-command-empty>

    <sanring-command-group heading="Suggestions">
      <sanring-command-item value="calendar">Calendar</sanring-command-item>
      <sanring-command-item value="emoji">Search Emoji</sanring-command-item>
      <sanring-command-item value="calculator">Calculator</sanring-command-item>
    </sanring-command-group>

    <sanring-command-group heading="Settings">
      <sanring-command-item value="profile">Profile</sanring-command-item>
      <sanring-command-item value="billing">Billing</sanring-command-item>
    </sanring-command-group>
  </sanring-command-list>
</sanring-command>`,

  usageImport: `import { Component } from '@angular/core';
import { SANRING_COMMAND_IMPORTS } from './components/ui/command';

@Component({
  imports: [SANRING_COMMAND_IMPORTS],
})
export class ExampleComponent {}`,

  usageIndividualImports: `import { Component } from '@angular/core';
import { CommandComponent, CommandInputComponent, CommandListComponent, CommandGroupComponent, CommandItemComponent, CommandEmptyComponent } from './components/ui/command';

@Component({
  imports: [
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandGroupComponent,
    CommandItemComponent,
    CommandEmptyComponent,
  ],
})
export class ExampleComponent {}`,

  usageMain: `<sanring-command (valueChange)="onCommand($event)">
  <sanring-command-input placeholder="Search..." />
  <sanring-command-list>
    <sanring-command-empty>No results found.</sanring-command-empty>
    @for (item of items; track item.value) {
      <sanring-command-item [value]="item.value">
        {{ item.label }}
      </sanring-command-item>
    }
  </sanring-command-list>
</sanring-command>`,

  composition: `sanring-command
├── sanring-command-input
└── sanring-command-list
    ├── sanring-command-empty
    └── sanring-command-group (optional)
        └── sanring-command-item
            └── sanring-command-shortcut (optional)

sanring-command-dialog
└── sanring-command (as above)`,

  dialog: `<button sanringBtn (click)="commandDialog.open()">
  Search...
  <span class="ml-2 text-xs text-[var(--sanring-muted)]">{{ commandDialog.shortcutHint() }}</span>
</button>

<sanring-command-dialog #commandDialog>
  <sanring-command>
    <sanring-command-input placeholder="Search commands..." />
    <sanring-command-list>
      <sanring-command-empty>No results found.</sanring-command-empty>
      <sanring-command-group heading="Suggestions">
        <sanring-command-item value="calendar">Calendar</sanring-command-item>
        <sanring-command-item value="emoji">Search Emoji</sanring-command-item>
      </sanring-command-group>
    </sanring-command-list>
  </sanring-command>
</sanring-command-dialog>`,

  shortcuts: `<sanring-command-group heading="Settings">
  <sanring-command-item value="profile">
    Profile
    <sanring-command-shortcut>⌘P</sanring-command-shortcut>
  </sanring-command-item>
  <sanring-command-item value="billing">
    Billing
    <sanring-command-shortcut>⌘B</sanring-command-shortcut>
  </sanring-command-item>
  <sanring-command-item value="archive" disabled>
    Archive
    <sanring-command-shortcut>⌘⇧A</sanring-command-shortcut>
  </sanring-command-item>
</sanring-command-group>`,
} as const;
