import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-docs-page-header',
  standalone: true,
  host: {
    class: 'block min-w-0',
  },
  template: `
    <header
      class="relative mb-12 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_88%,transparent)] p-7 shadow-[var(--docs-shadow-strong)] max-[720px]:p-5"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--docs-accent),var(--docs-accent-alt),var(--docs-accent-warm))]"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--docs-bg-grid)_1px,transparent_1px),linear-gradient(90deg,var(--docs-bg-grid)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      ></div>

      <div class="relative z-10 min-w-0">
        @if (eyebrow) {
          <p
            class="mb-4 inline-flex max-w-full rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-accent)_32%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-surface))] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--docs-accent-strong)]"
          >
            <span class="min-w-0 truncate">{{ eyebrow }}</span>
          </p>
        }

        <h1
          class="m-0 text-[36px] font-semibold leading-[1.15] tracking-normal text-[var(--docs-fg)] max-[520px]:text-[30px]"
        >
          {{ title }}
        </h1>

        @if (description) {
          <p class="mb-0 mt-3 max-w-[620px] text-[18px] leading-[1.75] text-[var(--docs-muted)] max-[520px]:text-base">
            {{ description }}
          </p>
        }

        <div class="docs-page-header__meta mt-5 flex flex-wrap items-center gap-2">
          <ng-content select="[page-meta]" />
        </div>

        <div class="docs-page-header__actions mt-6 flex flex-wrap gap-3">
          <ng-content select="[page-actions]" />
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .docs-page-header__meta:empty,
      .docs-page-header__actions:empty {
        display: none;
      }
    `,
  ],
})
export class DocsPageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() description = '';
  @Input() eyebrow = '';
}
