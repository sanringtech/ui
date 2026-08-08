import { Component, inject } from '@angular/core';
import { SANRING_CONTEXT_MENU_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageKeyboardTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { contextMenuPage, contextMenuPageExamples } from './context-menu.docs';

@Component({
  selector: 'app-context-menu-page',
  imports: [
    SANRING_CONTEXT_MENU_IMPORTS,
    ComponentPageApiTableComponent,
    ComponentPageKeyboardTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections" [componentId]="page.componentId">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="w-[min(420px,100%)]">
            <sanring-context-menu (itemSelected)="onBasicAction($event)">
              <div
                sanringContextMenuTrigger
                class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
              >
                Right click here
              </div>

              <sanring-context-menu-content class="w-56">
                <sanring-context-menu-label>Actions</sanring-context-menu-label>
                <sanring-context-menu-item value="back">
                  Back
                  <sanring-context-menu-shortcut>⌘[</sanring-context-menu-shortcut>
                </sanring-context-menu-item>
                <sanring-context-menu-item value="forward" disabled>
                  Forward
                  <sanring-context-menu-shortcut>⌘]</sanring-context-menu-shortcut>
                </sanring-context-menu-item>
                <sanring-context-menu-item value="reload">
                  Reload
                  <sanring-context-menu-shortcut>⌘R</sanring-context-menu-shortcut>
                </sanring-context-menu-item>
                <sanring-context-menu-separator />
                <sanring-context-menu-item value="delete" variant="destructive">
                  Delete
                </sanring-context-menu-item>
              </sanring-context-menu-content>
            </sanring-context-menu>
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
          componentName="context-menu"
          manualSnippet="import { SANRING_CONTEXT_MENU_IMPORTS } from './components/ui/context-menu';"
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
          <app-component-page-section [section]="section('example-checkbox')">
            <app-component-page-code-previewer [code]="examples.checkbox" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-context-menu>
                  <div
                    sanringContextMenuTrigger
                    class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
                  >
                    Right click here
                  </div>

                  <sanring-context-menu-content class="w-56">
                    <sanring-context-menu-label>Panels</sanring-context-menu-label>
                    <sanring-context-menu-checkbox-item [(checked)]="showStatusBar">
                      Status bar
                    </sanring-context-menu-checkbox-item>
                    <sanring-context-menu-checkbox-item [(checked)]="showActivityBar">
                      Activity bar
                    </sanring-context-menu-checkbox-item>
                  </sanring-context-menu-content>
                </sanring-context-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-radio')">
            <app-component-page-code-previewer [code]="examples.radio" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-context-menu>
                  <div
                    sanringContextMenuTrigger
                    class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
                  >
                    Right click here
                  </div>

                  <sanring-context-menu-content class="w-56">
                    <sanring-context-menu-label>Density</sanring-context-menu-label>
                    <sanring-context-menu-radio-group [(value)]="density">
                      <sanring-context-menu-radio-item value="compact">
                        Compact
                      </sanring-context-menu-radio-item>
                      <sanring-context-menu-radio-item value="comfortable">
                        Comfortable
                      </sanring-context-menu-radio-item>
                    </sanring-context-menu-radio-group>
                  </sanring-context-menu-content>
                </sanring-context-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-submenu')">
            <app-component-page-code-previewer [code]="examples.submenu" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-context-menu (itemSelected)="onFileAction($event)">
                  <div
                    sanringContextMenuTrigger
                    class="flex h-40 w-full items-center justify-center rounded-[var(--sanring-radius-sm)] border border-dashed border-[var(--sanring-border)] text-sm text-[var(--sanring-muted)]"
                  >
                    Right click here
                  </div>

                  <sanring-context-menu-content class="w-52">
                    <sanring-context-menu-item value="save-page">
                      Save Page As...
                    </sanring-context-menu-item>
                    <sanring-context-menu-sub>
                      <sanring-context-menu-sub-trigger>More Tools</sanring-context-menu-sub-trigger>
                      <sanring-context-menu-sub-content class="w-48">
                        <sanring-context-menu-item value="developer-tools">
                          Developer Tools
                        </sanring-context-menu-item>
                        <sanring-context-menu-item value="task-manager">
                          Task Manager
                        </sanring-context-menu-item>
                        <sanring-context-menu-separator />
                        <sanring-context-menu-item value="clear-cache">
                          Clear Cache
                        </sanring-context-menu-item>
                      </sanring-context-menu-sub-content>
                    </sanring-context-menu-sub>
                    <sanring-context-menu-separator />
                    <sanring-context-menu-item value="delete" variant="destructive">
                      Delete
                    </sanring-context-menu-item>
                  </sanring-context-menu-content>
                </sanring-context-menu>
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
export class ContextMenuPageComponent {
  protected readonly page = contextMenuPage;
  protected readonly examples = contextMenuPageExamples;
  protected readonly i18n = inject(I18nService);

  protected showStatusBar = true;
  protected showActivityBar = false;
  protected density: 'compact' | 'comfortable' = 'comfortable';

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected onBasicAction(value: unknown): void {
    console.log('context menu action', value);
  }

  protected onFileAction(value: unknown): void {
    console.log('context menu action', value);
  }
}
