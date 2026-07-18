import { Component, inject } from '@angular/core';
import {
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronUp,
} from '@lucide/angular';
import { ButtonDirective, SANRING_CAROUSEL_IMPORTS } from '@sanring/ui';
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
import { carouselPage, carouselPageExamples } from './carousel.docs';

@Component({
  selector: 'app-carousel-page',
  imports: [
    ButtonDirective,
    SANRING_CAROUSEL_IMPORTS,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronUp,
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
          <div previewer class="w-[min(520px,100%)]">
            <sanring-carousel [ariaLabel]="i18n.t('carousel.demo.featured')">
              <div class="flex items-center gap-3">
                <button
                  sanringBtn
                  sanringCarouselPrevious
                  type="button"
                  variant="outline"
                  size="icon"
                  class="shrink-0 rounded-full"
                  [attr.aria-label]="i18n.t('carousel.demo.previous')"
                >
                  <svg lucideChevronLeft class="size-4"></svg>
                </button>

                <sanring-carousel-content class="min-w-0 flex-1">
                  @for (slide of slides; track slide.title) {
                    <sanring-carousel-item>
                      <div
                        class="grid aspect-[16/9] place-items-center rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-6 text-center"
                      >
                        <div>
                          <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                            {{ slide.title }}
                          </p>
                          <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                            {{ slide.description }}
                          </p>
                        </div>
                      </div>
                    </sanring-carousel-item>
                  }
                </sanring-carousel-content>

                <button
                  sanringBtn
                  sanringCarouselNext
                  type="button"
                  variant="outline"
                  size="icon"
                  class="shrink-0 rounded-full"
                  [attr.aria-label]="i18n.t('carousel.demo.next')"
                >
                  <svg lucideChevronRight class="size-4"></svg>
                </button>
              </div>
            </sanring-carousel>
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
          componentName="carousel"
          manualSnippet="import { SANRING_CAROUSEL_IMPORTS } from './components/ui/carousel';"
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
          <app-component-page-section [section]="section('example-sizes')">
            <app-component-page-code-previewer [code]="examples.sizes" language="angular-html">
              <div previewer class="w-[min(680px,100%)]">
                <sanring-carousel [ariaLabel]="i18n.t('carousel.demo.sizesLabel')">
                  <div class="flex items-center gap-3">
                    <button
                      sanringBtn
                      sanringCarouselPrevious
                      type="button"
                      variant="outline"
                      size="icon"
                      class="shrink-0 rounded-full"
                      [attr.aria-label]="i18n.t('carousel.demo.previous')"
                    >
                      <svg lucideChevronLeft class="size-4"></svg>
                    </button>

                    <sanring-carousel-content class="min-w-0 flex-1">
                      @for (slide of cards; track slide.title) {
                        <sanring-carousel-item class="basis-1/3">
                          <div
                            class="min-h-36 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"
                          >
                            <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                              {{ slide.title }}
                            </p>
                            <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                              {{ slide.description }}
                            </p>
                          </div>
                        </sanring-carousel-item>
                      }
                    </sanring-carousel-content>

                    <button
                      sanringBtn
                      sanringCarouselNext
                      type="button"
                      variant="outline"
                      size="icon"
                      class="shrink-0 rounded-full"
                      [attr.aria-label]="i18n.t('carousel.demo.next')"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                  </div>
                </sanring-carousel>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-multiple')">
            <app-component-page-code-previewer [code]="examples.multiple" language="angular-html">
              <div previewer class="w-[min(680px,100%)]">
                <sanring-carousel
                  [ariaLabel]="i18n.t('carousel.demo.teamHighlights')"
                  [opts]="{ align: 'start' }"
                >
                  <div class="flex items-center gap-3">
                    <button
                      sanringBtn
                      sanringCarouselPrevious
                      type="button"
                      variant="outline"
                      size="icon"
                      class="shrink-0 rounded-full"
                      [attr.aria-label]="i18n.t('carousel.demo.previous')"
                    >
                      <svg lucideChevronLeft class="size-4"></svg>
                    </button>

                    <sanring-carousel-content class="min-w-0 flex-1">
                      @for (slide of cards; track slide.title) {
                        <sanring-carousel-item class="basis-full sm:basis-1/2 lg:basis-1/3">
                          <div
                            class="min-h-36 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"
                          >
                            <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                              {{ slide.title }}
                            </p>
                            <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                              {{ slide.description }}
                            </p>
                          </div>
                        </sanring-carousel-item>
                      }
                    </sanring-carousel-content>

                    <button
                      sanringBtn
                      sanringCarouselNext
                      type="button"
                      variant="outline"
                      size="icon"
                      class="shrink-0 rounded-full"
                      [attr.aria-label]="i18n.t('carousel.demo.next')"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                  </div>
                </sanring-carousel>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-vertical')">
            <app-component-page-code-previewer [code]="examples.vertical" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-carousel
                  orientation="vertical"
                  [ariaLabel]="i18n.t('carousel.demo.releaseNotes')"
                  class="mx-auto max-w-sm"
                >
                  <div class="flex flex-col items-center gap-3">
                    <button
                      sanringBtn
                      sanringCarouselPrevious
                      type="button"
                      variant="outline"
                      size="icon"
                      class="shrink-0 rounded-full"
                      [attr.aria-label]="i18n.t('carousel.demo.previous')"
                    >
                      <svg lucideChevronUp class="size-4"></svg>
                    </button>

                    <sanring-carousel-content class="h-64 w-full">
                      @for (note of notes; track note.title) {
                        <sanring-carousel-item>
                          <div
                            class="grid h-64 place-items-center rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-6 text-center"
                          >
                            <div>
                              <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                                {{ note.title }}
                              </p>
                              <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                                {{ note.description }}
                              </p>
                            </div>
                          </div>
                        </sanring-carousel-item>
                      }
                    </sanring-carousel-content>

                    <button
                      sanringBtn
                      sanringCarouselNext
                      type="button"
                      variant="outline"
                      size="icon"
                      class="shrink-0 rounded-full"
                      [attr.aria-label]="i18n.t('carousel.demo.next')"
                    >
                      <svg lucideChevronDown class="size-4"></svg>
                    </button>
                  </div>
                </sanring-carousel>
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
export class CarouselPageComponent {
  protected readonly page = carouselPage;
  protected readonly examples = carouselPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly slides = [
    {
      title: 'Launch plan',
      description: 'Coordinate product, docs, and release tasks in one pass.',
    },
    {
      title: 'Design review',
      description: 'Keep visual states close while evaluating the next item.',
    },
    {
      title: 'QA window',
      description: 'Move through short summaries without leaving the context.',
    },
  ];

  protected readonly cards = [
    { title: 'Identity', description: 'Brand, copy, and interface tone.' },
    { title: 'System', description: 'Reusable primitives for product teams.' },
    { title: 'Delivery', description: 'Release notes and changelog workflow.' },
    { title: 'Support', description: 'Feedback loops and issue triage.' },
  ];

  protected readonly notes = [
    { title: 'Version 1.2', description: 'Navigation and overlay refinements.' },
    { title: 'Version 1.1', description: 'New data display primitives.' },
    { title: 'Version 1.0', description: 'Initial component foundation.' },
  ];

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
