import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const alertDialogPage = {
  componentId: 'alert-dialog',
  titleKey: 'component.alertDialog',
  descriptionKey: 'alertDialog.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'alertDialog.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'alertDialog.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'alertDialog.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'alertDialog.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-media',
          titleKey: 'alertDialog.demo.mediaTitle',
          level: 3,
        },
        {
          id: 'example-custom-result',
          titleKey: 'alertDialog.demo.customResult',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'alertDialog.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'sanringAlertDialogTrigger',
      type: 'TemplateRef<unknown>',
      defaultValue: 'required',
      descriptionKey: 'alertDialog.api.trigger.description',
    },
    {
      property: 'sanringAlertDialogConfig',
      type: 'DialogConfig',
      defaultValue: 'undefined',
      descriptionKey: 'alertDialog.api.triggerConfig.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'alertDialog.api.class.description',
    },
    {
      property: 'showClose',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'alertDialog.api.showClose.description',
    },
    {
      property: 'sanringAlertDialogAction',
      type: 'unknown',
      defaultValue: 'true',
      descriptionKey: 'alertDialog.api.action.description',
    },
    {
      property: 'sanringAlertDialogCancel',
      type: 'unknown',
      defaultValue: 'false',
      descriptionKey: 'alertDialog.api.cancel.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const alertDialogPageExamples = {
  composition: `[sanringAlertDialogTrigger]
sanring-alert-dialog-content
├── sanring-dialog-header
│   ├── sanring-dialog-media (optional)
│   ├── [sanringDialogTitle]
│   └── [sanringDialogDescription]
└── sanring-dialog-footer
    ├── [sanringAlertDialogCancel]
    └── [sanringAlertDialogAction]`,
  basic: `<button sanringBtn [sanringAlertDialogTrigger]="alertDialog" type="button">
  Delete account
</button>

<ng-template #alertDialog>
  <sanring-alert-dialog-content>
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Delete account?</h2>
      <p sanringDialogDescription>This action cannot be undone.</p>
    </sanring-dialog-header>
    <sanring-dialog-footer>
      <button sanringBtn variant="outline" sanringAlertDialogCancel type="button">Cancel</button>
      <button sanringBtn variant="destructive" sanringAlertDialogAction type="button">Delete</button>
    </sanring-dialog-footer>
  </sanring-alert-dialog-content>
</ng-template>`,
  usageImport: `import { Component } from '@angular/core';
import { ButtonDirective, SANRING_ALERT_DIALOG_IMPORTS } from '@sanring/ui';

@Component({
  imports: [ButtonDirective, SANRING_ALERT_DIALOG_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<button sanringBtn [sanringAlertDialogTrigger]="alertDialog" type="button">
  Delete account
</button>

<ng-template #alertDialog>
  <sanring-alert-dialog-content>
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Delete account?</h2>
      <p sanringDialogDescription>This action cannot be undone.</p>
    </sanring-dialog-header>
    <sanring-dialog-footer>
      <button sanringBtn sanringAlertDialogCancel type="button">Cancel</button>
      <button sanringBtn sanringAlertDialogAction type="button">Delete</button>
    </sanring-dialog-footer>
  </sanring-alert-dialog-content>
</ng-template>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  ButtonDirective,
  AlertDialogTriggerDirective,
  AlertDialogContentComponent,
  DialogHeaderComponent,
  DialogTitleDirective,
  DialogDescriptionDirective,
  DialogFooterComponent,
  AlertDialogActionDirective,
  AlertDialogCancelDirective,
} from '@sanring/ui';

@Component({
  imports: [
    ButtonDirective,
    AlertDialogTriggerDirective,
    AlertDialogContentComponent,
    DialogHeaderComponent,
    DialogTitleDirective,
    DialogDescriptionDirective,
    DialogFooterComponent,
    AlertDialogActionDirective,
    AlertDialogCancelDirective,
  ],
})
export class ExampleComponent {}`,
  media: `<button sanringBtn variant="outline" [sanringAlertDialogTrigger]="mediaDialog" type="button">
  Share project
</button>

<ng-template #mediaDialog>
  <sanring-alert-dialog-content>
    <sanring-dialog-header>
      <sanring-dialog-media>
        <svg lucideShare2></svg>
      </sanring-dialog-media>
      <h2 sanringDialogTitle>Share this project?</h2>
      <p sanringDialogDescription>
        Anyone with the link will be able to view and edit this project.
      </p>
    </sanring-dialog-header>
    <sanring-dialog-footer>
      <button sanringBtn variant="outline" sanringAlertDialogCancel type="button">Cancel</button>
      <button sanringBtn sanringAlertDialogAction type="button">Share</button>
    </sanring-dialog-footer>
  </sanring-alert-dialog-content>
</ng-template>`,
  customResult: `<button sanringBtn (click)="openCustomResultAlert()" type="button">Remove item</button>

<ng-template #customResultAlertDialog>
  <sanring-alert-dialog-content>
    <sanring-dialog-header>
      <h2 sanringDialogTitle>Remove item?</h2>
      <p sanringDialogDescription>This item will be removed from your list.</p>
    </sanring-dialog-header>
    <sanring-dialog-footer>
      <button sanringBtn [sanringAlertDialogCancel]="'dismissed'" type="button">Cancel</button>
      <button sanringBtn [sanringAlertDialogAction]="'item-42'" type="button">Remove</button>
    </sanring-dialog-footer>
  </sanring-alert-dialog-content>
</ng-template>`,
} as const;
