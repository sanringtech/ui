import { Component, inject } from '@angular/core';
import { ButtonDirective, SpinnerComponent } from '@sanring/ui';
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
import { spinnerPage, spinnerPageExamples } from './spinner.docs';

@Component({
  selector: 'app-spinner-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    SpinnerComponent,
    ButtonDirective,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <!-- Basic -->
      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex items-center justify-center">
            <sanring-spinner />
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <!-- Usage -->
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

      <!-- Installation -->
      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="spinner"
          manualSnippet="import { SpinnerComponent } from './components/ui/spinner';"
        />
      </app-component-page-section>

      <!-- Examples -->
      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <!-- Variant -->
          <app-component-page-section [section]="section('example-variant')">
            <app-component-page-code-previewer [code]="examples.variant" language="angular-html">
              <div previewer class="flex items-center justify-center gap-6">
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner variant="loader" />
                  <span class="text-xs text-[var(--docs-muted)]">loader</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner variant="loader-circle" />
                  <span class="text-xs text-[var(--docs-muted)]">loader-circle</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner variant="pinwheel" />
                  <span class="text-xs text-[var(--docs-muted)]">pinwheel</span>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Size -->
          <app-component-page-section [section]="section('example-size')">
            <app-component-page-code-previewer [code]="examples.size" language="angular-html">
              <div previewer class="flex items-end justify-center gap-6">
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner size="sm" />
                  <span class="text-xs text-[var(--docs-muted)]">sm</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner size="md" />
                  <span class="text-xs text-[var(--docs-muted)]">md</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner size="lg" />
                  <span class="text-xs text-[var(--docs-muted)]">lg</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner size="xl" />
                  <span class="text-xs text-[var(--docs-muted)]">xl</span>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Speed -->
          <app-component-page-section [section]="section('example-speed')">
            <app-component-page-code-previewer [code]="examples.speed" language="angular-html">
              <div previewer class="flex items-end justify-center gap-8">
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner speed="slow" size="lg" />
                  <span class="text-xs text-[var(--docs-muted)]">slow (2s)</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner speed="normal" size="lg" />
                  <span class="text-xs text-[var(--docs-muted)]">normal (1s)</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <sanring-spinner speed="fast" size="lg" />
                  <span class="text-xs text-[var(--docs-muted)]">fast (0.5s)</span>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Color -->
          <app-component-page-section [section]="section('example-color')">
            <app-component-page-code-previewer [code]="examples.color" language="angular-html">
              <div previewer class="flex items-center justify-center gap-6">
                <sanring-spinner class="text-blue-500" />
                <sanring-spinner class="text-emerald-500" />
                <sanring-spinner class="text-rose-500" />
                <sanring-spinner class="text-[var(--sanring-muted)]" />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- With Label -->
          <app-component-page-section [section]="section('example-with-label')">
            <app-component-page-code-previewer [code]="examples.withLabel" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <div class="flex items-center gap-2 text-sm text-[var(--docs-muted)]">
                  <sanring-spinner size="sm" />
                  {{ i18n.t('spinner.demo.loading') }}
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- In Button -->
          <app-component-page-section [section]="section('example-in-button')">
            <app-component-page-code-previewer [code]="examples.inButton" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <button sanringBtn variant="secondary" [disabled]="true">
                  <sanring-spinner size="sm" />
                  {{ i18n.t('spinner.demo.saving') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <!-- API -->
      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class SpinnerPageComponent {
  protected readonly page = spinnerPage;
  protected readonly examples = spinnerPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
