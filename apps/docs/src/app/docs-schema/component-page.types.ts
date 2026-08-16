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

export interface ComponentPageApiRow {
  property: string;
  type: string;
  defaultValue: string;
  descriptionKey: TranslationKey;
}

export interface ComponentPageKeyboardRow {
  keys: string;
  descriptionKey: TranslationKey;
}

export interface ComponentPageDefinition {
  componentId: DocsComponentId;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  sections: readonly ComponentPageSectionDefinition[];
  apiRows?: readonly ComponentPageApiRow[];
  keyboardRows?: readonly ComponentPageKeyboardRow[];
  /** Shared registry deps (registry.json `sharedDeps`), e.g. `['utils', 'component-styles']`. */
  registryDeps?: readonly string[];
  /** Whether the component avoids direct browser-only APIs (window/document/navigator) and is safe under SSR. */
  ssrSafe?: boolean;
}
