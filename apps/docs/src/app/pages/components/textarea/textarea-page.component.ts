import { Component, inject } from '@angular/core';
import { TextareaDirective } from '@sanring/ui';
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
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { textareaPage, textareaPageExamples } from './textarea.docs';

@Component({
  selector: 'app-textarea-page',
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
    TextareaDirective,
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

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="w-[min(420px,100%)]">
            <textarea sanringTextarea placeholder="Write a note"></textarea>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="textarea"
          manualSnippet="import { TextareaDirective } from './components/ui/textarea';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <textarea sanringTextarea disabled>Readonly message</textarea>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-resize')">
            <app-component-page-code-previewer [code]="examples.resize" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <textarea
                  sanringTextarea
                  class="min-h-[140px] resize-y"
                  placeholder="Longer message"
                ></textarea>
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
export class TextareaPageComponent {
  protected readonly page = textareaPage;
  protected readonly examples = textareaPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
