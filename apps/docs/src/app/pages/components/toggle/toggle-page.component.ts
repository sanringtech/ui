import { Component, inject } from '@angular/core';
import { LucideBold, LucideItalic, LucideUnderline } from '@lucide/angular';
import { ToggleDirective } from '@sanring/ui';
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
import { togglePage, togglePageExamples } from './toggle.docs';

@Component({
  selector: 'app-toggle-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    ToggleDirective,
    LucideBold,
    LucideItalic,
    LucideUnderline,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <!-- Basic preview -->
      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex items-center justify-center">
            <button sanringToggle>
              <svg class="size-4" lucideBold></svg>
            </button>
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
          componentName="toggle"
          manualSnippet="import { ToggleDirective } from './components/ui/toggle';"
        />
      </app-component-page-section>

      <!-- Examples -->
      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <!-- Outline -->
          <app-component-page-section [section]="section('example-outline')">
            <app-component-page-code-previewer [code]="examples.outline" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <button sanringToggle variant="outline">
                  <svg class="size-4" lucideBold></svg>
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- With Text -->
          <app-component-page-section [section]="section('example-with-text')">
            <app-component-page-code-previewer [code]="examples.withText" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-1">
                <button sanringToggle>
                  <svg class="size-4" lucideBold></svg>
                  {{ i18n.t('toggle.demo.bold') }}
                </button>
                <button sanringToggle>
                  <svg class="size-4" lucideItalic></svg>
                  {{ i18n.t('toggle.demo.italic') }}
                </button>
                <button sanringToggle>
                  <svg class="size-4" lucideUnderline></svg>
                  {{ i18n.t('toggle.demo.underline') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Size -->
          <app-component-page-section [section]="section('example-size')">
            <app-component-page-code-previewer [code]="examples.size" language="angular-html">
              <div previewer class="flex items-center justify-center gap-2">
                <button sanringToggle size="sm">
                  <svg class="size-3.5" lucideBold></svg>
                </button>
                <button sanringToggle>
                  <svg class="size-4" lucideBold></svg>
                </button>
                <button sanringToggle size="lg">
                  <svg class="size-5" lucideBold></svg>
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Disabled -->
          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="flex items-center justify-center gap-2">
                <button sanringToggle disabled>
                  <svg class="size-4" lucideBold></svg>
                </button>
                <button sanringToggle [pressed]="true" disabled>
                  <svg class="size-4" lucideBold></svg>
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
export class TogglePageComponent {
  protected readonly page = togglePage;
  protected readonly examples = togglePageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
