import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { AlertDialogService, ButtonDirective, SANRING_ALERT_DIALOG_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { alertDialogPage, alertDialogPageExamples } from './alert-dialog.docs';

@Component({
  selector: 'app-alert-dialog-page',
  imports: [
    ComponentPageApiTableComponent,
    ButtonDirective,
    SANRING_ALERT_DIALOG_IMPORTS,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex justify-center">
            <button sanringBtn (click)="openBasicAlert()" type="button">
              {{ i18n.t('alertDialog.demo.open') }}
            </button>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports
            [code]="examples.usageImport"
            [individualCode]="examples.usageIndividualImports"
          />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="alert-dialog"
          manualSnippet="import { SANRING_ALERT_DIALOG_IMPORTS } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <div
          class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div>
          <app-component-page-section [section]="section('example-custom-result')">
            <app-component-page-code-previewer
              [code]="examples.customResult"
              language="angular-html"
            >
              <div previewer class="flex justify-center">
                <button sanringBtn (click)="openCustomResultAlert()" type="button">
                  {{ i18n.t('alertDialog.demo.customResultTitle') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>

      <ng-template #alertDialog>
        <sanring-alert-dialog-content>
          <h2 sanringDialogTitle>{{ i18n.t('alertDialog.demo.open') }}?</h2>
          <p sanringDialogDescription>This action cannot be undone.</p>
          <div class="mt-4 flex justify-end gap-2">
            <button sanringBtn variant="outline" sanringAlertDialogCancel type="button">
              {{ i18n.t('alertDialog.demo.cancel') }}
            </button>
            <button sanringBtn variant="destructive" sanringAlertDialogAction type="button">
              {{ i18n.t('alertDialog.demo.action') }}
            </button>
          </div>
        </sanring-alert-dialog-content>
      </ng-template>

      <ng-template #customResultAlertDialog>
        <sanring-alert-dialog-content>
          <h2 sanringDialogTitle>{{ i18n.t('alertDialog.demo.customResultTitle') }}?</h2>
          <p sanringDialogDescription>This item will be removed from your list.</p>
          <div class="mt-4 flex justify-end gap-2">
            <button
              sanringBtn
              variant="outline"
              [sanringAlertDialogCancel]="'dismissed'"
              type="button"
            >
              {{ i18n.t('alertDialog.demo.cancel') }}
            </button>
            <button
              sanringBtn
              variant="destructive"
              [sanringAlertDialogAction]="'item-42'"
              type="button"
            >
              {{ i18n.t('alertDialog.demo.action') }}
            </button>
          </div>
        </sanring-alert-dialog-content>
      </ng-template>
    </app-component-page>
  `,
})
export class AlertDialogPageComponent {
  protected readonly page = alertDialogPage;
  protected readonly examples = alertDialogPageExamples;
  protected readonly i18n = inject(I18nService);

  private readonly alertDialogService = inject(AlertDialogService);

  @ViewChild('alertDialog') private readonly alertDialog!: TemplateRef<unknown>;
  @ViewChild('customResultAlertDialog')
  private readonly customResultAlertDialog!: TemplateRef<unknown>;

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected openBasicAlert() {
    this.alertDialogService.open<boolean>(this.alertDialog);
  }

  protected openCustomResultAlert() {
    this.alertDialogService.open<string>(this.customResultAlertDialog);
  }
}
