import { en } from './locales/en';
import { zh } from './locales/zh';

export const supportedLocales = ['en', 'zh'] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, { label: string; shortLabel: string; htmlLang: string }> =
  {
    en: { label: 'English', shortLabel: 'EN', htmlLang: 'en' },
    zh: { label: '中文', shortLabel: '中文', htmlLang: 'zh-Hant' },
  };

export type TranslationKey = keyof typeof en;

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  en,
  zh,
};
