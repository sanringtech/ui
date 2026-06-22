import { Component, inject } from '@angular/core';
import { InputDirective } from '@sanring/ui';
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
import { inputPage, inputPageExamples } from './input.docs';

@Component({
  selector: 'app-input-page',
  imports: [
    ComponentPageApiTableComponent,
    InputDirective,
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
          <div previewer class="w-[min(360px,100%)]">
            <input sanringInput placeholder="Email" type="email" />
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="input"
          manualSnippet="import { InputDirective } from '@sanring/ui';"
        />
      </app-component-page-section>


      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="w-[min(360px,100%)]">
                <input sanringInput disabled value="readonly@sanring.dev" />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-textarea')">
            <app-component-page-code-previewer [code]="examples.textarea" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <textarea sanringInput placeholder="Write a note"></textarea>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-file')">
            <app-component-page-code-previewer [code]="examples.file" language="angular-html">
              <div previewer class="w-[min(360px,100%)]">
                <input sanringInput type="file" />
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
export class InputPageComponent {
  protected readonly page = inputPage;
  protected readonly examples = inputPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
