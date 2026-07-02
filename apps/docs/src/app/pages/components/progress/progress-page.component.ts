import { Component, inject } from '@angular/core';
import { ProgressComponent } from '@sanring/ui';
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
import { progressPage, progressPageExamples } from './progress.docs';

@Component({
  selector: 'app-progress-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ProgressComponent,
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
          <div previewer class="flex w-full max-w-sm items-center justify-center px-4">
            <sanring-progress [value]="60" ariaLabel="Loading" class="w-full" />
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <!-- Usage -->
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

      <!-- Installation -->
      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="progress"
          manualSnippet="import { ProgressComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <!-- Examples -->
      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">

          <!-- Q1: Shimmer sprint effect -->
          <app-component-page-section [section]="section('example-shimmer')">
            <p class="mb-4 text-sm text-[var(--docs-muted)]">
              {{ i18n.t('progress.demo.shimmerDescription') }}
            </p>
            <app-component-page-code-previewer [code]="examples.shimmer" language="angular-html">
              <div previewer class="flex w-full max-w-sm flex-col gap-4 px-4">
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">shimmer off</span>
                  <sanring-progress [value]="70" ariaLabel="No shimmer" class="w-full" />
                </div>
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">shimmer on</span>
                  <sanring-progress [value]="70" shimmer ariaLabel="Uploading…" class="w-full" />
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Q2: Shape -->
          <app-component-page-section [section]="section('example-shape')">
            <p class="mb-4 text-sm text-[var(--docs-muted)]">
              {{ i18n.t('progress.demo.shapeDescription') }}
            </p>
            <app-component-page-code-previewer [code]="examples.shape" language="angular-html">
              <div previewer class="flex w-full max-w-sm flex-col gap-4 px-4">
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">
                    {{ i18n.t('progress.demo.rounded') }}
                  </span>
                  <sanring-progress [value]="60" ariaLabel="Rounded" class="w-full" />
                </div>
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">
                    {{ i18n.t('progress.demo.square') }}
                  </span>
                  <sanring-progress [value]="60" shape="square" ariaLabel="Square" class="w-full" />
                </div>
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">
                    {{ i18n.t('progress.demo.trapezoid') }}
                  </span>
                  <sanring-progress [value]="60" shape="trapezoid" ariaLabel="Trapezoid" class="w-full" />
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Q3: Color -->
          <app-component-page-section [section]="section('example-color')">
            <p class="mb-4 text-sm text-[var(--docs-muted)]">
              {{ i18n.t('progress.demo.colorDescription') }}
            </p>
            <app-component-page-code-previewer [code]="examples.color" language="angular-html">
              <div previewer class="flex w-full max-w-sm flex-col gap-4 px-4">
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">
                    {{ i18n.t('progress.demo.defaultColor') }}
                  </span>
                  <sanring-progress [value]="60" ariaLabel="Default colour" class="w-full" />
                </div>
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">
                    {{ i18n.t('progress.demo.cssVarOverride') }}
                  </span>
                  <sanring-progress
                    [value]="60"
                    style="--sanring-progress-bar: #8b5cf6"
                    ariaLabel="Purple via CSS var"
                    class="w-full"
                  />
                </div>
                <div class="grid gap-1.5">
                  <span class="text-xs text-[var(--docs-muted)]">
                    {{ i18n.t('progress.demo.classOverride') }}
                  </span>
                  <sanring-progress
                    [value]="60"
                    barClass="bg-emerald-500"
                    ariaLabel="Green via barClass"
                    class="w-full"
                  />
                </div>
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
export class ProgressPageComponent {
  protected readonly page = progressPage;
  protected readonly examples = progressPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
