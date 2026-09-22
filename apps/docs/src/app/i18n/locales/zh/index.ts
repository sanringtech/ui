import { commonTranslations } from './common';
import { componentTranslations } from './components';
import { pageTranslations } from './pages';

/** Locale catalog for Traditional Chinese docs copy. */
export const zh = {
  ...commonTranslations,
  ...pageTranslations,
  ...componentTranslations,
} as const;
