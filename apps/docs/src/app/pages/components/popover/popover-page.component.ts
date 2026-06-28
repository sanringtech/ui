import { Component, inject } from '@angular/core';
import {
  ButtonDirective,
  PopoverComponent,
  PopoverContentComponent,
  PopoverDescriptionComponent,
  PopoverHeaderComponent,
  PopoverTitleComponent,
  PopoverTriggerDirective,
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
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { popoverPage, popoverPageExamples } from './popover.docs';

@Component({
  selector: 'app-popover-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ButtonDirective,
    PopoverComponent,
    PopoverContentComponent,
    PopoverHeaderComponent,
    PopoverTitleComponent,
    PopoverDescriptionComponent,
    PopoverTriggerDirective,
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
          <div previewer class="flex min-h-[180px] items-start justify-center pt-8">
            <sanring-popover>
              <button sanringBtn sanringPopoverTrigger>Open popover</button>
              <sanring-popover-content>
                <sanring-popover-header>
                  <sanring-popover-title>Dimensions</sanring-popover-title>
                  <sanring-popover-description>
                    Set the dimensions for the layer.
                  </sanring-popover-description>
                </sanring-popover-header>
                <p class="m-0 mt-2 text-sm text-[var(--docs-muted)]">
                  Popover body content goes here.
                </p>
              </sanring-popover-content>
            </sanring-popover>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <!-- Usage -->
      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <!-- Installation -->
      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="popover"
          manualSnippet="import { SANRING_POPOVER_IMPORTS } from '@sanring/ui';"
        />
      </app-component-page-section>

      <!-- Composition -->
      <app-component-page-section [section]="section('composition')">
        <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <!-- Examples -->
      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">

          <!-- Align -->
          <app-component-page-section [section]="section('example-align')">
            <app-component-page-code-previewer [code]="examples.align" language="angular-html">
              <div previewer class="flex min-h-[200px] flex-wrap items-center justify-center gap-3 pt-6">

                @for (align of aligns; track align) {
                  <sanring-popover [align]="align">
                    <button sanringBtn size="sm" variant="outline" sanringPopoverTrigger>
                      {{ align }}
                    </button>
                    <sanring-popover-content>
                      <p class="m-0 text-sm font-medium">Align: {{ align }}</p>
                      <p class="m-0 mt-1 text-xs text-[var(--docs-muted)]">Placement: bottom</p>
                    </sanring-popover-content>
                  </sanring-popover>
                }

              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- With Header (profile card) -->
          <app-component-page-section [section]="section('example-with-header')">
            <app-component-page-code-previewer [code]="examples.withHeader" language="angular-html">
              <div previewer class="flex min-h-[180px] items-start justify-center pt-8">
                <sanring-popover>
                  <button sanringBtn variant="outline" sanringPopoverTrigger>
                    {{ i18n.t('popover.demo.profile') }}
                  </button>
                  <sanring-popover-content>
                    <sanring-popover-header>
                      <sanring-popover-title>Jane Appleseed</sanring-popover-title>
                      <sanring-popover-description>
                        {{ i18n.t('popover.demo.profileEmail') }}
                      </sanring-popover-description>
                    </sanring-popover-header>
                    <div class="mt-3 flex gap-2">
                      <button sanringBtn size="sm" variant="outline" class="flex-1">Message</button>
                      <button sanringBtn size="sm" class="flex-1">Follow</button>
                    </div>
                  </sanring-popover-content>
                </sanring-popover>
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
export class PopoverPageComponent {
  protected readonly page     = popoverPage;
  protected readonly examples = popoverPageExamples;
  protected readonly i18n     = inject(I18nService);

  protected readonly aligns = ['start', 'center', 'end'] as const;

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
