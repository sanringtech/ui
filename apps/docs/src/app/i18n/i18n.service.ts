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
  private readonly localeState = signal<Locale>(defaultLocale);

  readonly locale = this.localeState.asReadonly();
  readonly localeLabels = localeLabels;
  readonly supportedLocales = supportedLocales;

  constructor() {
    effect(() => {
      const locale = this.locale();

      this.document.documentElement.lang = localeLabels[locale].htmlLang;
      this.document.documentElement.dataset['locale'] = locale;
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
}
