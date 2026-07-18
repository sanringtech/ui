import { Component, inject } from '@angular/core';
import {
  ButtonDirective,
  StepComponent,
  StepIconDirective,
  StepLabelDirective,
  StepperComponent,
  StepperNextDirective,
  StepperPreviousDirective,
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
import { stepperPage, stepperPageExamples } from './stepper.docs';

@Component({
  selector: 'app-stepper-page',
  imports: [
    ButtonDirective,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    StepComponent,
    StepIconDirective,
    StepLabelDirective,
    StepperComponent,
    StepperNextDirective,
    StepperPreviousDirective,
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
          <div previewer class="w-full max-w-2xl px-4">
            <sanring-stepper optionalLabel="Optional">
              <sanring-step [label]="i18n.t('stepper.demo.account')">
                <div class="grid gap-4">
                  <div>
                    <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                      {{ i18n.t('stepper.demo.accountTitle') }}
                    </h3>
                    <p class="m-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                      {{ i18n.t('stepper.demo.accountDescription') }}
                    </p>
                  </div>
                  <div class="flex justify-end">
                    <button sanringBtn sanringStepperNext variant="outline" size="sm">
                      {{ i18n.t('stepper.demo.next') }}
                    </button>
                  </div>
                </div>
              </sanring-step>

              <sanring-step [label]="i18n.t('stepper.demo.profile')" optional>
                <div class="grid gap-4">
                  <div>
                    <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                      {{ i18n.t('stepper.demo.profileTitle') }}
                    </h3>
                    <p class="m-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                      {{ i18n.t('stepper.demo.profileDescription') }}
                    </p>
                  </div>
                  <div class="flex justify-between">
                    <button sanringBtn sanringStepperPrevious variant="outline" size="sm">
                      {{ i18n.t('stepper.demo.back') }}
                    </button>
                    <button sanringBtn sanringStepperNext variant="outline" size="sm">
                      {{ i18n.t('stepper.demo.next') }}
                    </button>
                  </div>
                </div>
              </sanring-step>

              <sanring-step [label]="i18n.t('stepper.demo.review')">
                <div class="grid gap-4">
                  <div>
                    <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                      {{ i18n.t('stepper.demo.reviewTitle') }}
                    </h3>
                    <p class="m-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                      {{ i18n.t('stepper.demo.reviewDescription') }}
                    </p>
                  </div>
                  <div class="flex justify-start">
                    <button sanringBtn sanringStepperPrevious variant="outline" size="sm">
                      {{ i18n.t('stepper.demo.back') }}
                    </button>
                  </div>
                </div>
              </sanring-step>
            </sanring-stepper>
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
          componentName="stepper"
          manualSnippet="import { StepperComponent, StepComponent } from './components/ui/stepper';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-dashed')">
            <app-component-page-code-previewer [code]="examples.dashed" language="angular-html">
              <div previewer class="w-full max-w-2xl px-4">
                <sanring-stepper lineStyle="dashed" [selectedIndex]="1">
                  <sanring-step [label]="i18n.t('stepper.demo.cart')" completed>
                    {{ i18n.t('stepper.demo.cartContent') }}
                  </sanring-step>
                  <sanring-step [label]="i18n.t('stepper.demo.shipping')">
                    {{ i18n.t('stepper.demo.shippingContent') }}
                  </sanring-step>
                  <sanring-step [label]="i18n.t('stepper.demo.payment')">
                    {{ i18n.t('stepper.demo.paymentContent') }}
                  </sanring-step>
                </sanring-stepper>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-custom-label')">
            <app-component-page-code-previewer
              [code]="examples.customLabel"
              language="angular-html"
            >
              <div previewer class="w-full max-w-2xl px-4">
                <sanring-stepper [selectedIndex]="2">
                  <sanring-step [label]="i18n.t('stepper.demo.plan')" completed>
                    {{ i18n.t('stepper.demo.planContent') }}
                  </sanring-step>
                  <sanring-step [label]="i18n.t('stepper.demo.build')" completed>
                    {{ i18n.t('stepper.demo.buildContent') }}
                  </sanring-step>
                  <sanring-step [label]="i18n.t('stepper.demo.deploy')" customState="error">
                    <ng-template sanringStepLabel>
                      <span class="inline-flex items-center gap-2">
                        {{ i18n.t('stepper.demo.deploy') }}
                      </span>
                    </ng-template>
                    <ng-template sanringStepIcon let-state="state">
                      <span class="text-xs font-bold">{{ state === 'error' ? '!' : '3' }}</span>
                    </ng-template>
                    {{ i18n.t('stepper.demo.deployContent') }}
                  </sanring-step>
                </sanring-stepper>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-vertical')">
            <app-component-page-code-previewer [code]="examples.vertical" language="angular-html">
              <div previewer class="w-full max-w-md px-4">
                <sanring-stepper orientation="vertical" lineStyle="solid">
                  <sanring-step [label]="i18n.t('stepper.demo.plan')">
                    {{ i18n.t('stepper.demo.planContent') }}
                  </sanring-step>
                  <sanring-step [label]="i18n.t('stepper.demo.build')">
                    {{ i18n.t('stepper.demo.buildContent') }}
                  </sanring-step>
                  <sanring-step [label]="i18n.t('stepper.demo.deploy')">
                    {{ i18n.t('stepper.demo.deployContent') }}
                  </sanring-step>
                </sanring-stepper>
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
export class StepperPageComponent {
  protected readonly page = stepperPage;
  protected readonly examples = stepperPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
