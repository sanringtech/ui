import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DescriptionDirective,
  ErrorMessageComponent,
  FieldLabelDirective,
  InputDirective,
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
import { fieldPage, fieldPageExamples } from './field.docs';

@Component({
  selector: 'app-field-page',
  imports: [
    ComponentPageApiTableComponent,
    DescriptionDirective,
    ErrorMessageComponent,
    FieldLabelDirective,
    InputDirective,
    ReactiveFormsModule,
    SanringFieldComponent,
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
          <div previewer class="w-[min(360px,100%)]">
            <sanring-field>
              <label sanringLabel>Email</label>
              <input sanringInput placeholder="name@sanring.dev" type="email" />
              <p sanringDescription>We'll only use this for account notifications.</p>
            </sanring-field>
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
          componentName="field"
          manualSnippet="import { DescriptionDirective, ErrorMessageComponent, FieldLabelDirective, SanringFieldComponent } from './components/ui/field';"
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
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-floating')">
            <app-component-page-code-previewer [code]="examples.floating" language="angular-html">
              <div previewer class="w-[min(360px,100%)]">
                <sanring-field floating>
                  <label sanringLabel>Email</label>
                  <input sanringInput placeholder="" type="email" />
                </sanring-field>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-validation')">
            <app-component-page-code-previewer [code]="examples.validation" language="angular-html">
              <div previewer class="w-[min(360px,100%)]">
                <sanring-field>
                  <label sanringLabel>Email</label>
                  <input sanringInput [formControl]="emailControl" placeholder="name@sanring.dev" />
                  <sanring-error-message>Email is required.</sanring-error-message>
                </sanring-field>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="w-[min(360px,100%)]">
                <sanring-field>
                  <label sanringLabel>Disabled email</label>
                  <input sanringInput disabled value="readonly@sanring.dev" />
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
export class FieldPageComponent {
  protected readonly page = fieldPage;
  protected readonly examples = fieldPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    this.emailControl.markAsTouched();
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
