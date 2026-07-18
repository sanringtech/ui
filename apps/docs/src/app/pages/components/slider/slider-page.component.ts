import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageComponent, LabelDirective, SanringFieldComponent, SliderComponent } from '@sanring/ui';
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
import { sliderPage, sliderPageExamples } from './slider.docs';

@Component({
  selector: 'app-slider-page',
  imports: [
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
    LabelDirective,
    SanringFieldComponent,
    SliderComponent,
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
          <div previewer class="grid w-full max-w-sm gap-3 px-4">
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm font-medium text-[var(--docs-fg)]">
                {{ i18n.t('slider.demo.volume') }}
              </span>
              <span class="font-mono text-sm text-[var(--docs-muted)]">{{ basicValue() }}</span>
            </div>
            <sanring-slider
              [value]="basicValue()"
              [ariaLabel]="i18n.t('slider.demo.volume')"
              (valueChange)="basicValue.set($event)"
            />
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
          componentName="slider"
          manualSnippet="import { SliderComponent } from './components/ui/slider';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-step')">
            <app-component-page-code-previewer [code]="examples.step" language="angular-html">
              <div previewer class="grid w-full max-w-sm gap-3 px-4">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm font-medium text-[var(--docs-fg)]">
                    {{ i18n.t('slider.demo.rating') }}
                  </span>
                  <span class="font-mono text-sm text-[var(--docs-muted)]">{{ stepValue() }}</span>
                </div>
                <sanring-slider
                  [min]="0"
                  [max]="10"
                  [step]="2"
                  [value]="stepValue()"
                  [ariaLabel]="i18n.t('slider.demo.rating')"
                  (valueChange)="stepValue.set($event)"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-form')">
            <app-component-page-code-previewer [code]="examples.form" language="angular-html">
              <div previewer class="grid w-full max-w-sm gap-3 px-4">
                <div class="flex items-center justify-between gap-4">
                  <label sanringLabel id="brightness-label" for="brightness">
                    {{ i18n.t('slider.demo.brightness') }}
                  </label>
                  <span class="font-mono text-sm text-[var(--docs-muted)]">
                    {{ formValue() }}%
                  </span>
                </div>
                <sanring-slider
                  id="brightness"
                  [value]="formValue()"
                  ariaLabelledBy="brightness-label"
                  (valueChange)="formValue.set($event)"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="grid w-full max-w-sm gap-3 px-4">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm font-medium text-[var(--docs-fg)]">
                    {{ i18n.t('slider.demo.locked') }}
                  </span>
                  <span class="font-mono text-sm text-[var(--docs-muted)]">35</span>
                </div>
                <sanring-slider [value]="35" disabled [ariaLabel]="i18n.t('slider.demo.locked')" />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-field')">
            <app-component-page-code-previewer [code]="examples.field" language="angular-html">
              <div previewer class="grid w-full max-w-sm gap-3 px-4">
                <sanring-field>
                  <sanring-slider
                    [formControl]="volumeControl"
                    [ariaLabel]="i18n.t('slider.demo.minVolume')"
                  />
                  <sanring-error-message>{{ i18n.t('slider.demo.fieldError') }}</sanring-error-message>
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
export class SliderPageComponent {
  protected readonly page = sliderPage;
  protected readonly examples = sliderPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly basicValue = signal(50);
  protected readonly stepValue = signal(4);
  protected readonly formValue = signal(65);

  protected readonly volumeControl = new FormControl<number>(50, {
    nonNullable: true,
    validators: [Validators.min(80)],
  });

  constructor() {
    this.volumeControl.markAsTouched();
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
