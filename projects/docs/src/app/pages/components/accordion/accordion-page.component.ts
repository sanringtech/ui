import { Component, inject } from '@angular/core';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import {
  ComponentPageCodeBlock,
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
    ComponentPageCodeBlock,
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

      <app-component-page-section [section]="section('composition')">
        <div class="grid gap-4">
          <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
            Use the following composition to build an
            <code class="rounded-md bg-[var(--docs-elevated)] px-1.5 py-1 font-mono text-xs">
              Accordion
            </code>
            :
          </p>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="compositionExample()" language="bash" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
          <table class="w-full border-collapse text-left text-sm">
            <thead class="bg-[var(--docs-elevated)] text-[var(--docs-muted)]">
              <tr>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.property') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.type') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.default') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.descriptionLabel') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">multi</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">boolean</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">false</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.multi.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">expanded</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">boolean</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">false</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.expanded.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">disabled</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">boolean</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">false</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.disabled.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">headerClass</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">string</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">undefined</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.headerClass.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">contentClass</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">string</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">undefined</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.contentClass.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">opened</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">
                  EventEmitter&lt;void&gt;
                </td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">-</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.opened.description') }}
                </td>
              </tr>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">closed</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">
                  EventEmitter&lt;void&gt;
                </td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">-</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.closed.description') }}
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">expandedChange</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">
                  EventEmitter&lt;boolean&gt;
                </td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">-</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('accordion.api.expandedChange.description') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-component-page-section>
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

  protected compositionExample() {
    return `Accordion
├── AccordionItem
│   ├── AccordionTrigger
│   └── AccordionContent
├── AccordionItem
│   ├── AccordionTrigger
│   └── AccordionContent
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent`;
  }
}
