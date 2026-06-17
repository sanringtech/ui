import { Component, Input } from '@angular/core';
import { LucideArrowLeft, LucideArrowRight, LucideChevronDown, LucideCopy } from '@lucide/angular';

@Component({
  selector: 'app-component-page-header',
  imports: [LucideArrowLeft, LucideArrowRight, LucideChevronDown, LucideCopy],
  template: `
    <header
      class="mb-10 flex items-start justify-between gap-6 border-b border-[var(--docs-border)] pb-7 max-[720px]:block"
    >
      <div class="min-w-0">
        <h1
          class="m-0 text-[30px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ title }}
        </h1>
        <p class="mb-0 mt-2 max-w-[560px] text-base leading-relaxed text-[var(--docs-muted)]">
          {{ description }}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-2 max-[720px]:mt-6">
        <button
          type="button"
          class="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border-0 bg-[var(--docs-elevated)] px-3 text-sm font-semibold text-[var(--docs-fg)]"
        >
          <svg class="size-4" lucideCopy></svg>
          <span>Copy Page</span>
          <svg class="size-4" lucideChevronDown></svg>
        </button>

        <button
          type="button"
          class="grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-[var(--docs-elevated)] text-[var(--docs-fg)]"
          aria-label="Previous page"
        >
          <svg class="size-4" lucideArrowLeft></svg>
        </button>

        <button
          type="button"
          class="grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-[var(--docs-elevated)] text-[var(--docs-fg)]"
          aria-label="Next page"
        >
          <svg class="size-4" lucideArrowRight></svg>
        </button>
      </div>
    </header>
  `,
})
export class ComponentPageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
}
