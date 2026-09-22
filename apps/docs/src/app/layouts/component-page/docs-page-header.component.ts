import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-docs-page-header',
  standalone: true,
  host: {
    class: 'block min-w-0',
  },
  template: `
    <header class="docs-panel-lg relative mb-12 p-6 max-[720px]:p-5">
      <div class="min-w-0">
        @if (eyebrow) {
          <p class="docs-eyebrow mb-3 font-mono">
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
