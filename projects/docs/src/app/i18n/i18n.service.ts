import { Injectable, signal } from '@angular/core';

type Locale = 'en' | 'zh-TW';
type TranslationTree = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly translations = signal<TranslationTree>({});
  readonly locale = signal<Locale>('zh-TW');

  async load(locale: Locale) {
    const response = await fetch(`/i18n/${locale}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load locale: ${locale}`);
    }

    this.locale.set(locale);
    this.translations.set((await response.json()) as TranslationTree);
  }

  translate(key: string) {
    const value = key.split('.').reduce<unknown>((current, segment) => {
      if (!current || typeof current !== 'object') {
        return undefined;
      }

      return (current as Record<string, unknown>)[segment];
    }, this.translations());

    return typeof value === 'string' ? value : key;
  }
}
