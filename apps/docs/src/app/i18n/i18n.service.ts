import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import {
  defaultLocale,
  localeLabels,
  Locale,
  supportedLocales,
  TranslationKey,
  translations,
} from './translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'sanring-docs-locale';
  private readonly localeState = signal<Locale>(this.resolveInitialLocale());

  readonly locale = this.localeState.asReadonly();
  readonly localeLabels = localeLabels;
  readonly supportedLocales = supportedLocales;

  constructor() {
    effect(() => {
      const locale = this.locale();

      this.document.documentElement.lang = localeLabels[locale].htmlLang;
      this.document.documentElement.dataset['locale'] = locale;
      this.writeStoredLocale(locale);
    });
  }

  setLocale(locale: Locale) {
    this.localeState.set(locale);
  }

  toggleLocale() {
    this.localeState.update((locale) => (locale === 'en' ? 'zh' : 'en'));
  }

  t(key: TranslationKey) {
    return translations[this.locale()][key];
  }

  private resolveInitialLocale(): Locale {
    const storedLocale = this.readStoredLocale();

    if (storedLocale) {
      return storedLocale;
    }

    if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')) {
      return 'zh';
    }

    return defaultLocale;
  }

  private readStoredLocale(): Locale | null {
    try {
      const locale = localStorage.getItem(this.storageKey);
      return this.isSupportedLocale(locale) ? locale : null;
    } catch {
      return null;
    }
  }

  private writeStoredLocale(locale: Locale) {
    try {
      localStorage.setItem(this.storageKey, locale);
    } catch {
      return;
    }
  }

  private isSupportedLocale(locale: string | null): locale is Locale {
    return supportedLocales.some((supportedLocale) => supportedLocale === locale);
  }
}
