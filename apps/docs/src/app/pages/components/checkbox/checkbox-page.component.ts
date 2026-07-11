import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CheckboxComponent,
  CheckedState,
  ErrorMessageComponent,
  LabelDirective,
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
import { checkboxPage, checkboxPageExamples } from './checkbox.docs';

@Component({
  selector: 'app-checkbox-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ComponentPageApiTableComponent,
    CheckboxComponent,
    ErrorMessageComponent,
    LabelDirective,
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
          <div previewer class="flex items-center justify-center">
            <sanring-checkbox [(ngModel)]="basicChecked" />
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
          componentName="checkbox"
          manualSnippet="import { CheckboxComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-indeterminate')">
            <app-component-page-code-previewer
              [code]="examples.indeterminate"
              language="angular-html"
            >
              <div previewer class="flex items-center justify-center">
                <sanring-checkbox [(ngModel)]="indeterminate" />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-with-label')">
            <app-component-page-code-previewer [code]="examples.withLabel" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <div class="flex items-center gap-2">
                  <sanring-checkbox id="terms" [(ngModel)]="accepted" />
                  <label sanringLabel for="terms">
                    {{ i18n.t('checkbox.demo.acceptTerms') }}
                  </label>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="flex items-center justify-center gap-4">
                <sanring-checkbox disabled />
                <sanring-checkbox disabled [(ngModel)]="disabledChecked" />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-state-surface')">
            <app-component-page-code-previewer
              [code]="examples.stateSurface"
              language="angular-html"
            >
              <div previewer class="w-[min(520px,100%)]">
                <div class="rounded-[var(--sanring-radius)] bg-slate-100 p-5 dark:bg-slate-800/70">
                  <div class="grid gap-4 sm:grid-cols-3">
                    <div class="flex items-center gap-2">
                      <sanring-checkbox [ngModel]="false" />
                      <span class="text-sm text-slate-700 dark:text-slate-200">
                        {{ i18n.t('checkbox.demo.unchecked') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <sanring-checkbox [ngModel]="true" />
                      <span class="text-sm text-slate-700 dark:text-slate-200">
                        {{ i18n.t('checkbox.demo.checked') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <sanring-checkbox [ngModel]="'indeterminate'" />
                      <span class="text-sm text-slate-700 dark:text-slate-200">
                        {{ i18n.t('checkbox.demo.indeterminate') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <sanring-checkbox disabled [ngModel]="false" />
                      <span class="text-sm text-slate-500 dark:text-slate-400">
                        {{ i18n.t('checkbox.demo.disabledUnchecked') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <sanring-checkbox disabled [ngModel]="true" />
                      <span class="text-sm text-slate-500 dark:text-slate-400">
                        {{ i18n.t('checkbox.demo.disabledChecked') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <sanring-checkbox disabled [ngModel]="'indeterminate'" />
                      <span class="text-sm text-slate-500 dark:text-slate-400">
                        {{ i18n.t('checkbox.demo.disabledIndeterminate') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example-size')">
        <app-component-page-code-previewer [code]="examples.size" language="angular-html">
          <div previewer class="flex items-center justify-center">
            <div class="flex items-center gap-6">
              <div class="flex flex-col items-center gap-2">
                <sanring-checkbox size="sm" [(ngModel)]="sizeChecked" />
                <span class="text-xs text-muted-foreground">{{
                  i18n.t('checkbox.demo.size.sm')
                }}</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <sanring-checkbox size="md" [(ngModel)]="sizeChecked" />
                <span class="text-xs text-muted-foreground">{{
                  i18n.t('checkbox.demo.size.md')
                }}</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <sanring-checkbox size="lg" [(ngModel)]="sizeChecked" />
                <span class="text-xs text-muted-foreground">{{
                  i18n.t('checkbox.demo.size.lg')
                }}</span>
              </div>
            </div>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('example-event-binding')">
        <app-component-page-code-previewer [code]="examples.eventBinding" language="angular-html">
          <div previewer class="flex flex-col items-center gap-3">
            <sanring-checkbox [(checked)]="eventChecked" (checkedChange)="onCheckedChange()" />
            <span class="text-sm text-muted-foreground">Changed {{ changeCount }} times</span>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('example-field')">
        <app-component-page-code-previewer [code]="examples.field" language="angular-html">
          <div previewer class="w-[min(360px,100%)]">
            <sanring-field>
              <div class="flex items-center gap-2">
                <sanring-checkbox id="terms-field" [formControl]="termsControl" />
                <label for="terms-field" class="text-sm font-medium leading-none">
                  {{ i18n.t('checkbox.demo.acceptTerms') }}
                </label>
              </div>
              <sanring-error-message>{{ i18n.t('checkbox.demo.fieldError') }}</sanring-error-message>
            </sanring-field>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class CheckboxPageComponent {
  protected readonly page = checkboxPage;
  protected readonly examples = checkboxPageExamples;
  protected readonly i18n = inject(I18nService);

  basicChecked: CheckedState = false;
  indeterminate: CheckedState = 'indeterminate';
  accepted: CheckedState = false;
  disabledChecked: CheckedState = true;
  sizeChecked: CheckedState = false;
  eventChecked: CheckedState = false;
  changeCount = 0;

  protected readonly termsControl = new FormControl<CheckedState>(false, {
    validators: [Validators.requiredTrue],
  });

  constructor() {
    this.termsControl.markAsTouched();
  }

  onCheckedChange() {
    this.changeCount++;
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
