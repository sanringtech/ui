import {
  ComponentPageDefinition,
  ComponentPageSectionDefinition,
} from './component-page.types';

export function getComponentPageSection(
  page: ComponentPageDefinition,
  id: string,
): ComponentPageSectionDefinition {
  const section = findComponentPageSection(page.sections, id);

  if (!section) {
    throw new Error(`Missing ${page.componentId} docs section: ${id}`);
  }

  return section;
}

function findComponentPageSection(
  sections: readonly ComponentPageSectionDefinition[],
  id: string,
): ComponentPageSectionDefinition | null {
  for (const section of sections) {
    if (section.id === id) {
      return section;
    }

    const childSection = findComponentPageSection(section.children ?? [], id);

    if (childSection) {
      return childSection;
    }
  }

  return null;
}
