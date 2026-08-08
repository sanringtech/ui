import { DOCUMENT } from '@angular/common';
import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';

export type DocsThemePreference = 'light' | 'dark' | 'system';
export type DocsResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'sanring-docs-theme';

function isThemePreference(value: string | null): value is DocsThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

@Injectable({ providedIn: 'root' })
export class DocsThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly preferenceState = signal<DocsThemePreference>('system');
  private readonly systemThemeState = signal<DocsResolvedTheme>('dark');
  private hasAppliedTheme = false;
  private transitionTimeout: ReturnType<Window['setTimeout']> | undefined;

  readonly preference = this.preferenceState.asReadonly();
  readonly systemTheme = this.systemThemeState.asReadonly();

  constructor() {
    const win = this.document.defaultView;

    if (win) {
      const stored = this.readStoredPreference(win);
      if (isThemePreference(stored)) this.preferenceState.set(stored);

      const media = win.matchMedia('(prefers-color-scheme: light)');
      const updateSystemTheme = () => {
        this.systemThemeState.set(media.matches ? 'light' : 'dark');
      };

      updateSystemTheme();
      media.addEventListener('change', updateSystemTheme);
      this.destroyRef.onDestroy(() => media.removeEventListener('change', updateSystemTheme));
    }

    effect(() => {
      const preference = this.preference();
      const resolved = preference === 'system' ? this.systemTheme() : preference;
      const root = this.document.documentElement;

      if (this.hasAppliedTheme) this.startThemeTransition(root, win);
      root.dataset['theme'] = resolved;
      root.dataset['themePreference'] = preference;
      root.style.colorScheme = resolved;
      this.writeStoredPreference(win, preference);
      this.hasAppliedTheme = true;
    });
  }

  setPreference(preference: DocsThemePreference): void {
    this.preferenceState.set(preference);
  }

  private readStoredPreference(win: Window): string | null {
    try {
      return win.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private writeStoredPreference(win: Window | null, preference: DocsThemePreference): void {
    try {
      win?.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Theme still applies for the current session when storage is unavailable.
    }
  }

  private startThemeTransition(root: HTMLElement, win: Window | null): void {
    if (!win || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (this.transitionTimeout !== undefined) win.clearTimeout(this.transitionTimeout);
    root.classList.add('theme-transitioning');
    this.transitionTimeout = win.setTimeout(() => {
      root.classList.remove('theme-transitioning');
      this.transitionTimeout = undefined;
    }, 260);
  }
}
