import { Component, inject } from '@angular/core';
import { AspectRatioDirective } from '@sanring/ui';
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
import { aspectRatioPage, aspectRatioPageExamples } from './aspect-ratio.docs';

const mediaFrameClass =
  'h-full w-full rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] object-cover';

@Component({
  selector: 'app-aspect-ratio-page',
  imports: [
    AspectRatioDirective,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
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
          <div previewer class="mx-auto w-[min(520px,100%)]">
            <div sanringAspectRatio="16 / 9">
              <img
                alt="Abstract dashboard preview"
                [class]="mediaFrameClass"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              />
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
          componentName="aspect-ratio"
          manualSnippet="import { AspectRatioDirective } from './components/ui/aspect-ratio';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-media')">
            <app-component-page-code-previewer [code]="examples.media" language="angular-html">
              <div previewer class="mx-auto w-[min(560px,100%)]">
                <figure sanringAspectRatio="16 / 9">
                  <img
                    alt="Analytics dashboard preview"
                    [class]="mediaFrameClass"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                  />
                </figure>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-square')">
            <app-component-page-code-previewer [code]="examples.square" language="angular-html">
              <div previewer class="mx-auto w-[min(280px,100%)]">
                <div sanringAspectRatio>
                  <img
                    alt="Product thumbnail"
                    [class]="mediaFrameClass"
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                  />
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-card')">
            <app-component-page-code-previewer [code]="examples.card" language="angular-html">
              <div previewer class="mx-auto w-[min(360px,100%)]">
                <article class="grid gap-3">
                  <div sanringAspectRatio="4 / 3">
                    <img
                      alt="Component preview"
                      [class]="mediaFrameClass"
                      src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80"
                    />
                  </div>
                  <div>
                    <h3 class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t('aspectRatio.demo.cardTitle') }}
                    </h3>
                    <p class="mb-0 mt-1 text-sm text-[var(--docs-muted)]">
                      {{ i18n.t('aspectRatio.demo.cardBody') }}
                    </p>
                  </div>
                </article>
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
export class AspectRatioPageComponent {
  protected readonly page = aspectRatioPage;
  protected readonly examples = aspectRatioPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly mediaFrameClass = mediaFrameClass;

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
