import { DocsComponentId } from '../navigation/docs-navigation';
import { TranslationKey } from '../i18n/translations';

export interface ComponentPageSectionDefinition {
  id: string;
  titleKey: TranslationKey;
  descriptionKey?: TranslationKey;
  level?: 2 | 3 | 4;
  hideFromToc?: boolean;
  children?: readonly ComponentPageSectionDefinition[];
}

export interface ComponentPageDefinition {
  componentId: DocsComponentId;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  sections: readonly ComponentPageSectionDefinition[];
}
