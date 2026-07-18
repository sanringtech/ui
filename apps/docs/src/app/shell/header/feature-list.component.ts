import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideMenu, LucideMoon, LucideSearch, LucideSun } from '@lucide/angular';
import { CommandDialogComponent, SANRING_COMMAND_IMPORTS } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { docsComponentItems, docsSectionItems } from '../../navigation/docs-navigation';
import { DocsNavStateService } from '../docs-nav-state.service';
import { fuzzyMatch } from './fuzzy-match';
import { HeaderActionButtonComponent } from './header-action-button.component';

interface SearchItem {
  label: string;
  path: string;
}

interface SearchResult extends SearchItem {
  score: number;
}

const MAX_SEARCH_RESULTS = 8;

@Component({
  selector: 'app-feature-list',
  imports: [
    HeaderActionButtonComponent,
    LucideMenu,
    LucideSearch,
    LucideSun,
    LucideMoon,
    SANRING_COMMAND_IMPORTS,
  ],
  host: {
    // header 在 max-[860px] 會 flex-wrap，這個元件變成獨自一行的 flex item。
    // flex item 預設 min-width:auto 會被內部不縮小的按鈕群（flex-none）撐爆，
    // 明確設 min-width:0 讓內部的搜尋框改用自身 flex-1 正確縮小。
    class: 'block min-w-0',
  },
  template: `
    <div class="flex min-w-0 items-center gap-6 max-[860px]:w-full max-[860px]:gap-3">
      @if (navState.hasSidebar()) {
        <app-header-action-button
          class="flex-none min-[861px]:hidden"
          [ariaLabel]="i18n.t('sidebar.openMenu')"
          (clicked)="navState.mobileNavOpen.set(true)"
        >
          <svg class="size-4" lucideMenu></svg>
        </app-header-action-button>
      }

      <div class="max-[860px]:min-w-0 max-[860px]:flex-1">
        <button
          type="button"
          class="flex h-10 w-[330px] items-center gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-3 text-sm text-[var(--docs-muted)] transition-colors hover:border-[var(--docs-border-strong)] max-[980px]:w-[min(46vw,300px)] max-[860px]:w-full"
          (click)="commandDialog.open()"
        >
          <svg class="size-4 shrink-0" lucideSearch></svg>
          <span class="min-w-0 flex-1 truncate text-left">{{ i18n.t('search.placeholder') }}</span>
          <span
            class="hidden shrink-0 rounded-[var(--sanring-radius-xs)] border border-[var(--docs-border)] px-1.5 py-0.5 font-mono text-xs text-[var(--docs-muted)] sm:inline-block"
          >
            {{ commandDialog.shortcutHint() }}
          </span>
        </button>

        <sanring-command-dialog
          #commandDialog
          [ariaLabel]="i18n.t('search.label')"
          class="max-w-3xl"
        >
          <sanring-command [shouldFilter]="false" (valueChange)="onSelect($event, commandDialog)">
            <sanring-command-input
              [placeholder]="i18n.t('search.placeholder')"
              (queryChange)="onQueryChange($event)"
            />
            <sanring-command-list
              class="min-h-[360px] max-h-[min(560px,calc(100vh-14rem))] p-2"
            >
              <sanring-command-empty class="py-20">
                {{ i18n.t('search.noResults') }}
              </sanring-command-empty>
              @for (item of filteredItems(); track item.path) {
                <sanring-command-item [value]="item.path" class="px-4 py-3">
                  <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                  <span class="ml-auto shrink-0 truncate text-xs text-[var(--sanring-muted)]">{{
                    item.path
                  }}</span>
                </sanring-command-item>
              }
            </sanring-command-list>
          </sanring-command>
        </sanring-command-dialog>
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
      </div>
    </div>
  `,
})
export class FeatureListComponent {
  protected readonly githubLink = 'https://github.com/sanringtech';

  protected readonly i18n = inject(I18nService);
  protected readonly navState = inject(DocsNavStateService);
  protected readonly isDark = signal(true);

  private readonly router = inject(Router);

  protected readonly query = signal('');

  private readonly searchIndex = computed<SearchItem[]>(() => {
    const sectionItems = docsSectionItems
      .filter((item): item is typeof item & { path: string } => !!item.path && !item.disabled)
      .map((item) => ({ label: this.i18n.t(item.labelKey), path: item.path }));
    const componentItems = docsComponentItems
      .filter((item) => !item.disabled)
      .map((item) => ({
        label: this.i18n.t(item.labelKey),
        path: item.path,
      }));

    return [...sectionItems, ...componentItems];
  });

  // 空字串時直接瀏覽全部項目（Command Dialog 是完整 modal，讓使用者不用打字也能瀏覽比較合理）；
  // 有輸入才走 fuzzy match + 排序 + 截斷，避免結果洗版。
  protected readonly filteredItems = computed<SearchItem[]>(() => {
    const query = this.query();
    const index = this.searchIndex();

    if (!query.trim()) return index;

    const matches: SearchResult[] = [];
    for (const item of index) {
      const score = fuzzyMatch(query, item.label);
      if (score !== null) matches.push({ ...item, score });
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, MAX_SEARCH_RESULTS);
  });

  protected onQueryChange(value: string) {
    this.query.set(value);
  }

  protected onSelect(path: string, dialog: CommandDialogComponent) {
    this.router.navigateByUrl(path);
    dialog.close();
    this.query.set('');
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
