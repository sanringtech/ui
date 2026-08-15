import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideMenu, LucideMonitor, LucideMoon, LucideSearch, LucideSun } from '@lucide/angular';
import { CommandDialogComponent, SANRING_COMMAND_IMPORTS, SANRING_SHEET_IMPORTS } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import {
  docsComponentItems,
  docsSectionItems,
  visibleDocsComponentItems,
} from '../../navigation/docs-navigation';
import { isRecentlyUpdatedComponentId } from '../../pages/changelog/component-changelog';
import { DocsComponentsListComponent } from '../sidebar/docs-components-list.component';
import { DocsSectionComponent } from '../sidebar/docs-section.component';
import { DocsNavStateService } from '../docs-nav-state.service';
import { DocsThemePreference, DocsThemeService } from '../docs-theme.service';
import { fuzzyMatch } from './fuzzy-match';
import { HeaderActionButtonComponent } from './header-action-button.component';

interface SearchItem {
  label: string;
  description?: string;
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
    RouterLink,
    DocsComponentsListComponent,
    DocsSectionComponent,
    LucideMenu,
    LucideSearch,
    LucideSun,
    LucideMoon,
    LucideMonitor,
    SANRING_COMMAND_IMPORTS,
    SANRING_SHEET_IMPORTS,
  ],
  host: {
    // header 在 max-[860px] 會 flex-wrap，這個元件變成獨自一行的 flex item。
    // flex item 預設 min-width:auto 會被內部不縮小的按鈕群（flex-none）撐爆，
    // 明確設 min-width:0 讓內部的搜尋框改用自身 flex-1 正確縮小。
    class: 'block min-w-0',
  },
  template: `
    <div class="flex min-w-0 items-center gap-6 max-[860px]:w-full max-[860px]:flex-wrap max-[860px]:gap-3">
      <sanring-sheet [(isOpen)]="navState.mobileNavOpen">
        <app-header-action-button
          class="hidden flex-none max-[980px]:block max-[860px]:order-1"
          [ariaLabel]="i18n.t('sidebar.openMenu')"
          (clicked)="navState.mobileNavOpen.set(true)"
        >
          <svg class="size-4" lucideMenu></svg>
        </app-header-action-button>

        <sanring-sheet-content side="left" class="flex max-w-[min(92vw,360px)] flex-col border-r border-[var(--docs-border)] bg-[var(--docs-bg)] p-0">
          <div class="border-b border-[var(--docs-border)] px-5 pb-5 pt-6">
            <a
              class="inline-flex items-center gap-3 text-[var(--docs-fg)] no-underline"
              routerLink="/"
              sanringSheetClose
            >
              <span class="grid size-10 shrink-0 place-items-center rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_36%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-surface))]">
                <img class="size-6" src="sanring_ui.svg" alt="" />
              </span>
              <span class="min-w-0">
                <span class="block truncate text-base font-semibold">Sanring UI</span>
                <span class="mt-0.5 block truncate text-xs text-[var(--docs-muted)]">
                  {{ i18n.t('home.eyebrow') }}
                </span>
              </span>
            </a>
          </div>

          <div
            sanringSheetClose
            class="min-h-0 flex-1 overflow-auto px-5 py-5"
          >
            <app-docs-section
              [title]="i18n.t('sidebar.sections')"
              [items]="mobileNavigationItems"
            />

            @if (navState.hasSidebar()) {
              <app-docs-components-list sectionClass="mt-8 border-t border-[var(--docs-border)] pt-5" />
            } @else {
              <app-docs-section
                [title]="i18n.t('sidebar.components')"
                [items]="mobileComponentItems"
                sectionClass="mt-8 border-t border-[var(--docs-border)] pt-5"
              />
            }
          </div>
        </sanring-sheet-content>
      </sanring-sheet>

      <a
        class="hidden min-w-0 items-center justify-self-start rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_36%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-surface))] px-3 py-2 no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--docs-accent)_14%,var(--docs-elevated))] max-[860px]:order-2 max-[860px]:inline-flex"
        routerLink="/"
        [attr.aria-label]="i18n.t('nav.home')"
      >
        <img class="size-6 shrink-0" src="sanring_ui.svg" alt="" />
      </a>

      <div class="max-[860px]:order-4 max-[860px]:w-full max-[860px]:min-w-0">
        <button
          type="button"
          class="flex h-10 w-[330px] items-center gap-2 rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-border)_86%,transparent)] bg-[color-mix(in_srgb,var(--docs-elevated)_82%,transparent)] px-3 text-sm text-[var(--docs-muted)] shadow-sm transition-colors hover:border-[color-mix(in_srgb,var(--docs-accent)_38%,var(--docs-border-strong))] hover:bg-[var(--docs-elevated)] max-[980px]:w-[min(46vw,300px)] max-[860px]:w-full"
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
                <sanring-command-item [value]="item.path" class="flex-col items-start gap-0.5 px-4 py-3">
                  <div class="flex w-full items-center gap-2">
                    <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                    <span class="ml-auto shrink-0 truncate text-xs text-[var(--sanring-muted)]">{{
                      item.path
                    }}</span>
                  </div>
                  @if (item.description) {
                    <span class="w-full truncate text-xs text-[var(--sanring-muted)]">{{
                      item.description
                    }}</span>
                  }
                </sanring-command-item>
              }
            </sanring-command-list>
          </sanring-command>
        </sanring-command-dialog>
      </div>

      <div class="flex flex-none items-center gap-4 max-[860px]:order-3 max-[860px]:ml-auto max-[860px]:justify-end max-[860px]:gap-3">
        <app-header-action-button class="max-[520px]:hidden" ariaLabel="GitHub" (clicked)="gotoGithub()">
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

        <div
          class="relative inline-grid h-11 grid-cols-3 items-center gap-1.5 overflow-hidden rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-border)_86%,transparent)] bg-[color-mix(in_srgb,var(--docs-elevated)_82%,transparent)] p-1 shadow-sm"
          role="group"
          [attr.aria-label]="i18n.t('actions.selectTheme')"
        >
          <span
            class="pointer-events-none absolute left-1 top-1 size-8 rounded-[var(--sanring-radius-sm)] bg-[var(--docs-panel)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--docs-border)_72%,transparent)] transition-transform duration-200 ease-out motion-reduce:transition-none"
            [style.transform]="themeIndicatorTransform()"
            aria-hidden="true"
          ></span>
          <button
            type="button"
            [class]="themeButtonClass('light')"
            [attr.aria-label]="i18n.t('actions.themeLight')"
            [attr.title]="i18n.t('actions.themeLight')"
            [attr.aria-pressed]="theme.preference() === 'light'"
            (click)="theme.setPreference('light')"
          >
            <svg class="size-4" lucideSun></svg>
          </button>
          <button
            type="button"
            [class]="themeButtonClass('dark')"
            [attr.aria-label]="i18n.t('actions.themeDark')"
            [attr.title]="i18n.t('actions.themeDark')"
            [attr.aria-pressed]="theme.preference() === 'dark'"
            (click)="theme.setPreference('dark')"
          >
            <svg class="size-4" lucideMoon></svg>
          </button>
          <button
            type="button"
            [class]="themeButtonClass('system')"
            [attr.aria-label]="i18n.t('actions.themeSystem')"
            [attr.title]="i18n.t('actions.themeSystem')"
            [attr.aria-pressed]="theme.preference() === 'system'"
            (click)="theme.setPreference('system')"
          >
            <svg class="size-4" lucideMonitor></svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FeatureListComponent {
  protected readonly githubLink = 'https://github.com/sanringtech';

  protected readonly i18n = inject(I18nService);
  protected readonly navState = inject(DocsNavStateService);
  protected readonly theme = inject(DocsThemeService);

  private readonly router = inject(Router);

  protected readonly query = signal('');
  protected readonly mobileNavigationItems = [
    { labelKey: 'nav.home' as const, path: '/', exact: true, active: true },
    ...docsSectionItems,
  ];
  protected readonly mobileComponentItems = visibleDocsComponentItems.map((item) => ({
    ...item,
    badge: isRecentlyUpdatedComponentId(item.id),
  }));

  private readonly searchIndex = computed<SearchItem[]>(() => {
    const sectionItems = docsSectionItems
      .filter((item): item is typeof item & { path: string } => !!item.path && !item.disabled)
      .map((item) => ({ label: this.i18n.t(item.labelKey), path: item.path }));
    const componentItems = docsComponentItems
      .filter((item) => !item.disabled)
      .map((item) => ({
        label: this.i18n.t(item.labelKey),
        description: this.i18n.t(item.descriptionKey),
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
      const labelScore = fuzzyMatch(query, item.label);
      const descriptionScore = item.description ? fuzzyMatch(query, item.description) : null;
      if (labelScore === null && descriptionScore === null) continue;

      // 名稱命中永遠排在描述命中前面：加一個固定的大偏移量，只在名稱沒中時才退而求其次
      // 用描述分數，讓使用者可以用功能敘述（例如「floating label」）找到元件，但不會蓋過
      // 直接打對名稱的結果。
      const score = labelScore !== null ? labelScore + 10_000 : (descriptionScore as number);
      matches.push({ ...item, score });
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

  protected themeButtonClass(preference: DocsThemePreference): string {
    const base =
      'relative z-10 grid size-8 place-items-center rounded-[var(--sanring-radius-sm)] text-[var(--docs-muted)] transition-colors duration-150 hover:text-[var(--docs-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]';
    if (this.theme.preference() !== preference) return base;
    return `${base} text-[var(--docs-fg)]`;
  }

  protected themeIndicatorTransform(): string {
    const index: Record<DocsThemePreference, number> = { light: 0, dark: 1, system: 2 };
    return `translateX(calc(${index[this.theme.preference()]} * (2rem + 0.375rem)))`;
  }

  protected gotoGithub() {
    window.open(this.githubLink, '_blank', 'noopener,noreferrer');
  }
}
