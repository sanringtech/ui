import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const collapsiblePage = {
  componentId: 'collapsible',
  titleKey: 'component.collapsible',
  descriptionKey: 'collapsible.description',
  sections: [
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'collapsible.installation.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'collapsible.usage.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'collapsible.composition.description',
      level: 2,
    },
    {
      id: 'controlled-state',
      titleKey: 'collapsible.controlledState',
      descriptionKey: 'collapsible.controlledState.description',
      level: 2,
    },
    {
      id: 'examples',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-basic',
          titleKey: 'toc.basic',
          level: 3,
        },
        {
          id: 'example-settings-panel',
          titleKey: 'collapsible.demo.settingsPanel',
          level: 3,
        },
        {
          id: 'example-file-tree',
          titleKey: 'collapsible.demo.fileTree',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'collapsible.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'collapsible.api.class.description',
    },
    {
      property: 'open',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'collapsible.api.open.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'collapsible.api.disabled.description',
    },
    {
      property: 'toggle()',
      type: 'method',
      defaultValue: '-',
      descriptionKey: 'collapsible.api.toggle.description',
    },
    {
      property: 'openChange',
      type: 'OutputEmitterRef<boolean>',
      defaultValue: '-',
      descriptionKey: 'collapsible.api.openChange.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const collapsiblePageExamples = {
  usageImport: `import { Component } from '@angular/core';
import { ButtonDirective, SANRING_COLLAPSIBLE_IMPORTS } from '@sanring/ui';

@Component({
  imports: [ButtonDirective, SANRING_COLLAPSIBLE_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-collapsible>
  <button sanringCollapsibleTrigger type="button">
    Toggle details
  </button>

  <div sanringCollapsibleContent>
    Collapsible content
  </div>
</sanring-collapsible>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  ButtonDirective,
  CollapsibleComponent,
  CollapsibleContentDirective,
  CollapsibleTriggerDirective,
} from '@sanring/ui';

@Component({
  imports: [
    ButtonDirective,
    CollapsibleComponent,
    CollapsibleTriggerDirective,
    CollapsibleContentDirective,
  ],
})
export class ExampleComponent {}`,
  composition: `sanring-collapsible
├── [sanringCollapsibleTrigger]
└── [sanringCollapsibleContent]`,
  controlledState: `<button type="button" (click)="open = !open">
  Toggle externally
</button>

<sanring-collapsible [(open)]="open">
  <button sanringCollapsibleTrigger type="button">
    Advanced options
  </button>

  <div sanringCollapsibleContent>
    Controlled content
  </div>
</sanring-collapsible>`,
  basic: `<sanring-collapsible>
  <button sanringCollapsibleTrigger type="button">
    What changed this week?
  </button>

  <div sanringCollapsibleContent>
    We added audit exports, role presets, and quieter empty states.
  </div>
</sanring-collapsible>`,
  settingsPanel: `<sanring-collapsible [open]="true">
  <button sanringCollapsibleTrigger type="button">
    Workspace preferences
  </button>

  <div sanringCollapsibleContent>
    <label>
      <input type="checkbox" checked />
      Send weekly digest
    </label>
    <label>
      <input type="checkbox" />
      Require review before publish
    </label>
  </div>
</sanring-collapsible>`,
  fileTree: `<sanring-collapsible [open]="true">
  <button sanringCollapsibleTrigger type="button">
    src
  </button>

  <div sanringCollapsibleContent>
    <div>components</div>
    <div>lib</div>
    <div>main.ts</div>
  </div>
</sanring-collapsible>`,
} as const;
