import { DocsComponentId } from '../docs-navigation';
import { TranslationKey } from '../i18n/translations';

export interface ComponentPageSectionDefinition {
  id: string;
  titleKey: TranslationKey;
  descriptionKey?: TranslationKey;
  level?: 2 | 3;
  hideFromToc?: boolean;
}

export interface ComponentPageDefinition {
  componentId: DocsComponentId;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  sections: readonly ComponentPageSectionDefinition[];
}
