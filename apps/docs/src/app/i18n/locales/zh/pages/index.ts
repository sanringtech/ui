import { changelogTranslations } from './changelog';
import { cliTranslations } from './cli';
import { homeTranslations } from './home';
import { introTranslations } from './intro';
import { roadmapTranslations } from './roadmap';
import { themingTranslations } from './theming';

export const pageTranslations = {
  ...changelogTranslations,
  ...cliTranslations,
  ...homeTranslations,
  ...introTranslations,
  ...roadmapTranslations,
  ...themingTranslations,
} as const;
