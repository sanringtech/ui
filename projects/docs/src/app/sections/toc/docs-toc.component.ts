import { Component } from '@angular/core';

@Component({
  selector: 'app-docs-toc',
  template: `
    <aside
      class="sticky top-[76px] h-[calc(100dvh-76px)] overflow-auto bg-[var(--docs-bg)] pb-12 pl-2.5 pr-8 pt-12 max-[1180px]:hidden"
    >
      <nav class="mb-11" aria-label="On this page">
        <p class="mb-4 text-sm font-semibold leading-normal text-[var(--docs-muted)]">
          On This Page
        </p>
        <a
          class="my-3 block text-sm font-semibold text-[var(--docs-fg)] no-underline"
          href="#installation"
        >
          Installation
        </a>
        <a class="my-3 block text-sm text-[var(--docs-muted)] no-underline" href="#usage">
          Usage
        </a>
        <a class="my-3 block text-sm text-[var(--docs-muted)] no-underline" href="#composition">
          Composition
        </a>
        <a class="my-3 block text-sm text-[var(--docs-muted)] no-underline" href="#examples">
          Examples
        </a>
        <a class="my-3 block pl-[18px] text-sm text-[var(--docs-muted)] no-underline" href="#basic">
          Basic
        </a>
        <a
          class="my-3 block pl-[18px] text-sm text-[var(--docs-muted)] no-underline"
          href="#multiple"
        >
          Multiple
        </a>
        <a
          class="my-3 block pl-[18px] text-sm text-[var(--docs-muted)] no-underline"
          href="#disabled"
        >
          Disabled
        </a>
        <a class="my-3 block text-sm text-[var(--docs-muted)] no-underline" href="#api-reference">
          API Reference
        </a>
      </nav>

      <div class="rounded-lg border border-[var(--docs-border)] bg-[var(--docs-elevated)] p-7">
        <h2 class="mb-3 mt-0 text-lg leading-tight text-[var(--docs-fg)]">
          Build your Sanring UI app
        </h2>
        <p class="m-0 leading-normal text-[var(--docs-muted)]">
          Use the docs app to preview components, examples, and API decisions before publishing.
        </p>
        <button
          type="button"
          class="mt-[18px] h-9 cursor-pointer rounded-lg border border-[var(--docs-border-strong)] bg-transparent px-3.5 text-[var(--docs-fg)]"
        >
          Open Registry
        </button>
      </div>
    </aside>
  `,
})
export class DocsTocComponent {}
