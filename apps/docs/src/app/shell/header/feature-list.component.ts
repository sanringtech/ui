import { Component, inject, signal } from '@angular/core';
import { LucideLanguages, LucideMoon, LucideSun } from '@lucide/angular';
import { ButtonDirective } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { HeaderActionButtonComponent } from './header-action-button.component';

@Component({
  selector: 'app-feature-list',
  imports: [ButtonDirective, HeaderActionButtonComponent, LucideSun, LucideMoon, LucideLanguages],
  template: `
    <div class="flex min-w-0 items-center gap-6 max-[860px]:w-full max-[860px]:gap-3">
      <label class="max-[860px]:min-w-0 max-[860px]:flex-1">
        <span class="sr-only">{{ i18n.t('search.label') }}</span>
        <input
          class="h-10 w-[330px] rounded-lg border border-transparent bg-[var(--docs-elevated)] px-4 text-[var(--docs-fg)] outline-none focus:border-[var(--docs-border-strong)] max-[980px]:w-[min(46vw,300px)] max-[860px]:w-full"
          type="search"
          [placeholder]="i18n.t('search.placeholder')"
        />
      </label>

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

        <app-header-action-button
          size="toolbar"
          [ariaLabel]="i18n.t('actions.selectLanguage')"
          (clicked)="i18n.toggleLocale()"
        >
          <svg class="size-4" lucideLanguages></svg>
          <span>{{ i18n.localeLabels[i18n.locale()].shortLabel }}</span>
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
