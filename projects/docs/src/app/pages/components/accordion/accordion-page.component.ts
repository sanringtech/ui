import { Component, inject } from '@angular/core';
import {
  AccordionComponent,
  AccordionContentComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  ButtonDirective,
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { I18nService } from '../../../i18n/i18n.service';
import { accordionPage, accordionPageExamples } from './accordion.docs';

@Component({
  selector: 'app-accordion-page',
  imports: [
    ComponentPageApiTableComponent,
    AccordionComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    AccordionContentComponent,
    ButtonDirective,
    ComponentPageComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
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
          <div previewer class="w-[min(520px,100%)]">
            <sanring-accordion class="block w-full">
              @for (item of demoItems; track item.id) {
                <sanring-accordion-item>
                  <sanring-accordion-trigger>{{ item.question }}</sanring-accordion-trigger>
                  <sanring-accordion-content>
                    <p class="mb-0 mt-0 pb-4 text-sm leading-relaxed text-[var(--docs-muted)]">
                      {{ item.answer }}
                    </p>
                  </sanring-accordion-content>
                </sanring-accordion-item>
              }
            </sanring-accordion>
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
          componentName="accordion"
          manualSnippet="import { AccordionComponent, AccordionContentComponent, AccordionItemComponent, AccordionTriggerComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="examples.composition" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-single')">
            <app-component-page-code-previewer [code]="examples.single" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-accordion class="block w-full">
                  @for (item of demoItems; track item.id) {
                    <sanring-accordion-item>
                      <sanring-accordion-trigger>{{ item.question }}</sanring-accordion-trigger>
                      <sanring-accordion-content>
                        <p class="mb-0 mt-0 pb-4 text-sm leading-relaxed text-[var(--docs-muted)]">
                          {{ item.answer }}
                        </p>
                      </sanring-accordion-content>
                    </sanring-accordion-item>
                  }
                </sanring-accordion>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-multiple')">
            <app-component-page-code-previewer [code]="examples.multiple" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-accordion class="block w-full" multi>
                  @for (item of demoItems; track item.id) {
                    <sanring-accordion-item>
                      <sanring-accordion-trigger>{{ item.question }}</sanring-accordion-trigger>
                      <sanring-accordion-content>
                        <p class="mb-0 mt-0 pb-4 text-sm leading-relaxed text-[var(--docs-muted)]">
                          {{ item.answer }}
                        </p>
                      </sanring-accordion-content>
                    </sanring-accordion-item>
                  }
                </sanring-accordion>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-default-open')">
            <app-component-page-code-previewer [code]="examples.defaultOpen" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-accordion class="block w-full">
                  @for (item of demoItems; track item.id) {
                    <sanring-accordion-item [expanded]="item.id === 'shipping'">
                      <sanring-accordion-trigger>{{ item.question }}</sanring-accordion-trigger>
                      <sanring-accordion-content>
                        <p class="mb-0 mt-0 pb-4 text-sm leading-relaxed text-[var(--docs-muted)]">
                          {{ item.answer }}
                        </p>
                      </sanring-accordion-content>
                    </sanring-accordion-item>
                  }
                </sanring-accordion>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-underline')">
            <app-component-page-code-previewer [code]="examples.underline" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-accordion class="block w-full">
                  @for (item of demoItems; track item.id) {
                    <sanring-accordion-item>
                      <sanring-accordion-trigger variant="underline">{{ item.question }}</sanring-accordion-trigger>
                      <sanring-accordion-content>
                        <p class="mb-0 mt-0 pb-4 text-sm leading-relaxed text-[var(--docs-muted)]">
                          {{ item.answer }}
                        </p>
                      </sanring-accordion-content>
                    </sanring-accordion-item>
                  }
                </sanring-accordion>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-controlled')">
            <app-component-page-code-previewer [code]="examples.controlled" language="angular-html">
              <div previewer class="grid w-[min(560px,100%)] gap-4">
                <div class="flex flex-wrap justify-end gap-2">
                  <button sanringBtn type="button" variant="outline" size="sm" (click)="controlled.openAll()">
                    {{ i18n.t('accordion.demo.openAll') }}
                  </button>
                  <button sanringBtn type="button" variant="outline" size="sm" (click)="controlled.closeAll()">
                    {{ i18n.t('accordion.demo.closeAll') }}
                  </button>
                </div>

                <sanring-accordion #controlled class="block w-full" multi>
                  @for (item of demoItems; track item.id) {
                    <sanring-accordion-item>
                      <sanring-accordion-trigger>{{ item.question }}</sanring-accordion-trigger>
                      <sanring-accordion-content>
                        <p class="mb-0 mt-0 pb-4 text-sm leading-relaxed text-[var(--docs-muted)]">
                          {{ item.answer }}
                        </p>
                      </sanring-accordion-content>
                    </sanring-accordion-item>
                  }
                </sanring-accordion>
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
export class AccordionPageComponent {
  protected readonly page = accordionPage;
  protected readonly examples = accordionPageExamples;
  protected readonly i18n = inject(I18nService);

  protected get demoItems() {
    return [
      {
        id: 'shipping',
        question: this.i18n.t('accordion.demo.shipping.question'),
        answer: this.i18n.t('accordion.demo.shipping.answer'),
      },
      {
        id: 'returns',
        question: this.i18n.t('accordion.demo.returns.question'),
        answer: this.i18n.t('accordion.demo.returns.answer'),
      },
      {
        id: 'support',
        question: this.i18n.t('accordion.demo.support.question'),
        answer: this.i18n.t('accordion.demo.support.answer'),
      },
    ];
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
