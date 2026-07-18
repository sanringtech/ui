import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageComponent, LabelDirective, SanringFieldComponent, SwitchComponent } from '@sanring/ui';
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
import { switchPage, switchPageExamples } from './switch.docs';

@Component({
  selector: 'app-switch-page',
  imports: [
    ReactiveFormsModule,
    ComponentPageApiTableComponent,
    ErrorMessageComponent,
    SanringFieldComponent,
    SwitchComponent,
    LabelDirective,
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
          <div previewer class="flex items-center justify-center">
            <sanring-switch checked />
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
          componentName="switch"
          manualSnippet="import { SwitchComponent } from './components/ui/switch';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-description')">
            <app-component-page-code-previewer
              [code]="examples.description"
              language="angular-html"
            >
              <div previewer class="w-[min(460px,100%)]">
                <div class="flex items-center justify-between gap-6">
                  <div class="grid gap-1">
                    <label sanringLabel for="marketing-emails">
                      {{ i18n.t('switch.demo.marketingTitle') }}
                    </label>
                    <p class="m-0 text-sm leading-6 text-[var(--docs-muted)]">
                      {{ i18n.t('switch.demo.marketingDescription') }}
                    </p>
                  </div>
                  <sanring-switch id="marketing-emails" checked />
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-choice-card')">
            <app-component-page-code-previewer [code]="examples.choiceCard" language="angular-html">
              <div previewer class="w-[min(480px,100%)]">
                <div
                  class="flex items-center justify-between gap-4 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"
                >
                  <span class="grid gap-1">
                    <span class="text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t('switch.demo.notificationsTitle') }}
                    </span>
                    <span class="text-sm leading-6 text-[var(--docs-muted)]">
                      {{ i18n.t('switch.demo.notificationsDescription') }}
                    </span>
                  </span>
                  <sanring-switch checked />
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="flex items-center justify-center gap-4">
                <sanring-switch disabled />
                <sanring-switch checked disabled />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-invalid')">
            <app-component-page-code-previewer [code]="examples.invalid" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <div class="grid gap-2">
                  <div class="flex items-center justify-between gap-4">
                    <label sanringLabel for="required-consent">
                      {{ i18n.t('switch.demo.consentTitle') }}
                    </label>
                    <sanring-switch id="required-consent" invalid />
                  </div>
                  <p class="m-0 text-sm leading-6 text-red-500">
                    {{ i18n.t('switch.demo.consentError') }}
                  </p>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-size')">
            <app-component-page-code-previewer [code]="examples.size" language="angular-html">
              <div previewer class="flex items-center justify-center gap-4">
                <sanring-switch size="sm" checked />
                <sanring-switch checked />
                <sanring-switch size="lg" checked />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-field')">
            <app-component-page-code-previewer [code]="examples.field" language="angular-html">
              <div previewer class="w-[min(360px,100%)]">
                <sanring-field>
                  <div class="flex items-center justify-between gap-4">
                    <label for="terms-switch" class="text-sm font-medium leading-none">
                      {{ i18n.t('switch.demo.acceptTerms') }}
                    </label>
                    <sanring-switch id="terms-switch" [formControl]="termsControl" />
                  </div>
                  <sanring-error-message>{{ i18n.t('switch.demo.fieldError') }}</sanring-error-message>
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
export class SwitchPageComponent {
  protected readonly page = switchPage;
  protected readonly examples = switchPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly termsControl = new FormControl<boolean>(false, {
    validators: [Validators.requiredTrue],
  });

  constructor() {
    this.termsControl.markAsTouched();
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
