import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

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
      level: 2,
      children: [
        {
          id: 'example-custom-close',
          titleKey: 'dialog.demo.customClose',
          level: 3,
        },
        {
          id: 'example-media',
          titleKey: 'dialog.demo.media',
          level: 3,
        },
        {
          id: 'example-config-result',
          titleKey: 'dialog.demo.configResult',
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
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'dialog.api.class.description',
    },
    {
      property: 'showClose',
      type: 'boolean',
      defaultValue: 'true',
      descriptionKey: 'dialog.api.showClose.description',
    },
    {
      property: 'sanringDialogConfig',
      type: 'DialogConfig',
      defaultValue: 'undefined',
      descriptionKey: 'dialog.api.triggerConfig.description',
    },
    {
      property: 'sanringDialogClose',
      type: 'unknown',
      defaultValue: 'undefined',
      descriptionKey: 'dialog.api.closeResult.description',
    },
    {
      property: 'sanring-dialog-media.class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'dialog.api.mediaClass.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const dialogPageExamples = {
  composition: `[sanringDialogTrigger]
sanring-dialog-content
├── sanring-dialog-header
│   ├── sanring-dialog-media
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
  usageImport: `import { Component } from '@angular/core';
import { ButtonDirective, SANRING_DIALOG_IMPORTS } from '@sanring/ui';

@Component({
  imports: [ButtonDirective, SANRING_DIALOG_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content>
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Dialog title</h2>
      <p sanringDialogDescription>Dialog description</p>
    </sanring-dialog-header>
  </sanring-dialog-content>
</ng-template>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  ButtonDirective,
  DialogCloseDirective,
  DialogContentComponent,
  DialogDescriptionDirective,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogMediaComponent,
  DialogTitleDirective,
  DialogTriggerDirective,
} from '@sanring/ui';

@Component({
  imports: [
    ButtonDirective,
    DialogTriggerDirective,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogMediaComponent,
    DialogTitleDirective,
    DialogDescriptionDirective,
    DialogFooterComponent,
    DialogCloseDirective,
  ],
})
export class ExampleComponent {}`,
  customClose: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content [showClose]="false">
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Custom close button</h2>
      <p sanringDialogDescription>Close this dialog from an action button.</p>
    </sanring-dialog-header>

    <sanring-dialog-footer>
      <button sanringBtn [sanringDialogClose]="'done'" type="button">Done</button>
    </sanring-dialog-footer>
  </sanring-dialog-content>
</ng-template>`,
  media: `<button sanringBtn [sanringDialogTrigger]="dialog">Open dialog</button>

<ng-template #dialog>
  <sanring-dialog-content>
    <sanring-dialog-header>
      <sanring-dialog-media>
        <svg><!-- icon --></svg>
      </sanring-dialog-media>
      <h2 sanringDialogTitle>Share project?</h2>
      <p sanringDialogDescription>
        Anyone with the link will be able to view this project.
      </p>
    </sanring-dialog-header>
  </sanring-dialog-content>
</ng-template>`,
  configResult: `<button
  sanringBtn
  [sanringDialogTrigger]="dialog"
  [sanringDialogConfig]="{ disableClose: true }"
>
  Review changes
</button>

<ng-template #dialog>
  <sanring-dialog-content [showClose]="false">
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Review changes</h2>
      <p sanringDialogDescription>
        This dialog cannot be dismissed by Escape or backdrop.
      </p>
    </sanring-dialog-header>

    <sanring-dialog-footer>
      <button sanringBtn variant="outline" [sanringDialogClose]="'cancel'" type="button">
        Cancel
      </button>
      <button sanringBtn [sanringDialogClose]="'confirm'" type="button">
        Confirm
      </button>
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
