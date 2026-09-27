import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ColorPickerComponent,
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
  ComponentPageKeyboardTableComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { colorPickerPage, colorPickerPageExamples } from './color-picker.docs';

@Component({
  selector: 'app-color-picker-page',
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
    ColorPickerComponent,
    LabelDirective,
    SanringFieldComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections" [componentId]="page.componentId">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
        [registryDeps]="page.registryDeps"
        [ssrSafe]="page.ssrSafe"
        [hasAccessibilityNotes]="true"
        [hasKeyboardSupport]="true"
        [stateModelLabel]="i18n.t('component.header.cva')"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex items-center gap-3 px-4">
            <sanring-color-picker
              [value]="basicValue()"
              [ariaLabel]="i18n.t('colorPicker.demo.brand')"
              (valueChange)="basicValue.set($event)"
            />
            <span class="font-mono text-sm text-[var(--docs-muted)]">{{ basicValue() }}</span>
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
          componentName="color-picker"
          manualSnippet="import { ColorPickerComponent } from './components/ui/color-picker';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-swatches')">
            <app-component-page-code-previewer [code]="examples.swatches" language="angular-html">
              <div previewer class="flex items-center gap-3 px-4">
                <sanring-color-picker
                  [value]="swatchValue()"
                  [swatches]="swatches"
                  [ariaLabel]="i18n.t('colorPicker.demo.brand')"
                  (valueChange)="swatchValue.set($event)"
                />
                <span class="font-mono text-sm text-[var(--docs-muted)]">{{ swatchValue() }}</span>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-formats')">
            <app-component-page-code-previewer [code]="examples.formats" language="angular-html">
              <div previewer class="flex items-center gap-3 px-4">
                <sanring-color-picker
                  [value]="formatValue()"
                  format="rgb"
                  [ariaLabel]="i18n.t('colorPicker.demo.brand')"
                  (valueChange)="formatValue.set($event)"
                />
                <span class="font-mono text-sm text-[var(--docs-muted)]">{{ formatValue() }}</span>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="px-4">
                <sanring-color-picker
                  [value]="'#2563eb'"
                  disabled
                  [ariaLabel]="i18n.t('colorPicker.demo.locked')"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-field')">
            <app-component-page-code-previewer [code]="examples.field" language="angular-html">
              <div previewer class="grid w-full max-w-sm gap-2 px-4">
                <sanring-field>
                  <label sanringLabel for="brand-color">{{ i18n.t('colorPicker.demo.brand') }}</label>
                  <sanring-color-picker id="brand-color" [formControl]="brandControl" />
                </sanring-field>
                <span class="font-mono text-sm text-[var(--docs-muted)]">{{
                  brandControl.value
                }}</span>
              </div>
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
export class ColorPickerPageComponent {
  protected readonly page = colorPickerPage;
  protected readonly examples = colorPickerPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly basicValue = signal('#2563eb');
  protected readonly swatchValue = signal('#2563eb');
  protected readonly formatValue = signal('rgb(37, 99, 235)');
  protected readonly swatches = ['#0f172a', '#2563eb', '#16a34a', '#e11d48', '#f59e0b', '#fff'];
  protected readonly brandControl = new FormControl('#2563eb', { nonNullable: true });

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
