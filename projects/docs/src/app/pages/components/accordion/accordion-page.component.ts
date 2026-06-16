import { Component } from '@angular/core';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, cn } from '@sanring/ui';

@Component({
  selector: 'app-accordion-page',
  imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
  template: `
    <article [class]="classes.root">
      <div [class]="classes.toolbar">
        <button type="button" [class]="classes.toolbarButton">Copy Page</button>
        <button type="button" [class]="classes.toolbarButton" aria-label="Previous page">←</button>
        <button type="button" [class]="classes.toolbarButton" aria-label="Next page">→</button>
      </div>

      <header [class]="classes.hero">
        <h1 [class]="classes.title">Accordion</h1>
        <p [class]="classes.description">
          A vertically stacked set of interactive headings that each reveal a section of content.
        </p>
      </header>

      <div [class]="classes.tabs" role="tablist" aria-label="Accordion variants">
        <button type="button" [class]="cn(classes.tab, classes.activeTab)">Radix UI</button>
        <button type="button" [class]="classes.tab">Base UI</button>
      </div>

      <section [class]="classes.previewCard" id="usage">
        <div [class]="classes.preview">
          <sanring-accordion class="w-[min(500px,100%)]">
            <sanring-accordion-item>
              <sanring-accordion-trigger>
                <span header>What are your shipping options?</span>
              </sanring-accordion-trigger>
              <sanring-accordion-content>
                <p [class]="classes.previewText">
                  We ship domestically and internationally with tracked delivery.
                </p>
              </sanring-accordion-content>
            </sanring-accordion-item>

            <sanring-accordion-item>
              <sanring-accordion-trigger>
                <span header>What is your return policy?</span>
              </sanring-accordion-trigger>
              <sanring-accordion-content>
                <p [class]="classes.previewText">
                  Returns are accepted within 30 days for unused items in original packaging.
                </p>
              </sanring-accordion-content>
            </sanring-accordion-item>

            <sanring-accordion-item>
              <sanring-accordion-trigger>
                <span header>How can I contact customer support?</span>
              </sanring-accordion-trigger>
              <sanring-accordion-content>
                <p [class]="classes.previewText">
                  Contact support through the dashboard or email us during business hours.
                </p>
              </sanring-accordion-content>
            </sanring-accordion-item>
          </sanring-accordion>
        </div>

        <pre [class]="classes.codeBlock"><code>{{ codeExample }}</code></pre>
      </section>

      <section id="installation" [class]="classes.section">
        <h2 [class]="classes.sectionTitle">Installation</h2>
        <p [class]="classes.sectionText">
          Import the accordion primitives from
          <code class="text-[var(--docs-fg)]">&#64;sanring/ui</code> and compose them in your
          template.
        </p>
      </section>

      <section id="composition" [class]="classes.section">
        <h2 [class]="classes.sectionTitle">Composition</h2>
        <p [class]="classes.sectionText">
          The component is split into root, item, trigger, and content primitives so each part
          remains reusable.
        </p>
      </section>
    </article>
  `,
})
export class AccordionPageComponent {
  protected readonly cn = cn;

  protected readonly classes = {
    root: cn('relative mx-auto max-w-[832px] text-[var(--docs-fg)]'),
    toolbar: cn('absolute right-0 top-0 flex gap-2.5', 'max-[720px]:static max-[720px]:mb-7'),
    toolbarButton: cn(
      'h-9 cursor-pointer rounded-lg border border-[var(--docs-border)]',
      'bg-[var(--docs-elevated)] px-3.5 font-semibold text-[var(--docs-fg)]',
    ),
    hero: cn('max-w-[520px] pr-[220px] max-[720px]:pr-0'),
    title: cn('m-0 text-[38px] leading-[1.1] tracking-normal max-[720px]:text-[34px]'),
    description: cn('mb-0 mt-4 text-xl leading-[1.45] text-[var(--docs-muted)]'),
    tabs: cn('mt-[42px] flex gap-7 border-b border-[var(--docs-border)]'),
    tab: cn(
      'h-10 cursor-pointer border-0 border-b-2 border-transparent',
      'bg-transparent p-0 text-lg font-semibold text-[var(--docs-muted)]',
    ),
    activeTab: cn('border-[var(--docs-fg)] text-[var(--docs-fg)]'),
    previewCard: cn(
      'mt-9 overflow-hidden rounded-lg border border-[var(--docs-border)]',
      'bg-[var(--docs-panel)]',
    ),
    preview: cn(
      'grid min-h-[390px] place-items-center p-11',
      'max-[720px]:min-h-80 max-[720px]:p-6',
    ),
    previewText: cn('mb-0 mt-0 px-4 pb-2 text-sm leading-relaxed text-[var(--docs-muted)]'),
    codeBlock: cn(
      'm-0 overflow-auto border-t border-[var(--docs-border)] bg-[var(--docs-code)]',
      'px-10 py-7 text-[15px] leading-[1.7] text-[#d4d4d4]',
    ),
    section: cn('pt-16'),
    sectionTitle: cn('mb-3.5 mt-0 text-[28px] tracking-normal'),
    sectionText: cn('m-0 text-base leading-[1.7] text-[var(--docs-muted)]'),
  };

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
