import { Component, inject } from '@angular/core';
import { LucideX } from '@lucide/angular';
import {
  ButtonDirective,
  InputDirective,
  LabelDirective,
  SANRING_SHEET_IMPORTS,
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
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { sheetPage, sheetPageExamples } from './sheet.docs';

@Component({
  selector: 'app-sheet-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    ButtonDirective,
    InputDirective,
    LabelDirective,
    SANRING_SHEET_IMPORTS,
    LucideX,
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
          <div previewer class="flex items-center justify-center">
            <sanring-sheet>
              <button sanringBtn sanringSheetTrigger>
                {{ i18n.t('sheet.demo.open') }}
              </button>
              <sanring-sheet-content>
                <button
                  type="button"
                  sanringSheetClose
                  aria-label="Close"
                  class="absolute right-4 top-4 rounded-[var(--sanring-radius-xs)] p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                >
                  <svg lucideX class="size-4"></svg>
                </button>
                <sanring-sheet-header>
                  <sanring-sheet-title>{{ i18n.t('sheet.demo.editProfile') }}</sanring-sheet-title>
                  <sanring-sheet-description>
                    {{ i18n.t('sheet.demo.editProfileDescription') }}
                  </sanring-sheet-description>
                </sanring-sheet-header>
                <p class="text-sm text-[var(--docs-muted)]">Sheet body content goes here.</p>
                <sanring-sheet-footer>
                  <button sanringBtn variant="outline" sanringSheetClose class="w-full">
                    {{ i18n.t('sheet.demo.cancel') }}
                  </button>
                  <button sanringBtn sanringSheetClose class="w-full">
                    {{ i18n.t('sheet.demo.saveChanges') }}
                  </button>
                </sanring-sheet-footer>
              </sanring-sheet-content>
            </sanring-sheet>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <!-- Usage -->
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

      <!-- Installation -->
      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="sheet"
          manualSnippet="import { SANRING_SHEET_IMPORTS } from './components/ui/sheet';"
        />
      </app-component-page-section>

      <!-- Composition -->
      <app-component-page-section [section]="section('composition')">
        <div
          class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <!-- Examples -->
      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <!-- Side -->
          <app-component-page-section [section]="section('example-side')">
            <app-component-page-code-previewer [code]="examples.side" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <sanring-sheet>
                  <button sanringBtn size="sm" variant="outline" sanringSheetTrigger>
                    {{ i18n.t('sheet.demo.openTop') }}
                  </button>
                  <sanring-sheet-content side="top">
                    <button
                      type="button"
                      sanringSheetClose
                      aria-label="Close"
                      class="absolute right-4 top-4 rounded-[var(--sanring-radius-xs)] p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                    >
                      <svg lucideX class="size-4"></svg>
                    </button>
                    <sanring-sheet-header>
                      <sanring-sheet-title>Top Sheet</sanring-sheet-title>
                      <sanring-sheet-description
                        >Slides in from the top edge.</sanring-sheet-description
                      >
                    </sanring-sheet-header>
                    <div
                      class="flex-1 overflow-y-auto text-sm leading-relaxed text-[var(--docs-muted)]"
                    >
                      <p class="mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <p>
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                    </div>
                    <sanring-sheet-footer>
                      <button sanringBtn sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.saveChanges') }}
                      </button>
                      <button sanringBtn variant="outline" sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.cancel') }}
                      </button>
                    </sanring-sheet-footer>
                  </sanring-sheet-content>
                </sanring-sheet>

                <sanring-sheet>
                  <button sanringBtn size="sm" variant="outline" sanringSheetTrigger>
                    {{ i18n.t('sheet.demo.openRight') }}
                  </button>
                  <sanring-sheet-content side="right">
                    <button
                      type="button"
                      sanringSheetClose
                      aria-label="Close"
                      class="absolute right-4 top-4 rounded-[var(--sanring-radius-xs)] p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                    >
                      <svg lucideX class="size-4"></svg>
                    </button>
                    <sanring-sheet-header>
                      <sanring-sheet-title>Right Sheet</sanring-sheet-title>
                      <sanring-sheet-description
                        >Slides in from the right edge.</sanring-sheet-description
                      >
                    </sanring-sheet-header>
                    <div
                      class="flex-1 overflow-y-auto text-sm leading-relaxed text-[var(--docs-muted)]"
                    >
                      <p class="mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                      </p>
                      <p class="mb-3">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                    <sanring-sheet-footer>
                      <button sanringBtn sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.saveChanges') }}
                      </button>
                      <button sanringBtn variant="outline" sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.cancel') }}
                      </button>
                    </sanring-sheet-footer>
                  </sanring-sheet-content>
                </sanring-sheet>

                <sanring-sheet>
                  <button sanringBtn size="sm" variant="outline" sanringSheetTrigger>
                    {{ i18n.t('sheet.demo.openBottom') }}
                  </button>
                  <sanring-sheet-content side="bottom">
                    <button
                      type="button"
                      sanringSheetClose
                      aria-label="Close"
                      class="absolute right-4 top-4 rounded-[var(--sanring-radius-xs)] p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                    >
                      <svg lucideX class="size-4"></svg>
                    </button>
                    <sanring-sheet-header>
                      <sanring-sheet-title>Bottom Sheet</sanring-sheet-title>
                      <sanring-sheet-description
                        >Slides in from the bottom edge.</sanring-sheet-description
                      >
                    </sanring-sheet-header>
                    <div
                      class="flex-1 overflow-y-auto text-sm leading-relaxed text-[var(--docs-muted)]"
                    >
                      <p class="mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <p>
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                    </div>
                    <sanring-sheet-footer>
                      <button sanringBtn sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.saveChanges') }}
                      </button>
                      <button sanringBtn variant="outline" sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.cancel') }}
                      </button>
                    </sanring-sheet-footer>
                  </sanring-sheet-content>
                </sanring-sheet>

                <sanring-sheet>
                  <button sanringBtn size="sm" variant="outline" sanringSheetTrigger>
                    {{ i18n.t('sheet.demo.openLeft') }}
                  </button>
                  <sanring-sheet-content side="left">
                    <button
                      type="button"
                      sanringSheetClose
                      aria-label="Close"
                      class="absolute right-4 top-4 rounded-[var(--sanring-radius-xs)] p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                    >
                      <svg lucideX class="size-4"></svg>
                    </button>
                    <sanring-sheet-header>
                      <sanring-sheet-title>Left Sheet</sanring-sheet-title>
                      <sanring-sheet-description
                        >Slides in from the left edge.</sanring-sheet-description
                      >
                    </sanring-sheet-header>
                    <div
                      class="flex-1 overflow-y-auto text-sm leading-relaxed text-[var(--docs-muted)]"
                    >
                      <p class="mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                      </p>
                      <p class="mb-3">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                    <sanring-sheet-footer>
                      <button sanringBtn sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.saveChanges') }}
                      </button>
                      <button sanringBtn variant="outline" sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.cancel') }}
                      </button>
                    </sanring-sheet-footer>
                  </sanring-sheet-content>
                </sanring-sheet>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- With Form -->
          <app-component-page-section [section]="section('example-with-form')">
            <app-component-page-code-previewer [code]="examples.withForm" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <sanring-sheet>
                  <button sanringBtn sanringSheetTrigger>
                    {{ i18n.t('sheet.demo.editProfile') }}
                  </button>
                  <sanring-sheet-content side="right">
                    <button
                      type="button"
                      sanringSheetClose
                      aria-label="Close"
                      class="absolute right-4 top-4 rounded-[var(--sanring-radius-xs)] p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                    >
                      <svg lucideX class="size-4"></svg>
                    </button>
                    <sanring-sheet-header>
                      <sanring-sheet-title>{{
                        i18n.t('sheet.demo.editProfile')
                      }}</sanring-sheet-title>
                      <sanring-sheet-description>
                        {{ i18n.t('sheet.demo.editProfileDescription') }}
                      </sanring-sheet-description>
                    </sanring-sheet-header>
                    <form class="grid gap-4">
                      <div class="grid gap-1.5">
                        <label sanringLabel for="sheet-name">{{ i18n.t('sheet.demo.name') }}</label>
                        <input sanringInput id="sheet-name" placeholder="Pedro Duarte" />
                      </div>
                      <div class="grid gap-1.5">
                        <label sanringLabel for="sheet-username">{{
                          i18n.t('sheet.demo.username')
                        }}</label>
                        <input sanringInput id="sheet-username" placeholder="@peduarte" />
                      </div>
                    </form>
                    <sanring-sheet-footer>
                      <button sanringBtn sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.saveChanges') }}
                      </button>
                      <button sanringBtn variant="outline" sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.cancel') }}
                      </button>
                    </sanring-sheet-footer>
                  </sanring-sheet-content>
                </sanring-sheet>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- No Close Button -->
          <app-component-page-section [section]="section('example-no-close')">
            <app-component-page-code-previewer [code]="examples.noClose" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <sanring-sheet>
                  <button sanringBtn variant="destructive" sanringSheetTrigger>
                    {{ i18n.t('sheet.demo.delete') }}…
                  </button>
                  <sanring-sheet-content>
                    <sanring-sheet-header>
                      <sanring-sheet-title>{{
                        i18n.t('sheet.demo.confirmDelete')
                      }}</sanring-sheet-title>
                      <sanring-sheet-description>
                        {{ i18n.t('sheet.demo.confirmDeleteDescription') }}
                      </sanring-sheet-description>
                    </sanring-sheet-header>
                    <sanring-sheet-footer>
                      <button sanringBtn variant="outline" sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.cancel') }}
                      </button>
                      <button sanringBtn variant="destructive" sanringSheetClose class="w-full">
                        {{ i18n.t('sheet.demo.delete') }}
                      </button>
                    </sanring-sheet-footer>
                  </sanring-sheet-content>
                </sanring-sheet>
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
export class SheetPageComponent {
  protected readonly page = sheetPage;
  protected readonly examples = sheetPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
