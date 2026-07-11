import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideUpload } from '@lucide/angular';
import {
  DescriptionDirective,
  ErrorMessageComponent,
  FieldLabelDirective,
  FileDropzoneComponent,
  FileItemComponent,
  FileTriggerDirective,
  FileUploadComponent,
  SanringFieldComponent,
} from '@sanring/ui';
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
import { fileUploadPage, fileUploadPageExamples } from './file-upload.docs';

@Component({
  selector: 'app-file-upload-page',
  imports: [
    DescriptionDirective,
    ErrorMessageComponent,
    FieldLabelDirective,
    FileDropzoneComponent,
    FileItemComponent,
    FileTriggerDirective,
    FileUploadComponent,
    FormsModule,
    LucideUpload,
    ReactiveFormsModule,
    SanringFieldComponent,
    ComponentPageApiTableComponent,
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
          <div previewer class="w-[min(420px,100%)]">
            <sanring-file-upload [(ngModel)]="basicFiles">
              <sanring-file-dropzone class="cursor-pointer text-center">
                <button
                  sanringFileTrigger
                  type="button"
                  class="inline-flex items-center gap-1.5 font-medium underline underline-offset-2"
                >
                  <svg lucideUpload class="size-4"></svg>
                  {{ i18n.t('fileUpload.demo.browse') }}
                </button>
                <p class="text-sm text-muted-foreground">{{ i18n.t('fileUpload.demo.dropHint') }}</p>
              </sanring-file-dropzone>
            </sanring-file-upload>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="file-upload"
          manualSnippet="import { FileDropzoneComponent, FileTriggerDirective, FileUploadComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-trigger')">
            <app-component-page-code-previewer [code]="examples.trigger" language="angular-html">
              <div previewer class="flex flex-col items-center gap-2">
                <sanring-file-upload [(ngModel)]="triggerFiles">
                  <button
                    sanringFileTrigger
                    type="button"
                    class="rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)] px-3 py-2 text-sm"
                  >
                    {{ i18n.t('fileUpload.demo.chooseFile') }}
                  </button>
                  @if (triggerFiles.length) {
                    <sanring-file-item [file]="triggerFiles[0]" class="w-full" />
                  }
                </sanring-file-upload>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-multiple')">
            <app-component-page-code-previewer [code]="examples.multiple" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-file-upload multiple [(ngModel)]="multipleFiles">
                  <sanring-file-dropzone class="cursor-pointer text-center">
                    <button
                      sanringFileTrigger
                      type="button"
                      class="font-medium underline underline-offset-2"
                    >
                      {{ i18n.t('fileUpload.demo.browse') }}
                    </button>
                  </sanring-file-dropzone>
                </sanring-file-upload>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-validation')">
            <app-component-page-code-previewer [code]="examples.validation" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-file-upload
                  multiple
                  accept="image/*"
                  [maxSize]="1024 * 1024"
                  [(ngModel)]="validatedFiles"
                >
                  <sanring-file-dropzone class="cursor-pointer text-center">
                    <button
                      sanringFileTrigger
                      type="button"
                      class="font-medium underline underline-offset-2"
                    >
                      {{ i18n.t('fileUpload.demo.browse') }}
                    </button>
                  </sanring-file-dropzone>
                </sanring-file-upload>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-file-upload disabled>
                  <sanring-file-dropzone class="text-center">
                    <button sanringFileTrigger type="button" class="font-medium">
                      {{ i18n.t('fileUpload.demo.browse') }}
                    </button>
                  </sanring-file-dropzone>
                </sanring-file-upload>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-field')">
            <app-component-page-code-previewer [code]="examples.field" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-field>
                  <label sanringLabel>{{ i18n.t('fileUpload.demo.fieldLabel') }}</label>
                  <sanring-file-upload
                    accept=".pdf"
                    [maxSize]="2 * 1024 * 1024"
                    [formControl]="resumeControl"
                  >
                    <sanring-file-dropzone class="cursor-pointer text-center">
                      <button
                        sanringFileTrigger
                        type="button"
                        class="font-medium underline underline-offset-2"
                      >
                        {{ i18n.t('fileUpload.demo.browse') }}
                      </button>
                    </sanring-file-dropzone>
                  </sanring-file-upload>
                  <p sanringDescription>{{ i18n.t('fileUpload.demo.fieldHint') }}</p>
                  <sanring-error-message>{{ i18n.t('fileUpload.demo.fieldError') }}</sanring-error-message>
                </sanring-field>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class FileUploadPageComponent {
  protected readonly page = fileUploadPage;
  protected readonly examples = fileUploadPageExamples;
  protected readonly i18n = inject(I18nService);

  basicFiles: File[] = [];
  triggerFiles: File[] = [];
  multipleFiles: File[] = [];
  validatedFiles: File[] = [];

  protected readonly resumeControl = new FormControl<File[]>([], {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    this.resumeControl.markAsTouched();
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
