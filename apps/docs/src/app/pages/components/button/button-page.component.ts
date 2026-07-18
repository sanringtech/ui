import { Component, inject } from '@angular/core';
import { LucideArrowRight, LucideDownload, LucideSettings } from '@lucide/angular';
import { ButtonDirective } from '@sanring/ui';
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
import { buttonPage, buttonPageExamples } from './button.docs';

@Component({
  selector: 'app-button-page',
  imports: [
    ButtonDirective,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageComponent,
    ComponentPageCodePreviewer,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    LucideArrowRight,
    LucideDownload,
    LucideSettings,
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
          <div previewer class="grid gap-8">
            <div class="flex flex-wrap items-center justify-center gap-3">
              <button sanringBtn type="button" variant="outline">
                {{ i18n.t('button.demo.outline') }}
              </button>
              <button
                sanringBtn
                type="button"
                variant="outline"
                size="icon"
                [attr.aria-label]="i18n.t('button.demo.icon')"
              >
                <svg class="size-4" lucideSettings></svg>
              </button>
            </div>
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
          componentName="button"
          manualSnippet="import { ButtonDirective } from './components/ui/button';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-size')">
            <app-component-page-code-previewer [code]="examples.size" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button" variant="outline" size="sm">
                  {{ i18n.t('button.demo.small') }}
                </button>
                <button sanringBtn type="button" variant="outline">
                  {{ i18n.t('button.demo.default') }}
                </button>
                <button
                  sanringBtn
                  type="button"
                  variant="outline"
                  size="icon"
                  [attr.aria-label]="i18n.t('button.demo.icon')"
                >
                  <svg class="size-4" lucideSettings></svg>
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-default')">
            <app-component-page-code-previewer
              [code]="examples.defaultVariant"
              language="angular-html"
            >
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button">
                  {{ i18n.t('button.demo.default') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-outline')">
            <app-component-page-code-previewer [code]="examples.outline" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button" variant="outline">
                  {{ i18n.t('button.demo.outline') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-secondary')">
            <app-component-page-code-previewer [code]="examples.secondary" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button" variant="secondary">
                  {{ i18n.t('button.demo.secondary') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-ghost')">
            <app-component-page-code-previewer [code]="examples.ghost" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button" variant="ghost">
                  {{ i18n.t('button.demo.ghost') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-destructive')">
            <app-component-page-code-previewer
              [code]="examples.destructive"
              language="angular-html"
            >
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button" variant="destructive">
                  {{ i18n.t('button.demo.destructive') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-link')">
            <app-component-page-code-previewer [code]="examples.link" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <a sanringBtn href="#example-link" variant="link">
                  {{ i18n.t('button.demo.link') }}
                </a>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-icon')">
            <app-component-page-code-previewer [code]="examples.icon" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button
                  sanringBtn
                  type="button"
                  variant="outline"
                  size="icon"
                  [attr.aria-label]="i18n.t('button.demo.icon')"
                >
                  <svg class="size-4" lucideSettings></svg>
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-with-icon')">
            <app-component-page-code-previewer [code]="examples.withIcon" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button" variant="outline">
                  <svg class="size-4" lucideDownload></svg>
                  <span>{{ i18n.t('button.demo.withIcon') }}</span>
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-rounded')">
            <app-component-page-code-previewer [code]="examples.rounded" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn class="rounded-full" type="button" variant="outline">
                  <span>{{ i18n.t('button.demo.rounded') }}</span>
                  <svg class="size-4" lucideArrowRight></svg>
                </button>
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
export class ButtonPageComponent {
  protected readonly page = buttonPage;
  protected readonly examples = buttonPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
