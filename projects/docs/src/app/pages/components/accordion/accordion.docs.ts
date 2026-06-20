import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const accordionPage = {
  componentId: 'accordion',
  titleKey: 'component.accordion',
  descriptionKey: 'accordion.description',
  sections: [
    {
      id: 'code',
      titleKey: 'toc.code',
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'accordion.installation.description',
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'accordion.composition.description',
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'accordion.api.description',
    },
  ],
} as const satisfies ComponentPageDefinition;
