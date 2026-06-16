import { Component } from '@angular/core';
import { cn } from '@sanring/ui';

@Component({
  selector: 'app-docs-toc',
  template: `
    <aside [class]="classes.root">
      <nav [class]="classes.nav" aria-label="On this page">
        <p [class]="classes.heading">On This Page</p>
        <a [class]="classes.activeLink" href="#installation">Installation</a>
        <a [class]="classes.link" href="#usage">Usage</a>
        <a [class]="classes.link" href="#composition">Composition</a>
        <a [class]="classes.link" href="#examples">Examples</a>
        <a [class]="classes.subLink" href="#basic">Basic</a>
        <a [class]="classes.subLink" href="#multiple">Multiple</a>
        <a [class]="classes.subLink" href="#disabled">Disabled</a>
        <a [class]="classes.link" href="#api-reference">API Reference</a>
      </nav>

      <div [class]="classes.promo">
        <h2 [class]="classes.promoTitle">Build your Sanring UI app</h2>
        <p [class]="classes.promoText">
          Use the docs app to preview components, examples, and API decisions before publishing.
        </p>
        <button type="button" [class]="classes.promoButton">Open Registry</button>
      </div>
    </aside>
  `,
})
export class DocsTocComponent {
  protected readonly classes = {
    root: cn(
      'sticky top-[76px] h-[calc(100dvh-76px)] overflow-auto bg-[var(--docs-bg)]',
      'pb-12 pl-2.5 pr-8 pt-12 max-[1180px]:hidden',
    ),
    nav: cn('mb-11'),
    heading: cn('mb-4 text-sm font-semibold leading-normal text-[var(--docs-muted)]'),
    link: cn('my-3 block text-sm text-[var(--docs-muted)] no-underline'),
    activeLink: cn('my-3 block text-sm font-semibold text-[var(--docs-fg)] no-underline'),
    subLink: cn('my-3 block pl-[18px] text-sm text-[var(--docs-muted)] no-underline'),
    promo: cn('rounded-lg border border-[var(--docs-border)] bg-[var(--docs-elevated)] p-7'),
    promoTitle: cn('mb-3 mt-0 text-lg leading-tight text-[var(--docs-fg)]'),
    promoText: cn('m-0 leading-normal text-[var(--docs-muted)]'),
    promoButton: cn(
      'mt-[18px] h-9 cursor-pointer rounded-lg border border-[var(--docs-border-strong)]',
      'bg-transparent px-3.5 text-[var(--docs-fg)]',
    ),
  };
}
