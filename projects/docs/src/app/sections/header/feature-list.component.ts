import { Component, signal } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';

@Component({
  selector: 'app-feature-list',
  imports: [LucideSun, LucideMoon],
  template: `
    <div class="flex min-w-0 items-center gap-[22px] max-[860px]:w-full max-[860px]:gap-3">
      <label class="max-[860px]:min-w-0 max-[860px]:flex-1">
        <span class="sr-only">Search documentation</span>
        <input
          class="h-10 w-[330px] rounded-lg border border-transparent bg-[var(--docs-elevated)] px-4 text-[var(--docs-fg)] outline-none focus:border-[var(--docs-border-strong)] max-[980px]:w-[min(46vw,300px)] max-[860px]:w-full"
          type="search"
          placeholder="Search documentation..."
        />
      </label>

      <button
        type="button"
        class="h-[38px] w-[38px] flex-none cursor-pointer rounded-lg border border-[var(--docs-border)] bg-transparent text-xs text-[var(--docs-muted)]"
        aria-label="GitHub"
      >
        <span>GH</span>
      </button>

      <button
        type="button"
        class="h-[38px] w-[38px] flex-none cursor-pointer rounded-lg border border-[var(--docs-border)] bg-transparent text-xs text-[var(--docs-muted)]"
        aria-label="Toggle theme"
        (click)="toggleTheme()"
      >
        @if (isDark()) {
          <svg class="mx-auto size-4" lucideMoon></svg>
        } @else {
          <svg class="mx-auto size-4" lucideSun></svg>
        }
      </button>

      <button
        type="button"
        class="h-[38px] flex-none cursor-pointer rounded-lg border border-[var(--docs-border)] bg-[var(--docs-fg)] px-3.5 text-[var(--docs-bg)]"
      >
        + New
      </button>
    </div>
  `,
})
export class FeatureListComponent {
  protected readonly isDark = signal(true);

  protected toggleTheme() {
    this.isDark.update((value) => {
      document.documentElement.dataset['theme'] = value ? 'light' : 'dark';
      return !value;
    });
  }
}
