import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideCircleCheck } from '@lucide/angular';
import { SANRING_SELECT_IMPORTS, SelectValue } from '@sanring/ui';
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
import { selectPage, selectPageExamples } from './select.docs';

@Component({
  selector: 'app-select-page',
  imports: [
    FormsModule,
    LucideCircleCheck,
    SANRING_SELECT_IMPORTS,
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

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex min-h-[180px] items-start justify-center pt-8">
            <sanring-select [(ngModel)]="workspace">
              <button sanringSelectTrigger class="w-[240px]">
                <sanring-select-value placeholder="Choose a workspace" />
              </button>
              <sanring-select-content matchTriggerWidth>
                <sanring-select-item value="design">Design</sanring-select-item>
                <sanring-select-item value="engineering">Engineering</sanring-select-item>
                <sanring-select-item value="support">Customer support operations</sanring-select-item>
              </sanring-select-content>
            </sanring-select>
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
          componentName="select"
          manualSnippet="import { SANRING_SELECT_IMPORTS } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-groups')">
            <app-component-page-code-previewer [code]="examples.groups" language="angular-html">
              <div previewer class="flex items-start justify-center pt-8">
                <sanring-select [(ngModel)]="region">
                  <button sanringSelectTrigger class="w-[240px]">
                    <sanring-select-value placeholder="Choose a region" />
                  </button>
                  <sanring-select-content matchTriggerWidth>
                    <sanring-select-group>
                      <sanring-select-label>Asia Pacific</sanring-select-label>
                      <sanring-select-item value="taipei">Taipei</sanring-select-item>
                      <sanring-select-item value="tokyo">Tokyo</sanring-select-item>
                    </sanring-select-group>
                    <sanring-select-separator />
                    <sanring-select-group>
                      <sanring-select-label>North America</sanring-select-label>
                      <sanring-select-item value="sf">San Francisco</sanring-select-item>
                      <sanring-select-item value="nyc">New York</sanring-select-item>
                    </sanring-select-group>
                  </sanring-select-content>
                </sanring-select>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-custom-icon')">
            <app-component-page-code-previewer [code]="examples.customIcon" language="angular-html">
              <div previewer class="flex min-h-[180px] items-start justify-center pt-8">
                <sanring-select [(ngModel)]="reviewState">
                  <button sanringSelectTrigger class="w-[240px]">
                    <sanring-select-value placeholder="Review state" />
                  </button>
                  <sanring-select-content matchTriggerWidth>
                    <sanring-select-item value="approved" indicatorPosition="end">
                      Approved
                      <svg
                        sanringSelectItemIndicator
                        lucideCircleCheck
                        class="size-4 text-primary"
                        strokeWidth="2.5"
                      ></svg>
                    </sanring-select-item>
                    <sanring-select-item value="pending" indicatorPosition="end">
                      Pending
                      <svg
                        sanringSelectItemIndicator
                        lucideCircleCheck
                        class="size-4 text-[var(--sanring-muted)]"
                        strokeWidth="2.5"
                      ></svg>
                    </sanring-select-item>
                    <sanring-select-item value="blocked" indicatorPosition="end">
                      Blocked
                      <svg
                        sanringSelectItemIndicator
                        lucideCircleCheck
                        class="size-4 text-[var(--sanring-border-strong)]"
                        strokeWidth="2.5"
                      ></svg>
                    </sanring-select-item>
                  </sanring-select-content>
                </sanring-select>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-item-aligned')">
            <app-component-page-code-previewer
              [code]="examples.itemAligned"
              language="angular-html"
            >
              <div previewer class="flex min-h-[220px] items-start justify-center pt-8">
                <sanring-select [(ngModel)]="theme">
                  <button sanringSelectTrigger class="w-[240px]">
                    <sanring-select-value placeholder="Theme" />
                  </button>
                  <sanring-select-content position="item-aligned" matchTriggerWidth>
                    <sanring-select-item value="light">Light</sanring-select-item>
                    <sanring-select-item value="dark">Dark</sanring-select-item>
                    <sanring-select-item value="system">System</sanring-select-item>
                  </sanring-select-content>
                </sanring-select>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled-item')">
            <app-component-page-code-previewer
              [code]="examples.disabledItem"
              language="angular-html"
            >
              <div previewer class="flex min-h-[180px] items-start justify-center pt-8">
                <sanring-select [(ngModel)]="plan">
                  <button sanringSelectTrigger class="w-[240px]">
                    <sanring-select-value placeholder="Choose a plan" />
                  </button>
                  <sanring-select-content matchTriggerWidth>
                    <sanring-select-item value="starter">Starter</sanring-select-item>
                    <sanring-select-item value="pro">Pro</sanring-select-item>
                    <sanring-select-item value="enterprise" disabled
                      >Enterprise</sanring-select-item
                    >
                  </sanring-select-content>
                </sanring-select>
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
export class SelectPageComponent {
  protected readonly page = selectPage;
  protected readonly examples = selectPageExamples;
  protected readonly i18n = inject(I18nService);

  workspace: SelectValue = 'engineering';
  region: SelectValue = 'taipei';
  theme: SelectValue = 'dark';
  plan: SelectValue = 'pro';
  reviewState: SelectValue = 'approved';

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
