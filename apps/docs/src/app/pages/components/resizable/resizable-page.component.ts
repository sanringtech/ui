import { Component, inject } from '@angular/core';
import {
  ResizableGroupComponent,
  ResizableHandleComponent,
  ResizablePanelComponent,
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
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { resizablePage, resizablePageExamples } from './resizable.docs';

@Component({
  selector: 'app-resizable-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
    ResizableGroupComponent,
    ResizableHandleComponent,
    ResizablePanelComponent,
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
          <div previewer class="h-64 w-full max-w-3xl px-4">
            <sanring-resizable-group
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--sanring-surface)]"
            >
              <sanring-resizable-panel
                [defaultSize]="28"
                [minSize]="18"
                class="bg-[var(--sanring-surface-muted)]"
              >
                <div class="grid h-full content-start gap-2 p-4">
                  <span class="text-sm font-medium text-[var(--docs-fg)]">
                    {{ i18n.t('resizable.demo.navigation') }}
                  </span>
                  <div class="h-2 rounded bg-[var(--sanring-border)]"></div>
                  <div class="h-2 w-2/3 rounded bg-[var(--sanring-border)]"></div>
                  <div class="h-2 w-4/5 rounded bg-[var(--sanring-border)]"></div>
                </div>
              </sanring-resizable-panel>
              <sanring-resizable-handle [withHandle]="true" />
              <sanring-resizable-panel [defaultSize]="72" [minSize]="35">
                <div class="grid h-full grid-rows-[auto_1fr] gap-3 p-4">
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t('resizable.demo.editor') }}
                    </span>
                    <span class="text-xs text-[var(--docs-muted)]">
                      {{ i18n.t('resizable.demo.dragHint') }}
                    </span>
                  </div>
                  <div
                    class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4 font-mono text-xs leading-6 text-[var(--docs-muted)]"
                  >
                    <div>const layout = createResizableGroup();</div>
                    <div>layout.persist(sizes);</div>
                    <div>layout.restore();</div>
                  </div>
                </div>
              </sanring-resizable-panel>
            </sanring-resizable-group>
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
          componentName="resizable"
          manualSnippet="import { ResizableGroupComponent, ResizableHandleComponent, ResizablePanelComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-vertical')">
            <app-component-page-code-previewer [code]="examples.vertical" language="angular-html">
              <div previewer class="h-72 w-full max-w-3xl px-4">
                <sanring-resizable-group
                  direction="vertical"
                  class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--sanring-surface)]"
                >
                  <sanring-resizable-panel [defaultSize]="62" [minSize]="35">
                    <div class="grid h-full place-items-center p-4">
                      <div class="text-center">
                        <div class="text-sm font-medium text-[var(--docs-fg)]">
                          {{ i18n.t('resizable.demo.preview') }}
                        </div>
                        <div class="mt-1 text-xs text-[var(--docs-muted)]">
                          {{ i18n.t('resizable.demo.previewHint') }}
                        </div>
                      </div>
                    </div>
                  </sanring-resizable-panel>
                  <sanring-resizable-handle [withHandle]="true" />
                  <sanring-resizable-panel
                    [defaultSize]="38"
                    [minSize]="20"
                    class="bg-[var(--docs-surface)]"
                  >
                    <div class="h-full p-4 font-mono text-xs leading-6 text-[var(--docs-muted)]">
                      <div>{{ i18n.t('resizable.demo.consoleReady') }}</div>
                      <div>{{ i18n.t('resizable.demo.consoleResize') }}</div>
                    </div>
                  </sanring-resizable-panel>
                </sanring-resizable-group>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-controlled')">
            <app-component-page-code-previewer [code]="examples.controlled" language="angular-html">
              <div previewer class="grid w-full max-w-3xl gap-3 px-4">
                <div class="h-64">
                  <sanring-resizable-group
                    class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--sanring-surface)]"
                    [(sizes)]="layoutSizes"
                  >
                    <sanring-resizable-panel [minSize]="20" class="bg-[var(--sanring-surface-muted)]">
                      <div class="h-full p-4 text-sm font-medium text-[var(--docs-fg)]">
                        {{ i18n.t('resizable.demo.files') }}
                      </div>
                    </sanring-resizable-panel>
                    <sanring-resizable-handle [withHandle]="true" />
                    <sanring-resizable-panel [minSize]="30">
                      <div class="grid h-full place-items-center p-4 text-sm text-[var(--docs-fg)]">
                        {{ i18n.t('resizable.demo.canvas') }}
                      </div>
                    </sanring-resizable-panel>
                    <sanring-resizable-handle [withHandle]="true" />
                    <sanring-resizable-panel [minSize]="20" class="bg-[var(--docs-surface)]">
                      <div class="h-full p-4 text-sm font-medium text-[var(--docs-fg)]">
                        {{ i18n.t('resizable.demo.inspector') }}
                      </div>
                    </sanring-resizable-panel>
                  </sanring-resizable-group>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3">
                  <code class="text-xs text-[var(--docs-muted)]">
                    [{{ layoutSizes.join(', ') }}]
                  </code>
                  <button
                    type="button"
                    class="rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)] px-3 py-2 text-sm text-[var(--docs-fg)]"
                    (click)="resetLayout()"
                  >
                    {{ i18n.t('resizable.demo.resetLayout') }}
                  </button>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="h-48 w-full max-w-2xl px-4">
                <sanring-resizable-group
                  [disabled]="true"
                  class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--sanring-surface)]"
                  [sizes]="[35, 65]"
                >
                  <sanring-resizable-panel class="bg-[var(--sanring-surface-muted)]">
                    <div class="h-full p-4 text-sm font-medium text-[var(--docs-fg)]">
                      {{ i18n.t('resizable.demo.lockedPanel') }}
                    </div>
                  </sanring-resizable-panel>
                  <sanring-resizable-handle [withHandle]="true" />
                  <sanring-resizable-panel>
                    <div class="h-full p-4 text-sm text-[var(--docs-muted)]">
                      {{ i18n.t('resizable.demo.lockedContent') }}
                    </div>
                  </sanring-resizable-panel>
                </sanring-resizable-group>
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
export class ResizablePageComponent {
  protected readonly page = resizablePage;
  protected readonly examples = resizablePageExamples;
  protected readonly i18n = inject(I18nService);

  protected layoutSizes = [25, 50, 25];

  protected resetLayout(): void {
    this.layoutSizes = [25, 50, 25];
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
