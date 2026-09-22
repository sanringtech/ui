import { commonTranslations } from './common';
import { componentTranslations } from './components';
import { pageTranslations } from './pages';

/** Locale catalog for English docs copy. */
export const en = {
  ...commonTranslations,
  ...pageTranslations,
  ...componentTranslations,
} as const;
