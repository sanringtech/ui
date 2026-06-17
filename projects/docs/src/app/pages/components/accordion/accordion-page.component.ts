import { Component } from '@angular/core';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@sanring/ui';
import { ComponentPageHeaderComponent } from '../../../blocks/component-page-header.component';

@Component({
  selector: 'app-accordion-page',
  imports: [
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    ComponentPageHeaderComponent,
  ],
  template: `
    <article class="mx-auto max-w-[832px] text-[var(--docs-fg)]">
      <app-component-page-header
        title="Accordion"
        description="A vertically stacked set of interactive headings that each reveal a section of content."
      />

      <div
        class="flex gap-7 border-b border-[var(--docs-border)]"
        role="tablist"
        aria-label="Accordion variants"
      >
        <button
          type="button"
          class="h-10 cursor-pointer border-0 border-b-2 border-[var(--docs-fg)] bg-transparent p-0 text-lg font-semibold text-[var(--docs-fg)]"
        >
          Radix UI
        </button>
        <button
          type="button"
          class="h-10 cursor-pointer border-0 border-b-2 border-transparent bg-transparent p-0 text-lg font-semibold text-[var(--docs-muted)]"
        >
          Base UI
        </button>
      </div>

      <section
        class="mt-9 overflow-hidden rounded-lg border border-[var(--docs-border)] bg-[var(--docs-panel)]"
        id="usage"
      >
        <div
          class="grid min-h-[390px] place-items-center p-11 max-[720px]:min-h-80 max-[720px]:p-6"
        >
          <sanring-accordion class="w-[min(500px,100%)]">
            <sanring-accordion-item>
              <sanring-accordion-trigger>
                <span header>What are your shipping options?</span>
              </sanring-accordion-trigger>
              <sanring-accordion-content>
                <p class="mb-0 mt-0 px-4 pb-2 text-sm leading-relaxed text-[var(--docs-muted)]">
                  We ship domestically and internationally with tracked delivery.
                </p>
              </sanring-accordion-content>
            </sanring-accordion-item>

            <sanring-accordion-item>
              <sanring-accordion-trigger>
                <span header>What is your return policy?</span>
              </sanring-accordion-trigger>
              <sanring-accordion-content>
                <p class="mb-0 mt-0 px-4 pb-2 text-sm leading-relaxed text-[var(--docs-muted)]">
                  Returns are accepted within 30 days for unused items in original packaging.
                </p>
              </sanring-accordion-content>
            </sanring-accordion-item>

            <sanring-accordion-item>
              <sanring-accordion-trigger>
                <span header>How can I contact customer support?</span>
              </sanring-accordion-trigger>
              <sanring-accordion-content>
                <p class="mb-0 mt-0 px-4 pb-2 text-sm leading-relaxed text-[var(--docs-muted)]">
                  Contact support through the dashboard or email us during business hours.
                </p>
              </sanring-accordion-content>
            </sanring-accordion-item>
          </sanring-accordion>
        </div>

        <pre
          class="m-0 overflow-auto border-t border-[var(--docs-border)] bg-[var(--docs-code)] px-10 py-7 text-[15px] leading-[1.7] text-[#d4d4d4]"
        ><code>{{ codeExample }}</code></pre>
      </section>

      <section id="installation" class="pt-16">
        <h2 class="mb-3.5 mt-0 text-[28px] tracking-normal">Installation</h2>
        <p class="m-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          Import the accordion primitives from
          <code class="text-[var(--docs-fg)]">&#64;sanring/ui</code> and compose them in your
          template.
        </p>
      </section>

      <section id="composition" class="pt-16">
        <h2 class="mb-3.5 mt-0 text-[28px] tracking-normal">Composition</h2>
        <p class="m-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          The component is split into root, item, trigger, and content primitives so each part
          remains reusable.
        </p>
      </section>
    </article>
  `,
})
export class AccordionPageComponent {
  protected readonly codeExample = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sanring/ui';

<sanring-accordion>
  <sanring-accordion-item>
    <sanring-accordion-trigger>
      <span header>What are your shipping options?</span>
    </sanring-accordion-trigger>
    <sanring-accordion-content>
      We ship domestically and internationally.
    </sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`;
}
