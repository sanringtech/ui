import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const resizablePage = {
  componentId: 'resizable',
  titleKey: 'component.resizable',
  descriptionKey: 'resizable.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'resizable.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'resizable.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'resizable.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-vertical',
          titleKey: 'resizable.demo.vertical',
          level: 3,
        },
        {
          id: 'example-controlled',
          titleKey: 'resizable.demo.controlled',
          descriptionKey: 'resizable.examples.controlled.description',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'resizable.demo.disabled',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'resizable.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'sanring-resizable-group [direction]',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      descriptionKey: 'resizable.api.direction.description',
    },
    {
      property: 'sanring-resizable-group [(sizes)]',
      type: 'number[]',
      defaultValue: '[]',
      descriptionKey: 'resizable.api.sizes.description',
    },
    {
      property: 'sanring-resizable-group [disabled]',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'resizable.api.disabled.description',
    },
    {
      property: 'sanring-resizable-panel [defaultSize]',
      type: 'number',
      defaultValue: 'auto',
      descriptionKey: 'resizable.api.defaultSize.description',
    },
    {
      property: 'sanring-resizable-panel [minSize]',
      type: 'number',
      defaultValue: '0',
      descriptionKey: 'resizable.api.minSize.description',
    },
    {
      property: 'sanring-resizable-panel [maxSize]',
      type: 'number',
      defaultValue: '100',
      descriptionKey: 'resizable.api.maxSize.description',
    },
    {
      property: 'sanring-resizable-handle [withHandle]',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'resizable.api.withHandle.description',
    },
    {
      property: 'sanring-resizable-handle [keyboardStep]',
      type: 'number',
      defaultValue: '5',
      descriptionKey: 'resizable.api.keyboardStep.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const resizablePageExamples = {
  usageImport: `import {
  ResizableGroupComponent,
  ResizableHandleComponent,
  ResizablePanelComponent,
} from '@sanring/ui';`,
  usageMain: `<div class="h-64">
  <sanring-resizable-group class="rounded border" [(sizes)]="sizes">
    <sanring-resizable-panel [defaultSize]="30" [minSize]="20">
      Sidebar
    </sanring-resizable-panel>
    <sanring-resizable-handle [withHandle]="true" />
    <sanring-resizable-panel [defaultSize]="70" [minSize]="30">
      Content
    </sanring-resizable-panel>
  </sanring-resizable-group>
</div>`,
  basic: `<div class="h-64">
  <sanring-resizable-group class="rounded border">
    <sanring-resizable-panel [defaultSize]="28" [minSize]="18">
      Navigation
    </sanring-resizable-panel>
    <sanring-resizable-handle [withHandle]="true" />
    <sanring-resizable-panel [defaultSize]="72" [minSize]="35">
      Editor
    </sanring-resizable-panel>
  </sanring-resizable-group>
</div>`,
  vertical: `<div class="h-72">
  <sanring-resizable-group direction="vertical" class="rounded border">
    <sanring-resizable-panel [defaultSize]="62" [minSize]="35">
      Preview
    </sanring-resizable-panel>
    <sanring-resizable-handle [withHandle]="true" />
    <sanring-resizable-panel [defaultSize]="38" [minSize]="20">
      Console
    </sanring-resizable-panel>
  </sanring-resizable-group>
</div>`,
  controlled: `<div class="h-64">
  <sanring-resizable-group class="rounded border" [(sizes)]="layoutSizes">
    <sanring-resizable-panel [minSize]="20">Files</sanring-resizable-panel>
    <sanring-resizable-handle [withHandle]="true" />
    <sanring-resizable-panel [minSize]="30">Canvas</sanring-resizable-panel>
    <sanring-resizable-handle [withHandle]="true" />
    <sanring-resizable-panel [minSize]="20">Inspector</sanring-resizable-panel>
  </sanring-resizable-group>
</div>

<button type="button" (click)="layoutSizes = [25, 50, 25]">
  Reset layout
</button>`,
  disabled: `<div class="h-48">
  <sanring-resizable-group [disabled]="true" class="rounded border" [sizes]="[35, 65]">
    <sanring-resizable-panel>Locked panel</sanring-resizable-panel>
    <sanring-resizable-handle [withHandle]="true" />
    <sanring-resizable-panel>Locked content</sanring-resizable-panel>
  </sanring-resizable-group>
</div>`,
} as const;
