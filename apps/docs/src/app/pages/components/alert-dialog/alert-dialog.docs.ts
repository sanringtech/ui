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
  composition: `AlertDialogService.open()
sanring-alert-dialog-content
├── [sanringDialogTitle]
├── [sanringDialogDescription]
├── [sanringAlertDialogCancel]
└── [sanringAlertDialogAction]`,
  basic: `<button sanringBtn (click)="openBasicAlert()" type="button">Delete account</button>

<ng-template #alertDialog>
  <sanring-alert-dialog-content>
    <h2 sanringDialogTitle>Delete account?</h2>
    <p sanringDialogDescription>This action cannot be undone.</p>
    <div class="flex justify-end gap-2">
      <button sanringBtn variant="outline" sanringAlertDialogCancel type="button">Cancel</button>
      <button sanringBtn variant="destructive" sanringAlertDialogAction type="button">Delete</button>
    </div>
  </sanring-alert-dialog-content>
</ng-template>`,
  usageImport: `import { Component, ViewChild, TemplateRef, inject } from '@angular/core';
import { ButtonDirective, SANRING_ALERT_DIALOG_IMPORTS, AlertDialogService } from '@sanring/ui';

@Component({
  imports: [ButtonDirective, SANRING_ALERT_DIALOG_IMPORTS],
})
export class ExampleComponent {
  private readonly alertDialogService = inject(AlertDialogService);

  @ViewChild('alertDialog') alertDialog!: TemplateRef<unknown>;

  openBasicAlert() {
    const ref = this.alertDialogService.open<boolean>(this.alertDialog);
    ref.closed.subscribe((confirmed) => {
      if (confirmed) {
        // perform the destructive action
      }
    });
  }
}`,
  usageMain: `<button sanringBtn (click)="openBasicAlert()" type="button">Delete account</button>

<ng-template #alertDialog>
  <sanring-alert-dialog-content>
    <h2 sanringDialogTitle>Delete account?</h2>
    <p sanringDialogDescription>This action cannot be undone.</p>
    <button sanringBtn sanringAlertDialogCancel type="button">Cancel</button>
    <button sanringBtn sanringAlertDialogAction type="button">Delete</button>
  </sanring-alert-dialog-content>
</ng-template>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  ButtonDirective,
  AlertDialogService,
  AlertDialogContentComponent,
  AlertDialogActionDirective,
  AlertDialogCancelDirective,
  DialogTitleDirective,
  DialogDescriptionDirective,
} from '@sanring/ui';

@Component({
  imports: [
    ButtonDirective,
    AlertDialogContentComponent,
    DialogTitleDirective,
    DialogDescriptionDirective,
    AlertDialogActionDirective,
    AlertDialogCancelDirective,
  ],
})
export class ExampleComponent {}`,
  customResult: `<button sanringBtn (click)="openCustomResultAlert()" type="button">Remove item</button>

<ng-template #customResultAlertDialog>
  <sanring-alert-dialog-content>
    <h2 sanringDialogTitle>Remove item?</h2>
    <p sanringDialogDescription>This item will be removed from your list.</p>
    <button sanringBtn [sanringAlertDialogCancel]="'dismissed'" type="button">Cancel</button>
    <button sanringBtn [sanringAlertDialogAction]="'item-42'" type="button">Remove</button>
  </sanring-alert-dialog-content>
</ng-template>`,
} as const;
