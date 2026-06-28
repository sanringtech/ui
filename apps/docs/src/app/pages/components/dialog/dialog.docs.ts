import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const dialogPage = {
  componentId: 'dialog',
  titleKey: 'component.dialog',
  descriptionKey: 'dialog.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'dialog.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'dialog.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'dialog.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'dialog.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'dialog.examples.description',
      level: 2,
      children: [
        {
          id: 'example-custom-close',
          titleKey: 'dialog.demo.customClose',
          level: 3,
        },
        {
          id: 'example-no-close',
          titleKey: 'dialog.demo.noClose',
          level: 3,
        },
        {
          id: 'example-sticky-footer',
          titleKey: 'dialog.demo.stickyFooter',
          level: 3,
        },
        {
          id: 'example-scrollable',
          titleKey: 'dialog.demo.scrollable',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'dialog.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'class', type: 'string', defaultValue: "''", descriptionKey: 'dialog.api.class.description' },
    { property: 'showClose', type: 'boolean', defaultValue: 'true', descriptionKey: 'dialog.api.showClose.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const dialogPageExamples = {
  composition: `[sanringDialogTrigger]
sanring-dialog-content
├── sanring-dialog-header
│   ├── [sanringDialogTitle]
│   └── [sanringDialogDescription]
└── sanring-dialog-footer`,
  basic: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content>
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Edit profile</h2>
      <p sanringDialogDescription>Make changes to your profile here.</p>
    </sanring-dialog-header>
  </sanring-dialog-content>
</ng-template>`,
  usageImport: `import {
  DialogCloseDirective,
  DialogContentComponent,
  DialogDescriptionDirective,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTitleDirective,
  DialogTriggerDirective,
} from '@sanring/ui';`,
  usageMain: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content>
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Dialog title</h2>
      <p sanringDialogDescription>Dialog description</p>
    </sanring-dialog-header>
  </sanring-dialog-content>
</ng-template>`,
  customClose: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content [showClose]="false">
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Custom close button</h2>
      <p sanringDialogDescription>Close this dialog from an action button.</p>
    </sanring-dialog-header>

    <sanring-dialog-footer>
      <button sanringBtn sanringDialogClose type="button">Done</button>
    </sanring-dialog-footer>
  </sanring-dialog-content>
</ng-template>`,
  noClose: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content [showClose]="false">
    <sanring-dialog-header>
      <h2 sanringDialogTitle>No close button</h2>
      <p sanringDialogDescription>
        This dialog hides the built-in close control.
      </p>
    </sanring-dialog-header>
  </sanring-dialog-content>
</ng-template>`,
  stickyFooter: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content class="grid max-h-[80dvh] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0">
    <sanring-dialog-header class="p-6 pb-0">
      <h2 sanringDialogTitle>Sticky footer</h2>
      <p sanringDialogDescription>Actions stay visible while content scrolls.</p>
    </sanring-dialog-header>

    <div class="min-h-0 overflow-y-auto px-6 py-4">
      <p class="text-sm text-[var(--docs-muted)]">Long form content...</p>
    </div>

    <sanring-dialog-footer class="border-t border-[var(--docs-border)] p-6">
      <button sanringBtn sanringDialogClose type="button">Save changes</button>
    </sanring-dialog-footer>
  </sanring-dialog-content>
</ng-template>`,
  scrollable: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content class="max-h-[80dvh] overflow-y-auto border-0">
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Scrollable content</h2>
      <p sanringDialogDescription>Use scrolling for dense content.</p>
    </sanring-dialog-header>

    <div class="grid gap-3 text-sm text-[var(--docs-muted)]">
      <p>Dialog content...</p>
      <p>Dialog content...</p>
      <p>Dialog content...</p>
    </div>
  </sanring-dialog-content>
</ng-template>`,
} as const;
