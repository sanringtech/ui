import { Component, inject } from '@angular/core';
import { ButtonDirective, SANRING_HOVER_CARD_IMPORTS } from '@sanring/ui';
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
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { hoverCardPage, hoverCardPageExamples } from './hover-card.docs';

@Component({
  selector: 'app-hover-card-page',
  imports: [
    ButtonDirective,
    SANRING_HOVER_CARD_IMPORTS,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
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
          <div previewer class="flex min-h-[220px] items-start justify-center pt-12">
            <sanring-hover-card>
              <button sanringBtn type="button" variant="link" sanringHoverCardTrigger>
                {{ i18n.t('hoverCard.demo.trigger') }}
              </button>

              <sanring-hover-card-content>
                <div class="space-y-3">
                  <div>
                    <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                      Sanring UI
                    </h3>
                    <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">
                      {{ i18n.t('hoverCard.demo.description') }}
                    </p>
                  </div>
                  <div class="flex gap-2 text-xs text-[var(--docs-muted)]">
                    <span class="rounded-[var(--sanring-radius-xs)] bg-[var(--docs-surface-strong)] px-2 py-1">
                      Angular
                    </span>
                    <span class="rounded-[var(--sanring-radius-xs)] bg-[var(--docs-surface-strong)] px-2 py-1">
                      Primitives
                    </span>
                  </div>
                </div>
              </sanring-hover-card-content>
            </sanring-hover-card>
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
          componentName="hover-card"
          manualSnippet="import { SANRING_HOVER_CARD_IMPORTS } from '@sanring/ui';"
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
          <app-component-page-section [section]="section('example-side')">
            <app-component-page-code-previewer [code]="examples.side" language="angular-html">
              <div previewer class="flex min-h-[280px] flex-wrap items-center justify-center gap-3">
                @for (side of sides; track side) {
                  <sanring-hover-card [openDelay]="150" [closeDelay]="250">
                    <button sanringBtn type="button" size="sm" variant="outline" sanringHoverCardTrigger>
                      {{ side }}
                    </button>
                    <sanring-hover-card-content [side]="side">
                      <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                        {{ side }}
                      </p>
                      <p class="m-0 mt-1 text-sm text-[var(--docs-muted)]">
                        {{ i18n.t('hoverCard.demo.sideDescription') }}
                      </p>
                    </sanring-hover-card-content>
                  </sanring-hover-card>
                }
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-delay')">
            <app-component-page-code-previewer [code]="examples.delay" language="angular-html">
              <div previewer class="flex min-h-[220px] items-start justify-center gap-3 pt-12">
                <sanring-hover-card [openDelay]="150" [closeDelay]="500">
                  <button sanringBtn type="button" variant="outline" sanringHoverCardTrigger>
                    {{ i18n.t('hoverCard.demo.fastOpen') }}
                  </button>
                  <sanring-hover-card-content>
                    <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t('hoverCard.demo.fastOpen') }}
                    </p>
                    <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">
                      {{ i18n.t('hoverCard.demo.delayDescription') }}
                    </p>
                  </sanring-hover-card-content>
                </sanring-hover-card>
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
export class HoverCardPageComponent {
  protected readonly page = hoverCardPage;
  protected readonly examples = hoverCardPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly sides = ['top', 'right', 'bottom', 'left'] as const;

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
