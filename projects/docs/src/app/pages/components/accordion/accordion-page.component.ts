import { Component, inject } from '@angular/core';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import {
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { I18nService } from '../../../i18n/i18n.service';
import { accordionPage } from './accordion.docs';

@Component({
  selector: 'app-accordion-page',
  imports: [
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    ComponentPageComponent,
    ComponentPageCodePreviewer,
    ComponentPageHeaderComponent,
    ComponentPageSectionComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('code')">
        <app-component-page-code-previewer [code]="codeExample()" language="angular-html">
          <div previewer class="w-[min(500px,100%)]">
            <sanring-accordion class="w-[min(500px,100%)]">
              <sanring-accordion-item>
                <sanring-accordion-trigger>
                  <span header>{{ i18n.t('accordion.demo.shipping.question') }}</span>
                </sanring-accordion-trigger>
                <sanring-accordion-content>
                  <p class="mb-0 mt-0 px-4 pb-2 text-sm leading-relaxed text-[var(--docs-muted)]">
                    {{ i18n.t('accordion.demo.shipping.answer') }}
                  </p>
                </sanring-accordion-content>
              </sanring-accordion-item>

              <sanring-accordion-item>
                <sanring-accordion-trigger>
                  <span header>{{ i18n.t('accordion.demo.returns.question') }}</span>
                </sanring-accordion-trigger>
                <sanring-accordion-content>
                  <p class="mb-0 mt-0 px-4 pb-2 text-sm leading-relaxed text-[var(--docs-muted)]">
                    {{ i18n.t('accordion.demo.returns.answer') }}
                  </p>
                </sanring-accordion-content>
              </sanring-accordion-item>

              <sanring-accordion-item>
                <sanring-accordion-trigger>
                  <span header>{{ i18n.t('accordion.demo.support.question') }}</span>
                </sanring-accordion-trigger>
                <sanring-accordion-content>
                  <p class="mb-0 mt-0 px-4 pb-2 text-sm leading-relaxed text-[var(--docs-muted)]">
                    {{ i18n.t('accordion.demo.support.answer') }}
                  </p>
                </sanring-accordion-content>
              </sanring-accordion-item>
            </sanring-accordion>
          </div>

        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')" />

      <app-component-page-section [section]="section('composition')" />
    </app-component-page>
  `,
})
export class AccordionPageComponent {
  protected readonly page = accordionPage;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected codeExample() {
    return `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sanring/ui';

<sanring-accordion>
  <sanring-accordion-item>
    <sanring-accordion-trigger>
      <span header>${this.i18n.t('accordion.demo.shipping.question')}</span>
    </sanring-accordion-trigger>
    <sanring-accordion-content>
      ${this.i18n.t('accordion.demo.shipping.answer')}
    </sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`;
  }
}
