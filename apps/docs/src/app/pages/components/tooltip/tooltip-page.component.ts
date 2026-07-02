import { Component, inject } from '@angular/core';
import { ButtonDirective, SANRING_TOOLTIP_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { tooltipPage, tooltipPageExamples } from './tooltip.docs';

@Component({
  selector: 'app-tooltip-page',
  imports: [
    ButtonDirective,
    ComponentPageApiTableComponent,
    SANRING_TOOLTIP_IMPORTS,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
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
          <div previewer class="flex min-h-28 items-center justify-center">
            <sanring-tooltip>
              <button sanringBtn sanringTooltipTrigger type="button" variant="outline">
                {{ i18n.t('tooltip.demo.hover') }}
              </button>
              <sanring-tooltip-content>
                {{ i18n.t('tooltip.demo.basicContent') }}
              </sanring-tooltip-content>
            </sanring-tooltip>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="tooltip"
          manualSnippet="import { SANRING_TOOLTIP_IMPORTS } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-side')">
            <app-component-page-code-previewer [code]="examples.side" language="angular-html">
              <div previewer class="flex min-h-64 items-center justify-center">
                <div class="grid grid-cols-2 gap-5">
                  <sanring-tooltip>
                    <button sanringBtn sanringTooltipTrigger type="button" variant="outline">
                      {{ i18n.t('tooltip.demo.top') }}
                    </button>
                    <sanring-tooltip-content side="top">
                      {{ i18n.t('tooltip.demo.topContent') }}
                    </sanring-tooltip-content>
                  </sanring-tooltip>

                  <sanring-tooltip>
                    <button sanringBtn sanringTooltipTrigger type="button" variant="outline">
                      {{ i18n.t('tooltip.demo.right') }}
                    </button>
                    <sanring-tooltip-content side="right">
                      {{ i18n.t('tooltip.demo.rightContent') }}
                    </sanring-tooltip-content>
                  </sanring-tooltip>

                  <sanring-tooltip>
                    <button sanringBtn sanringTooltipTrigger type="button" variant="outline">
                      {{ i18n.t('tooltip.demo.left') }}
                    </button>
                    <sanring-tooltip-content side="left">
                      {{ i18n.t('tooltip.demo.leftContent') }}
                    </sanring-tooltip-content>
                  </sanring-tooltip>

                  <sanring-tooltip>
                    <button sanringBtn sanringTooltipTrigger type="button" variant="outline">
                      {{ i18n.t('tooltip.demo.bottom') }}
                    </button>
                    <sanring-tooltip-content side="bottom">
                      {{ i18n.t('tooltip.demo.bottomContent') }}
                    </sanring-tooltip-content>
                  </sanring-tooltip>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-delay')">
            <app-component-page-code-previewer [code]="examples.delay" language="angular-html">
              <div previewer class="flex min-h-28 items-center justify-center">
                <sanring-tooltip [delayDuration]="600">
                  <button sanringBtn sanringTooltipTrigger type="button" variant="outline">
                    {{ i18n.t('tooltip.demo.delay') }}
                  </button>
                  <sanring-tooltip-content>
                    {{ i18n.t('tooltip.demo.delayContent') }}
                  </sanring-tooltip-content>
                </sanring-tooltip>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-custom-content')">
            <app-component-page-code-previewer
              [code]="examples.customContent"
              language="angular-html"
            >
              <div previewer class="flex min-h-28 items-center justify-center">
                <sanring-tooltip>
                  <button sanringBtn sanringTooltipTrigger type="button" variant="outline">
                    {{ i18n.t('tooltip.demo.status') }}
                  </button>
                  <sanring-tooltip-content class="max-w-56 text-left">
                    <span class="block font-semibold">
                      {{ i18n.t('tooltip.demo.statusTitle') }}
                    </span>
                    <span class="block opacity-80">
                      {{ i18n.t('tooltip.demo.statusDescription') }}
                    </span>
                  </sanring-tooltip-content>
                </sanring-tooltip>
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
export class TooltipPageComponent {
  protected readonly page = tooltipPage;
  protected readonly examples = tooltipPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
