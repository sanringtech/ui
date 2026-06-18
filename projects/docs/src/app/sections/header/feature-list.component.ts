import { Component, inject, signal } from '@angular/core';
import { LucideLanguages, LucideMoon, LucideSun } from '@lucide/angular';
import { Button } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { HeaderActionButtonComponent } from './header-action-button.component';

@Component({
  selector: 'app-feature-list',
  imports: [Button, HeaderActionButtonComponent, LucideSun, LucideMoon, LucideLanguages],
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
          <img
            class="size-5"
            [src]="githubIconUrl"
            alt=""
            [style.filter]="isDark() ? 'invert(1)' : null"
          />
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

        <sanring-button class="flex-none" type="button" variant="default" size="toolbar">
          {{ i18n.t('actions.new') }}
        </sanring-button>
      </div>
    </div>
  `,
})
export class FeatureListComponent {
  protected readonly githubLink = 'https://github.com/sanringtech';

  protected readonly i18n = inject(I18nService);
  protected readonly githubIconUrl =
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg';
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
