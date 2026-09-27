import { Component, inject, signal } from '@angular/core';
import { LucideGripVertical } from '@lucide/angular';
import { SANRING_CARD_IMPORTS, SANRING_SORTABLE_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageKeyboardTableComponent,
  ComponentPageSectionComponent,
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { sortablePage, sortablePageExamples } from './sortable.docs';

interface SortableCard {
  id: string;
  titleKey: 'sortable.demo.alpha' | 'sortable.demo.beta' | 'sortable.demo.gamma';
  descriptionKey:
    | 'sortable.demo.alphaDescription'
    | 'sortable.demo.betaDescription'
    | 'sortable.demo.gammaDescription';
}

@Component({
  selector: 'app-sortable-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageKeyboardTableComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    LucideGripVertical,
    SANRING_CARD_IMPORTS,
    SANRING_SORTABLE_IMPORTS,
  ],
  template: `
    <app-component-page [sections]="page.sections" [componentId]="page.componentId">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
        [registryDeps]="page.registryDeps"
        [ssrSafe]="page.ssrSafe"
        [hasAccessibilityNotes]="true"
        [hasKeyboardSupport]="true"
        [stateModelLabel]="i18n.t('component.header.stateful')"
      />

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="sortable"
          manualSnippet="import { SANRING_SORTABLE_IMPORTS } from './components/ui/sortable';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports
            [code]="examples.usageImport"
            [individualCode]="examples.usageIndividualImports"
          />
          <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <app-component-page-code-block [code]="examples.composition" language="bash" />
      </app-component-page-section>

      <app-component-page-section [section]="section('examples')">
        <div class="grid gap-10">
          <app-component-page-section [section]="section('example-basic')">
            <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
              <div previewer class="grid w-[min(420px,100%)]">
                <sanring-sortable [data]="cards()" (sorted)="onCardsSorted($event)">
                  @for (card of cards(); track card.id) {
                    <div sanringSortableItem>
                      <sanring-card>
                        <sanring-card-header>
                          <h3 sanringCardTitle>{{ i18n.t(card.titleKey) }}</h3>
                          <p sanringCardDescription>{{ i18n.t(card.descriptionKey) }}</p>
                        </sanring-card-header>
                      </sanring-card>
                    </div>
                  }
                </sanring-sortable>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-handle')">
            <app-component-page-code-previewer [code]="examples.handle" language="angular-html">
              <div previewer class="grid w-[min(420px,100%)]">
                <sanring-sortable [data]="handled()" (sorted)="onHandledSorted($event)">
                  @for (card of handled(); track card.id) {
                    <div sanringSortableItem class="flex items-center gap-3">
                      <button
                        sanringSortableHandle
                        type="button"
                        class="inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sanring-radius-sm)] text-[var(--docs-muted)]"
                        [attr.aria-label]="i18n.t('sortable.demo.reorder')"
                      >
                        <svg lucideGripVertical class="size-4" aria-hidden="true"></svg>
                      </button>
                      <sanring-card class="min-w-0 flex-1">
                        <sanring-card-header>
                          <h3 sanringCardTitle>{{ i18n.t(card.titleKey) }}</h3>
                          <p sanringCardDescription>{{ i18n.t(card.descriptionKey) }}</p>
                        </sanring-card-header>
                      </sanring-card>
                    </div>
                  }
                </sanring-sortable>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <div previewer class="w-full max-w-xl">
                <sanring-sortable
                  orientation="horizontal"
                  [data]="chips()"
                  (sorted)="onChipsSorted($event)"
                >
                  @for (chip of chips(); track chip) {
                    <div
                      sanringSortableItem
                      class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-3 py-2 text-sm font-medium text-[var(--docs-fg)]"
                    >
                      {{ chip }}
                    </div>
                  }
                </sanring-sortable>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('accessibility')" />

      <app-component-page-section [section]="section('keyboard')">
        <app-component-page-keyboard-table [rows]="page.keyboardRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('stateModel')" />
    </app-component-page>
  `,
})
export class SortablePageComponent {
  protected readonly page = sortablePage;
  protected readonly examples = sortablePageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly cards = signal<SortableCard[]>([
    {
      id: 'alpha',
      titleKey: 'sortable.demo.alpha',
      descriptionKey: 'sortable.demo.alphaDescription',
    },
    {
      id: 'beta',
      titleKey: 'sortable.demo.beta',
      descriptionKey: 'sortable.demo.betaDescription',
    },
    {
      id: 'gamma',
      titleKey: 'sortable.demo.gamma',
      descriptionKey: 'sortable.demo.gammaDescription',
    },
  ]);

  protected readonly handled = signal<SortableCard[]>([
    {
      id: 'alpha',
      titleKey: 'sortable.demo.alpha',
      descriptionKey: 'sortable.demo.alphaDescription',
    },
    {
      id: 'beta',
      titleKey: 'sortable.demo.beta',
      descriptionKey: 'sortable.demo.betaDescription',
    },
    {
      id: 'gamma',
      titleKey: 'sortable.demo.gamma',
      descriptionKey: 'sortable.demo.gammaDescription',
    },
  ]);

  protected readonly chips = signal(['Design', 'Build', 'Review']);

  protected onCardsSorted(items: unknown[]): void {
    this.cards.set(items as SortableCard[]);
  }

  protected onHandledSorted(items: unknown[]): void {
    this.handled.set(items as SortableCard[]);
  }

  protected onChipsSorted(items: unknown[]): void {
    this.chips.set(items as string[]);
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
