import { commonTranslations } from './common';
import { componentTranslations } from './components';
import { pageTranslations } from './pages';

export const zh = {
  ...commonTranslations,
  ...pageTranslations,
  ...componentTranslations,
} as const;
