import { changelogTranslations } from './changelog';
import { cliTranslations } from './cli';
import { homeTranslations } from './home';
import { introTranslations } from './intro';
import { mcpTranslations } from './mcp';
import { registryTranslations } from './registry';
import { roadmapTranslations } from './roadmap';
import { themingTranslations } from './theming';

export const pageTranslations = {
  ...changelogTranslations,
  ...cliTranslations,
  ...homeTranslations,
  ...introTranslations,
  ...mcpTranslations,
  ...registryTranslations,
  ...roadmapTranslations,
  ...themingTranslations,
} as const;
