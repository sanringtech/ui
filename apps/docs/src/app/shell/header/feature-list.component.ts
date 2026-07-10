import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ButtonDirective, InputDirective, SANRING_POPOVER_IMPORTS } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { docsComponentItems, docsSectionItems } from '../../navigation/docs-navigation';
import { fuzzyMatch } from './fuzzy-match';
import { HeaderActionButtonComponent } from './header-action-button.component';

interface SearchResult {
  label: string;
  path: string;
  score: number;
}

const MAX_SEARCH_RESULTS = 8;

@Component({
  selector: 'app-feature-list',
  imports: [
    ButtonDirective,
    HeaderActionButtonComponent,
    InputDirective,
    LucideSun,
    LucideMoon,
    RouterLink,
    SANRING_POPOVER_IMPORTS,
  ],
  template: `
    <div class="flex min-w-0 items-center gap-6 max-[860px]:w-full max-[860px]:gap-3">
      <div class="max-[860px]:min-w-0 max-[860px]:flex-1">
        <sanring-popover [(isOpen)]="isSearchOpen" align="start">
          <label class="block" sanringPopoverTrigger>
            <span class="sr-only">{{ i18n.t('search.label') }}</span>
            <input
              sanringInput
              class="w-[330px] max-[980px]:w-[min(46vw,300px)] max-[860px]:w-full"
              type="search"
              autocomplete="off"
              [placeholder]="i18n.t('search.placeholder')"
              [value]="query()"
              (input)="onQueryInput($event)"
              (keydown)="onSearchKeydown($event)"
            />
          </label>
          <sanring-popover-content class="w-[330px] p-1">
            @if (results().length) {
              @for (result of results(); track result.path; let i = $index) {
                <a
                  [routerLink]="result.path"
                  (click)="closeSearch()"
                  (mouseenter)="activeIndex.set(i)"
                  class="flex min-h-8 items-center gap-3 rounded-[var(--sanring-radius-sm)] px-3 text-sm text-[var(--docs-fg)] no-underline transition-colors"
                  [class]="i === activeIndex() ? 'bg-[var(--docs-active)]' : ''"
                >
                  <span class="truncate">{{ result.label }}</span>
                  <span class="ml-auto shrink-0 truncate text-xs text-[var(--docs-muted)]">{{
                    result.path
                  }}</span>
                </a>
              }
            } @else if (query().trim()) {
              <p class="px-3 py-2 text-sm text-[var(--docs-muted)]">
                {{ i18n.t('search.noResults') }}
              </p>
            }
          </sanring-popover-content>
        </sanring-popover>
      </div>

      <div class="flex flex-none items-center gap-4 max-[860px]:gap-3">
        <app-header-action-button ariaLabel="GitHub" (clicked)="gotoGithub()">
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.93.85.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 7c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
            />
          </svg>
        </app-header-action-button>

        <app-header-action-button
          [ariaLabel]="i18n.t('actions.toggleTheme')"
          (clicked)="toggleTheme()"
        >
          @if (isDark()) {
            <svg class="size-4" lucideMoon></svg>
          } @else {
            <svg class="size-4" lucideSun></svg>
          }
        </app-header-action-button>

        <button sanringBtn class="flex-none" type="button" variant="default" size="toolbar">
          {{ i18n.t('actions.new') }}
        </button>
      </div>
    </div>
  `,
})
export class FeatureListComponent {
  protected readonly githubLink = 'https://github.com/sanringtech';

  protected readonly i18n = inject(I18nService);
  protected readonly isDark = signal(true);

  private readonly router = inject(Router);

  protected readonly query = signal('');
  protected readonly isSearchOpen = signal(false);
  protected readonly activeIndex = signal(0);

  private readonly searchItems = computed(() => {
    const sectionItems = docsSectionItems
      .filter((item): item is typeof item & { path: string } => !!item.path && !item.disabled)
      .map((item) => ({ label: this.i18n.t(item.labelKey), path: item.path }));
    const componentItems = docsComponentItems.map((item) => ({
      label: this.i18n.t(item.labelKey),
      path: item.path,
    }));

    return [...sectionItems, ...componentItems];
  });

  protected readonly results = computed<SearchResult[]>(() => {
    const query = this.query();
    if (!query.trim()) return [];

    const matches: SearchResult[] = [];
    for (const item of this.searchItems()) {
      const score = fuzzyMatch(query, item.label);
      if (score !== null) matches.push({ ...item, score });
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, MAX_SEARCH_RESULTS);
  });

  protected onQueryInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.activeIndex.set(0);
    this.isSearchOpen.set(value.trim().length > 0);
  }

  protected onSearchKeydown(event: KeyboardEvent) {
    const results = this.results();

    switch (event.key) {
      case 'ArrowDown':
        if (!results.length) return;
        event.preventDefault();
        this.activeIndex.update((index) => (index + 1) % results.length);
        return;
      case 'ArrowUp':
        if (!results.length) return;
        event.preventDefault();
        this.activeIndex.update((index) => (index - 1 + results.length) % results.length);
        return;
      case 'Enter': {
        const result = results[this.activeIndex()];
        if (!result) return;
        event.preventDefault();
        this.router.navigateByUrl(result.path);
        this.closeSearch();
        return;
      }
      case 'Escape':
        this.isSearchOpen.set(false);
        return;
    }
  }

  protected closeSearch() {
    this.isSearchOpen.set(false);
  }

  protected toggleTheme() {
    this.isDark.update((value) => {
      document.documentElement.dataset['theme'] = value ? 'light' : 'dark';
      return !value;
    });
  }

  protected gotoGithub() {
    window.open(this.githubLink, '_blank', 'noopener,noreferrer');
  }
}
