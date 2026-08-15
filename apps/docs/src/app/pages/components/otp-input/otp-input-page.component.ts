import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonDirective,
  ErrorMessageComponent,
  LabelDirective,
  OtpInputComponent,
  OtpInputSeparatorComponent,
  OtpInputSlotComponent,
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
  ComponentPageKeyboardTableComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { otpInputPage, otpInputPageExamples } from './otp-input.docs';

@Component({
  selector: 'app-otp-input-page',
  imports: [
    ReactiveFormsModule,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageKeyboardTableComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    ButtonDirective,
    ErrorMessageComponent,
    LabelDirective,
    OtpInputComponent,
    OtpInputSeparatorComponent,
    OtpInputSlotComponent,
    SanringFieldComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections" [componentId]="page.componentId">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div
            previewer
            class="flex min-h-24 w-full items-center justify-start overflow-x-auto px-1 sm:justify-center sm:px-4"
          >
            <sanring-otp-input
              [length]="6"
              size="lg"
              autocomplete="one-time-code"
              [ariaLabel]="i18n.t('otpInput.demo.verificationCode')"
            />
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="otp-input"
          manualSnippet="import { OtpInputComponent } from './components/ui/otp-input';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-pattern')">
            <app-component-page-code-previewer [code]="examples.pattern" language="angular-html">
              <div
                previewer
                class="flex min-h-24 w-full items-center justify-start overflow-x-auto px-1 sm:justify-center sm:px-4"
              >
                <sanring-otp-input
                  [length]="6"
                  [pattern]="digitsOnlyPattern"
                  size="lg"
                  autocomplete="one-time-code"
                  [ariaLabel]="i18n.t('otpInput.demo.digitsOnly')"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-separator')">
            <app-component-page-code-previewer [code]="examples.separator" language="angular-html">
              <div
                previewer
                class="flex min-h-24 w-full items-center justify-start overflow-x-auto px-1 sm:justify-center sm:px-4"
              >
                <sanring-otp-input
                  [length]="6"
                  [value]="separatorValue"
                  size="lg"
                  autocomplete="one-time-code"
                  [ariaLabel]="i18n.t('otpInput.demo.verificationCode')"
                >
                  <sanring-otp-input-slot [index]="0" />
                  <sanring-otp-input-slot [index]="1" />
                  <sanring-otp-input-slot [index]="2" />
                  <sanring-otp-input-separator />
                  <sanring-otp-input-slot [index]="3" />
                  <sanring-otp-input-slot [index]="4" />
                  <sanring-otp-input-slot [index]="5" />
                </sanring-otp-input>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div
                previewer
                class="flex min-h-24 w-full items-center justify-start overflow-x-auto px-1 sm:justify-center sm:px-4"
              >
                <sanring-otp-input
                  [value]="'123456'"
                  size="lg"
                  autocomplete="one-time-code"
                  disabled
                  [ariaLabel]="i18n.t('otpInput.demo.verificationCode')"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-controlled')">
            <app-component-page-code-previewer [code]="examples.controlled" language="angular-html">
              <div
                previewer
                class="flex min-h-24 w-full items-center justify-start overflow-x-auto px-1 sm:justify-center sm:px-4"
              >
                <sanring-otp-input
                  [value]="controlledValue()"
                  size="lg"
                  autocomplete="one-time-code"
                  [ariaLabel]="i18n.t('otpInput.demo.verificationCode')"
                  (valueChange)="controlledValue.set($event)"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-invalid')">
            <app-component-page-code-previewer [code]="examples.invalid" language="angular-html">
              <div
                previewer
                class="grid min-h-32 w-full max-w-sm content-center gap-3 overflow-x-auto px-1 sm:px-4"
              >
                <sanring-field>
                  <label sanringLabel for="invalid-otp-code">
                    {{ i18n.t('otpInput.demo.verificationCode') }}
                  </label>
                  <sanring-otp-input
                    id="invalid-otp-code"
                    [formControl]="invalidCodeControl"
                    size="lg"
                    autocomplete="one-time-code"
                    [ariaLabel]="i18n.t('otpInput.demo.verificationCode')"
                  />
                  <sanring-error-message>{{
                    i18n.t('otpInput.demo.invalidError')
                  }}</sanring-error-message>
                </sanring-field>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-four-digits')">
            <app-component-page-code-previewer [code]="examples.fourDigits" language="angular-html">
              <div
                previewer
                class="flex min-h-24 w-full items-center justify-start overflow-x-auto px-1 sm:justify-center sm:px-4"
              >
                <sanring-otp-input
                  [length]="4"
                  [pattern]="digitsOnlyPattern"
                  size="lg"
                  autocomplete="one-time-code"
                  [ariaLabel]="i18n.t('otpInput.demo.pinCode')"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-alphanumeric')">
            <app-component-page-code-previewer
              [code]="examples.alphanumeric"
              language="angular-html"
            >
              <div
                previewer
                class="flex min-h-24 w-full items-center justify-start overflow-x-auto px-1 sm:justify-center sm:px-4"
              >
                <sanring-otp-input
                  type="alphanumeric"
                  [length]="5"
                  [value]="'A1B2C'"
                  size="lg"
                  autocomplete="one-time-code"
                  [ariaLabel]="i18n.t('otpInput.demo.recoveryCode')"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-form')">
            <app-component-page-code-previewer [code]="examples.form" language="angular-html">
              <form previewer class="grid w-full max-w-sm gap-4 px-4" (ngSubmit)="verifyCode()">
                <div class="grid gap-1">
                  <h4 class="text-sm font-semibold text-[var(--docs-fg)]">
                    {{ i18n.t('otpInput.demo.verifyLogin') }}
                  </h4>
                  <p class="text-sm text-[var(--docs-muted)]">
                    {{ i18n.t('otpInput.demo.formDescription') }}
                  </p>
                </div>

                <sanring-field>
                  <label sanringLabel for="otp-code-field">
                    {{ i18n.t('otpInput.demo.verificationCode') }}
                  </label>
                  <sanring-otp-input
                    id="otp-code-field"
                    [formControl]="codeControl"
                    size="lg"
                    autocomplete="one-time-code"
                    [ariaLabel]="i18n.t('otpInput.demo.verificationCode')"
                  />
                  <sanring-error-message>{{
                    i18n.t('otpInput.demo.fieldError')
                  }}</sanring-error-message>
                </sanring-field>

                <button sanringBtn type="submit">
                  {{ i18n.t('otpInput.demo.verify') }}
                </button>
              </form>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('accessibility')" />

      <app-component-page-section [section]="section('keyboard')">
        <app-component-page-keyboard-table [rows]="page.keyboardRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('stateModel')" />
    </app-component-page>
  `,
})
export class OtpInputPageComponent {
  protected readonly page = otpInputPage;
  protected readonly examples = otpInputPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly digitsOnlyPattern = /^[0-9]$/;
  protected readonly separatorValue = '123456';
  protected readonly controlledValue = signal('');
  protected readonly invalidCodeControl = new FormControl('000000', {
    nonNullable: true,
    validators: [Validators.pattern(/^123456$/)],
  });
  protected readonly codeControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  constructor() {
    this.invalidCodeControl.markAsTouched();
    this.codeControl.markAsTouched();
  }

  protected verifyCode(): void {
    this.codeControl.markAsTouched();
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
