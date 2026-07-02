import { Component, inject } from '@angular/core';
import { InfiniteScrollDirective, ScrollAreaComponent, ScrollAreaDirective } from '@sanring/ui';
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
import { scrollAreaPage, scrollAreaPageExamples } from './scroll-area.docs';

interface ScrollAreaDemoItem {
  id: number;
  title: string;
  description: string;
  meta: string;
}

@Component({
  selector: 'app-scroll-area-page',
  imports: [
    ComponentPageApiTableComponent,
    InfiniteScrollDirective,
    ScrollAreaComponent,
    ScrollAreaDirective,
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
          <div previewer class="flex w-full justify-center">
            <sanring-scroll-area
              class="h-64 w-[min(460px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)] p-4"
              orientation="vertical"
            >
              @for (item of compactItems; track item.id) {
                <article class="border-b border-[var(--docs-border)] py-3 last:border-0">
                  <div class="text-sm font-medium text-[var(--docs-fg)]">{{ item.title }}</div>
                  <div class="mt-1 text-xs text-[var(--docs-muted)]">{{ item.meta }}</div>
                </article>
              }
            </sanring-scroll-area>
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
          componentName="scroll-area"
          manualSnippet="import { InfiniteScrollDirective, ScrollAreaComponent, ScrollAreaDirective } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-basic')">
            <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <sanring-scroll-area
                  class="h-64 w-[min(460px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)] p-4"
                  orientation="vertical"
                >
                  @for (item of compactItems; track item.id) {
                    <article class="border-b border-[var(--docs-border)] py-3 last:border-0">
                      <div class="text-sm font-medium text-[var(--docs-fg)]">{{ item.title }}</div>
                      <div class="mt-1 text-xs text-[var(--docs-muted)]">{{ item.meta }}</div>
                    </article>
                  }
                </sanring-scroll-area>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-direction')">
            <app-component-page-code-previewer [code]="examples.direction" language="angular-html">
              <div previewer class="grid w-full min-w-0 justify-items-center overflow-hidden">
                <div class="grid w-full max-w-[640px] min-w-0 gap-4">
                  <sanring-scroll-area
                    class="h-48 w-full min-w-0 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)]"
                    orientation="horizontal"
                  >
                    <div class="flex w-max gap-3 p-4 pr-6">
                      @for (item of directionItems; track item.id) {
                        <article
                          class="w-48 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4"
                        >
                          <div class="text-xs uppercase text-[var(--docs-muted)]">{{ item.meta }}</div>
                          <h3 class="mb-0 mt-3 text-sm font-semibold text-[var(--docs-fg)]">
                            {{ item.title }}
                          </h3>
                          <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                            {{ item.description }}
                          </p>
                        </article>
                      }
                    </div>
                  </sanring-scroll-area>

                  <sanring-scroll-area
                    class="h-40 w-full min-w-0 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)]"
                    orientation="both"
                  >
                    <div class="grid w-[720px] grid-cols-6 gap-px bg-[var(--docs-border)] p-px">
                      @for (cell of matrixCells; track cell.id) {
                        <div class="bg-[var(--docs-panel)] px-3 py-2 text-sm text-[var(--docs-fg)]">
                          <div class="font-medium">{{ cell.title }}</div>
                          <div class="mt-1 text-xs text-[var(--docs-muted)]">{{ cell.meta }}</div>
                        </div>
                      }
                    </div>
                  </sanring-scroll-area>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-infinite')">
            <app-component-page-code-previewer [code]="examples.infinite" language="angular-html">
              <div previewer class="grid w-full justify-items-center gap-3">
                <div
                  sanringScrollArea
                  sanringInfiniteScroll
                  class="h-72 w-[min(520px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)] p-4"
                  (loadMore)="loadMore()"
                >
                  @for (item of visibleItems; track item.id) {
                    <article class="border-b border-[var(--docs-border)] py-4 last:border-0">
                      <div class="flex items-center justify-between gap-3">
                        <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                          {{ item.title }}
                        </h3>
                        <span class="shrink-0 text-xs text-[var(--docs-muted)]">
                          {{ item.meta }}
                        </span>
                      </div>
                      <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                        {{ item.description }}
                      </p>
                    </article>
                  }
                </div>

                <p class="m-0 text-xs text-[var(--docs-muted)]">
                  {{ i18n.t('scrollArea.demo.loaded') }} {{ visibleItems.length }} /
                  {{ feedItems.length }}
                </p>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-hide-scrollbar')">
            <app-component-page-code-previewer [code]="examples.hideScrollbar" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <sanring-scroll-area
                  class="h-64 w-[min(460px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)] p-4"
                  [hideScrollbar]="true"
                >
                  @for (item of compactItems; track item.id) {
                    <article class="border-b border-[var(--docs-border)] py-3 last:border-0">
                      <div class="text-sm font-medium text-[var(--docs-fg)]">{{ item.title }}</div>
                      <div class="mt-1 text-xs text-[var(--docs-muted)]">{{ item.meta }}</div>
                    </article>
                  }
                </sanring-scroll-area>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-custom-scrollbar')">
            <app-component-page-code-previewer [code]="examples.customScrollbar" language="angular-html">
              <div previewer class="flex w-full flex-wrap justify-center gap-4">
                <sanring-scroll-area
                  class="h-64 w-[min(200px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)] p-4"
                  style="--scrollbar-thumb: #6366f1"
                >
                  @for (item of compactItems; track item.id) {
                    <article class="border-b border-[var(--docs-border)] py-3 last:border-0">
                      <div class="text-sm font-medium text-[var(--docs-fg)]">{{ item.title }}</div>
                    </article>
                  }
                </sanring-scroll-area>

                <sanring-scroll-area
                  class="h-64 w-[min(200px,100%)] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-bg)] p-4"
                  style="--scrollbar-thumb: #94a3b8; --scrollbar-track: #f1f5f9"
                >
                  @for (item of compactItems; track item.id) {
                    <article class="border-b border-[var(--docs-border)] py-3 last:border-0">
                      <div class="text-sm font-medium text-[var(--docs-fg)]">{{ item.title }}</div>
                    </article>
                  }
                </sanring-scroll-area>
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
export class ScrollAreaPageComponent {
  protected readonly page = scrollAreaPage;
  protected readonly examples = scrollAreaPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly compactItems = this.createItems(12);
  protected readonly directionItems = this.createItems(8);
  protected readonly feedItems = this.createItems(18);
  protected readonly matrixCells = this.createItems(30);
  protected visibleCount = 8;

  protected get visibleItems() {
    return this.feedItems.slice(0, this.visibleCount);
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected loadMore() {
    this.visibleCount = Math.min(this.visibleCount + 4, this.feedItems.length);
  }

  private createItems(count: number): ScrollAreaDemoItem[] {
    return Array.from({ length: count }, (_, index) => {
      const id = index + 1;

      return {
        id,
        title: `${this.i18n.t('scrollArea.demo.item')} ${id}`,
        description: this.i18n.t('scrollArea.demo.itemDescription'),
        meta: `${id.toString().padStart(2, '0')}:00`,
      };
    });
  }
}
