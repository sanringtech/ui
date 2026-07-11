import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideChevronDown } from '@lucide/angular';
import {
  ButtonDirective,
  ErrorMessageComponent,
  SANRING_COMBOBOX_IMPORTS,
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
  ComponentPageHintComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { comboboxPage, comboboxPageExamples } from './combobox.docs';

@Component({
  selector: 'app-combobox-page',
  imports: [
    ReactiveFormsModule,
    SANRING_COMBOBOX_IMPORTS,
    ButtonDirective,
    ErrorMessageComponent,
    LucideChevronDown,
    SanringFieldComponent,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageHintComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
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
          <div previewer class="flex w-full min-h-[220px] items-start justify-center pt-8">
            <div class="grid w-[min(360px,100%)] gap-2">
              <sanring-combobox [(value)]="framework">
                <sanring-combobox-label>{{
                  i18n.t('combobox.demo.framework')
                }}</sanring-combobox-label>
                <sanring-combobox-input [placeholder]="i18n.t('combobox.demo.placeholder')" />
                <sanring-combobox-content>
                  <sanring-combobox-empty>{{
                    i18n.t('combobox.demo.empty')
                  }}</sanring-combobox-empty>
                  <sanring-combobox-list>
                    @for (item of frameworks; track item.value) {
                      <sanring-combobox-item [value]="item.value" [label]="item.label">
                        {{ item.label }}
                      </sanring-combobox-item>
                    }
                  </sanring-combobox-list>
                </sanring-combobox-content>
              </sanring-combobox>
              <app-component-page-hint>
                {{ i18n.t('combobox.demo.selected') }} {{ labelFor(framework) || '—' }}
              </app-component-page-hint>
            </div>
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
          componentName="combobox"
          manualSnippet="import { SANRING_COMBOBOX_IMPORTS } from '@sanring/ui';"
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
          <app-component-page-section [section]="section('example-multiple')">
            <app-component-page-code-previewer [code]="examples.multiple" language="angular-html">
              <div previewer class="flex w-full min-h-[240px] items-start justify-center pt-8">
                <div class="grid w-[min(320px,100%)] gap-2">
                  <sanring-combobox [multiple]="true" [(value)]="selectedFrameworks">
                    <sanring-combobox-label>{{
                      i18n.t('combobox.demo.frameworks')
                    }}</sanring-combobox-label>
                    <sanring-combobox-chip-input>
                      @for (value of selectedFrameworkValues(); track value) {
                        <sanring-combobox-chip [value]="value">{{
                          labelFor(value)
                        }}</sanring-combobox-chip>
                      }
                      <sanring-combobox-input />
                    </sanring-combobox-chip-input>
                    <sanring-combobox-content>
                      <sanring-combobox-empty>{{
                        i18n.t('combobox.demo.empty')
                      }}</sanring-combobox-empty>
                      <sanring-combobox-list>
                        @for (item of frameworks; track item.value) {
                          <sanring-combobox-item [value]="item.value" [label]="item.label">
                            {{ item.label }}
                          </sanring-combobox-item>
                        }
                      </sanring-combobox-list>
                    </sanring-combobox-content>
                  </sanring-combobox>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-groups')">
            <app-component-page-code-previewer [code]="examples.groups" language="angular-html">
              <div previewer class="flex w-full min-h-[240px] items-start justify-center pt-8">
                <div class="grid w-[min(360px,100%)] gap-2">
                  <sanring-combobox [(value)]="library">
                    <sanring-combobox-input
                      [placeholder]="i18n.t('combobox.demo.searchLibraries')"
                    />
                    <sanring-combobox-content>
                      <sanring-combobox-empty>{{
                        i18n.t('combobox.demo.noLibraries')
                      }}</sanring-combobox-empty>
                      <sanring-combobox-list>
                        <sanring-combobox-group [heading]="i18n.t('combobox.demo.frontend')">
                          <sanring-combobox-item value="angular">Angular</sanring-combobox-item>
                          <sanring-combobox-item value="react">React</sanring-combobox-item>
                        </sanring-combobox-group>
                        <sanring-combobox-separator />
                        <sanring-combobox-group [heading]="i18n.t('combobox.demo.meta')">
                          <sanring-combobox-item value="next">Next.js</sanring-combobox-item>
                          <sanring-combobox-item value="nuxt">Nuxt</sanring-combobox-item>
                        </sanring-combobox-group>
                      </sanring-combobox-list>
                    </sanring-combobox-content>
                  </sanring-combobox>
                  <app-component-page-hint>
                    {{ i18n.t('combobox.demo.selected') }} {{ library || '—' }}
                  </app-component-page-hint>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-popup')">
            <app-component-page-hint class="text-sm leading-6">
              {{ i18n.t('combobox.demo.popupDescription') }}
            </app-component-page-hint>
            <app-component-page-code-previewer [code]="examples.popup" language="angular-html">
              <div previewer class="flex w-full min-h-[240px] items-start justify-center pt-8">
                <div class="grid w-[min(360px,100%)] gap-2">
                  <sanring-combobox #combo="sanringCombobox" [(value)]="country">
                    <button
                      type="button"
                      sanringComboboxTrigger
                      sanringBtn
                      variant="outline"
                      class="w-full justify-between"
                    >
                      {{ labelFor(country, countries) || i18n.t('combobox.demo.selectCountry') }}
                      <svg
                        lucideChevronDown
                        class="size-4 opacity-60 transition-transform"
                        [class.rotate-180]="combo.isOpen()"
                      ></svg>
                    </button>
                    <sanring-combobox-content>
                      <div class="border-b border-[var(--sanring-border)] p-2">
                        <sanring-combobox-input [placeholder]="i18n.t('combobox.demo.search')" />
                      </div>
                      <sanring-combobox-empty>{{
                        i18n.t('combobox.demo.empty')
                      }}</sanring-combobox-empty>
                      <sanring-combobox-list>
                        @for (item of countries; track item.value) {
                          <sanring-combobox-item [value]="item.value" [label]="item.label">
                            {{ item.label }}
                          </sanring-combobox-item>
                        }
                      </sanring-combobox-list>
                    </sanring-combobox-content>
                  </sanring-combobox>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-clear')">
            <app-component-page-hint class="text-sm leading-6">
              {{ i18n.t('combobox.demo.clearButtonDescription') }}
            </app-component-page-hint>
            <app-component-page-code-previewer [code]="examples.clear" language="angular-html">
              <div previewer class="flex w-full min-h-[240px] items-start justify-center pt-8">
                <div class="grid w-[min(360px,100%)] gap-2">
                  <sanring-combobox [(value)]="clearDemoValue">
                    <sanring-combobox-input
                      [placeholder]="i18n.t('combobox.demo.searchLibraries')"
                      [showClear]="true"
                    />
                    <sanring-combobox-content>
                      <sanring-combobox-empty>{{
                        i18n.t('combobox.demo.empty')
                      }}</sanring-combobox-empty>
                      <sanring-combobox-list>
                        @for (item of frameworks; track item.value) {
                          <sanring-combobox-item [value]="item.value" [label]="item.label">
                            {{ item.label }}
                          </sanring-combobox-item>
                        }
                      </sanring-combobox-list>
                    </sanring-combobox-content>
                  </sanring-combobox>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="flex w-full min-h-[160px] items-start justify-center pt-8">
                <sanring-combobox [disabled]="true" class="w-[min(360px,100%)]">
                  <sanring-combobox-input [placeholder]="i18n.t('combobox.demo.disabled')" />
                </sanring-combobox>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-field')">
            <app-component-page-code-previewer [code]="examples.field" language="angular-html">
              <div previewer class="flex w-full min-h-[220px] items-start justify-center pt-8">
                <sanring-field class="w-[min(360px,100%)]">
                  <sanring-combobox [formControl]="frameworkControl">
                    <sanring-combobox-input [placeholder]="i18n.t('combobox.demo.placeholder')" />
                    <sanring-combobox-content>
                      <sanring-combobox-empty>{{
                        i18n.t('combobox.demo.empty')
                      }}</sanring-combobox-empty>
                      <sanring-combobox-list>
                        @for (item of frameworks; track item.value) {
                          <sanring-combobox-item [value]="item.value" [label]="item.label">
                            {{ item.label }}
                          </sanring-combobox-item>
                        }
                      </sanring-combobox-list>
                    </sanring-combobox-content>
                  </sanring-combobox>
                  <sanring-error-message>{{ i18n.t('combobox.demo.fieldError') }}</sanring-error-message>
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
export class ComboboxPageComponent {
  protected readonly page = comboboxPage;
  protected readonly examples = comboboxPageExamples;
  protected readonly i18n = inject(I18nService);

  protected framework: string | string[] | null = 'angular';
  protected selectedFrameworks: string | string[] | null = ['angular', 'astro'];
  protected library: string | string[] | null = 'angular';
  protected country: string | string[] | null = null;
  protected clearDemoValue: string | string[] | null = 'react';

  protected readonly frameworkControl = new FormControl<string | null>(null, {
    validators: [Validators.required],
  });

  constructor() {
    this.frameworkControl.markAsTouched();
  }

  protected readonly frameworks = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'sveltekit', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt' },
    { value: 'astro', label: 'Astro' },
  ];

  protected readonly countries = [
    { value: 'ca', label: 'Canada' },
    { value: 'jp', label: 'Japan' },
    { value: 'tw', label: 'Taiwan' },
    { value: 'us', label: 'United States' },
  ];

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected selectedFrameworkValues(): string[] {
    return Array.isArray(this.selectedFrameworks) ? this.selectedFrameworks : [];
  }

  protected labelFor(
    value: string | string[] | null,
    items: { value: string; label: string }[] = this.frameworks,
  ): string {
    if (!value || Array.isArray(value)) return '';
    return items.find((item) => item.value === value)?.label ?? value;
  }
}
