import { Component, inject, signal } from '@angular/core';
import {
  ButtonDirective,
  CollapsibleComponent,
  CollapsibleContentDirective,
  CollapsibleTriggerDirective,
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
import { collapsiblePage, collapsiblePageExamples } from './collapsible.docs';

@Component({
  selector: 'app-collapsible-page',
  imports: [
    ButtonDirective,
    CollapsibleComponent,
    CollapsibleContentDirective,
    CollapsibleTriggerDirective,
    ComponentPageApiTableComponent,
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

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="collapsible"
          manualSnippet="import { CollapsibleComponent, CollapsibleContentDirective, CollapsibleTriggerDirective } from '@sanring/ui';"
        />
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

      <app-component-page-section [section]="section('composition')">
        <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('controlled-state')">
        <app-component-page-code-previewer [code]="examples.controlledState" language="angular-html">
          <div previewer class="grid w-[min(520px,100%)] gap-4">
            <div class="flex justify-end">
              <button sanringBtn type="button" variant="outline" size="sm" (click)="controlledOpen.update(open => !open)">
                {{ controlledOpen() ? i18n.t('collapsible.demo.close') : i18n.t('collapsible.demo.open') }}
              </button>
            </div>

            <sanring-collapsible [(open)]="controlledOpen">
              <button
                sanringBtn
                sanringCollapsibleTrigger
                type="button"
                variant="ghost"
                class="w-full justify-between"
              >
                <span>{{ i18n.t('collapsible.demo.advancedOptions') }}</span>
                <span class="text-xs text-[var(--docs-muted)]">{{ controlledOpen() ? '-' : '+' }}</span>
              </button>
              <div sanringCollapsibleContent class="px-3 pb-3 pt-2 text-sm leading-6 text-[var(--docs-muted)]">
                {{ i18n.t('collapsible.demo.controlledContent') }}
              </div>
            </sanring-collapsible>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('examples')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-basic')">
            <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-collapsible>
                  <button
                    sanringBtn
                    sanringCollapsibleTrigger
                    type="button"
                    variant="ghost"
                    class="w-full justify-between"
                  >
                    <span>{{ i18n.t('collapsible.demo.basicQuestion') }}</span>
                    <span class="text-xs text-[var(--docs-muted)]">+</span>
                  </button>
                  <div sanringCollapsibleContent class="px-3 pb-3 pt-2 text-sm leading-6 text-[var(--docs-muted)]">
                    {{ i18n.t('collapsible.demo.basicAnswer') }}
                  </div>
                </sanring-collapsible>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-settings-panel')">
            <app-component-page-code-previewer [code]="examples.settingsPanel" language="angular-html">
              <div previewer class="w-[min(560px,100%)]">
                <sanring-collapsible [open]="true" class="block rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)]">
                  <button
                    sanringBtn
                    sanringCollapsibleTrigger
                    type="button"
                    variant="ghost"
                    class="w-full justify-between rounded-b-none"
                  >
                    <span>{{ i18n.t('collapsible.demo.workspacePreferences') }}</span>
                    <span class="text-xs text-[var(--docs-muted)]">-</span>
                  </button>
                  <div sanringCollapsibleContent class="grid gap-3 border-t border-[var(--docs-border)] p-4">
                    @for (setting of settings; track setting.id) {
                      <label class="flex items-start gap-3 text-sm text-[var(--docs-fg)]">
                        <input class="mt-1" type="checkbox" [checked]="setting.checked" />
                        <span class="grid gap-1">
                          <span class="font-medium">{{ setting.label }}</span>
                          <span class="text-[var(--docs-muted)]">{{ setting.description }}</span>
                        </span>
                      </label>
                    }
                  </div>
                </sanring-collapsible>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-file-tree')">
            <app-component-page-code-previewer [code]="examples.fileTree" language="angular-html">
              <div previewer class="w-[min(360px,100%)]">
                <sanring-collapsible [open]="true" class="block font-mono text-sm">
                  <button
                    sanringCollapsibleTrigger
                    type="button"
                    class="flex w-full items-center gap-2 rounded-[var(--sanring-radius-sm)] px-2 py-1.5 text-left hover:bg-[var(--docs-hover)]"
                  >
                    <span class="text-[var(--docs-muted)]">-</span>
                    <span>src</span>
                  </button>
                  <div sanringCollapsibleContent class="grid gap-1 border-l border-[var(--docs-border)] ms-4 ps-4">
                    @for (node of fileTree; track node) {
                      <div class="rounded px-2 py-1 text-[var(--docs-muted)]">{{ node }}</div>
                    }
                  </div>
                </sanring-collapsible>
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
export class CollapsiblePageComponent {
  protected readonly page = collapsiblePage;
  protected readonly examples = collapsiblePageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly controlledOpen = signal(true);

  protected get settings() {
    return [
      {
        id: 'digest',
        label: this.i18n.t('collapsible.demo.weeklyDigest'),
        description: this.i18n.t('collapsible.demo.weeklyDigestDescription'),
        checked: true,
      },
      {
        id: 'review',
        label: this.i18n.t('collapsible.demo.requireReview'),
        description: this.i18n.t('collapsible.demo.requireReviewDescription'),
        checked: false,
      },
    ];
  }

  protected readonly fileTree = ['components', 'lib', 'main.ts'];

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
