import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ErrorMessageComponent,
  LabelDirective,
  SANRING_RADIO_IMPORTS,
  RadioOrientation,
  RadioValue,
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
import { radioGroupApiRows, radioItemApiRows, radioPage, radioPageExamples } from './radio.docs';

@Component({
  selector: 'app-radio-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    ErrorMessageComponent,
    SANRING_RADIO_IMPORTS,
    SanringFieldComponent,
    LabelDirective,
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
          <div previewer class="flex items-center justify-center">
            <sanring-radio-group [(ngModel)]="basicValue">
              <sanring-radio-item value="option1" />
              <sanring-radio-item value="option2" />
              <sanring-radio-item value="option3" />
            </sanring-radio-group>
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
          componentName="radio"
          manualSnippet="import { SANRING_RADIO_IMPORTS } from './components/ui/radio';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-with-label')">
            <app-component-page-code-previewer [code]="examples.withLabel" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <sanring-radio-group [(ngModel)]="labeledValue">
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="r-default" value="default" />
                    <label sanringLabel for="r-default">Default</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="r-comfortable" value="comfortable" />
                    <label sanringLabel for="r-comfortable">Comfortable</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="r-compact" value="compact" />
                    <label sanringLabel for="r-compact">Compact</label>
                  </div>
                </sanring-radio-group>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <sanring-radio-group
                  [(ngModel)]="horizontalValue"
                  [orientation]="RadioOrientation.Horizontal"
                >
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="h-left" value="left" />
                    <label sanringLabel for="h-left">Left</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="h-center" value="center" />
                    <label sanringLabel for="h-center">Center</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="h-right" value="right" />
                    <label sanringLabel for="h-right">Right</label>
                  </div>
                </sanring-radio-group>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                <sanring-radio-group [(ngModel)]="disabledGroupValue" disabled>
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="dg1" value="option1" />
                    <label sanringLabel for="dg1">Option 1</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="dg2" value="option2" />
                    <label sanringLabel for="dg2">Option 2</label>
                  </div>
                </sanring-radio-group>

                <sanring-radio-group [(ngModel)]="disabledItemValue">
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="di1" value="option1" />
                    <label sanringLabel for="di1">Option 1</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <sanring-radio-item id="di2" value="option2" disabled />
                    <label sanringLabel for="di2">Option 2 (disabled)</label>
                  </div>
                </sanring-radio-group>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-field')">
            <app-component-page-code-previewer [code]="examples.field" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <sanring-field>
                  <sanring-radio-group [formControl]="planControl">
                    <div class="flex items-center gap-2">
                      <sanring-radio-item id="plan-free" value="free" />
                      <label for="plan-free">{{ i18n.t('radio.demo.planFree') }}</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <sanring-radio-item id="plan-pro" value="pro" />
                      <label for="plan-pro">{{ i18n.t('radio.demo.planPro') }}</label>
                    </div>
                  </sanring-radio-group>
                  <sanring-error-message>{{ i18n.t('radio.demo.fieldError') }}</sanring-error-message>
                </sanring-field>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api-group')">
        <app-component-page-api-table [rows]="groupApiRows" />
      </app-component-page-section>

      <app-component-page-section [section]="section('api-item')">
        <app-component-page-api-table [rows]="itemApiRows" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class RadioPageComponent {
  protected readonly page = radioPage;
  protected readonly examples = radioPageExamples;
  protected readonly groupApiRows = radioGroupApiRows;
  protected readonly itemApiRows = radioItemApiRows;
  protected readonly i18n = inject(I18nService);
  protected readonly RadioOrientation = RadioOrientation;

  basicValue: RadioValue = '';
  labeledValue: RadioValue = 'comfortable';
  horizontalValue: RadioValue = 'center';
  disabledGroupValue: RadioValue = 'option1';
  disabledItemValue: RadioValue = 'option1';

  protected readonly planControl = new FormControl<RadioValue | null>(null, {
    validators: [Validators.required],
  });

  constructor() {
    this.planControl.markAsTouched();
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
