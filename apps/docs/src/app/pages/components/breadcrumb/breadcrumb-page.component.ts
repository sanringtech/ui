import { Component, inject } from '@angular/core';
import { SANRING_BREADCRUMB_IMPORTS } from '@sanring/ui';
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
import { breadcrumbPage, breadcrumbPageExamples } from './breadcrumb.docs';

@Component({
  selector: 'app-breadcrumb-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    SANRING_BREADCRUMB_IMPORTS,
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
          <div previewer class="flex min-h-[80px] items-center justify-center p-6">
            <sanring-breadcrumb>
              <sanring-breadcrumb-list>
                <sanring-breadcrumb-item>
                  <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
                </sanring-breadcrumb-item>
                <sanring-breadcrumb-divider />
                <sanring-breadcrumb-item>
                  <sanring-breadcrumb-link routerLink="/components"
                    >Components</sanring-breadcrumb-link
                  >
                </sanring-breadcrumb-item>
                <sanring-breadcrumb-divider />
                <sanring-breadcrumb-item>
                  <sanring-breadcrumb-page>Breadcrumb</sanring-breadcrumb-page>
                </sanring-breadcrumb-item>
              </sanring-breadcrumb-list>
            </sanring-breadcrumb>
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
          componentName="breadcrumb"
          manualSnippet="import { SANRING_BREADCRUMB_IMPORTS } from './components/ui/breadcrumb';"
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
          <!-- Divider -->
          <app-component-page-section [section]="section('example-divider')">
            <app-component-page-code-previewer [code]="examples.divider" language="angular-html">
              <div
                previewer
                class="flex min-h-[120px] flex-col items-center justify-center gap-4 p-6"
              >
                <!-- Chevron -->
                <sanring-breadcrumb>
                  <sanring-breadcrumb-list>
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
                    </sanring-breadcrumb-item>
                    <sanring-breadcrumb-divider type="chevron" />
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-page>Page</sanring-breadcrumb-page>
                    </sanring-breadcrumb-item>
                  </sanring-breadcrumb-list>
                </sanring-breadcrumb>

                <!-- Dot -->
                <sanring-breadcrumb>
                  <sanring-breadcrumb-list>
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
                    </sanring-breadcrumb-item>
                    <sanring-breadcrumb-divider type="dot" />
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-page>Page</sanring-breadcrumb-page>
                    </sanring-breadcrumb-item>
                  </sanring-breadcrumb-list>
                </sanring-breadcrumb>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- With Ellipsis -->
          <app-component-page-section [section]="section('example-ellipsis')">
            <app-component-page-code-previewer [code]="examples.ellipsis" language="angular-html">
              <div previewer class="flex min-h-[80px] items-center justify-center p-6">
                <sanring-breadcrumb>
                  <sanring-breadcrumb-list>
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
                    </sanring-breadcrumb-item>
                    <sanring-breadcrumb-divider />
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-ellipsis />
                    </sanring-breadcrumb-item>
                    <sanring-breadcrumb-divider />
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-link routerLink="/components"
                        >Components</sanring-breadcrumb-link
                      >
                    </sanring-breadcrumb-item>
                    <sanring-breadcrumb-divider />
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-page>Breadcrumb</sanring-breadcrumb-page>
                    </sanring-breadcrumb-item>
                  </sanring-breadcrumb-list>
                </sanring-breadcrumb>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Custom Divider -->
          <app-component-page-section [section]="section('example-custom')">
            <app-component-page-code-previewer [code]="examples.custom" language="angular-html">
              <div previewer class="flex min-h-[80px] items-center justify-center p-6">
                <sanring-breadcrumb>
                  <sanring-breadcrumb-list>
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
                    </sanring-breadcrumb-item>
                    <sanring-breadcrumb-divider>
                      <span aria-hidden="true">/</span>
                    </sanring-breadcrumb-divider>
                    <sanring-breadcrumb-item>
                      <sanring-breadcrumb-page>Page</sanring-breadcrumb-page>
                    </sanring-breadcrumb-item>
                  </sanring-breadcrumb-list>
                </sanring-breadcrumb>
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
export class BreadcrumbPageComponent {
  protected readonly page = breadcrumbPage;
  protected readonly examples = breadcrumbPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
