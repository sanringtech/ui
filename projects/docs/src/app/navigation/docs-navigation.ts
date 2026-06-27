import { TranslationKey } from '../i18n/translations';

export interface DocsSidebarItem {
  labelKey: TranslationKey;
  path?: string;
  active?: boolean;
  badge?: boolean;
  disabled?: boolean;
}

export type DocsComponentId =
  | 'accordion'
  | 'alert'
  | 'alert-dialog'
  | 'aspect-ratio'
  | 'avatar'
  | 'badge'
  | 'breadcrumb'
  | 'button'
  | 'card'
  | 'checkbox'
  | 'collapsible'
  | 'dialog'
  | 'divider'
  | 'input'
  | 'label'
  | 'link'
  | 'progress'
  | 'radio'
  | 'scroll-area'
  | 'skeleton'
  | 'spinner'
  | 'switch'
  | 'tag'
  | 'tabs'
  | 'toggle'
  | 'tooltip';

export interface DocsComponentNavItem extends DocsSidebarItem {
  id: DocsComponentId;
  path: string;
}

export const docsSectionItems: DocsSidebarItem[] = [
  { labelKey: 'sidebar.introduction', path: '/' },
  { labelKey: 'nav.components', path: '/components', active: true },
  { labelKey: 'sidebar.installation', path: '/' },
  { labelKey: 'sidebar.theming', path: '/' },
  { labelKey: 'sidebar.cli', path: '/' },
  { labelKey: 'sidebar.rtl', path: '/' },
  { labelKey: 'sidebar.skills', path: '/' },
  { labelKey: 'sidebar.mcpServer', path: '/' },
  { labelKey: 'sidebar.registry', path: '/' },
  { labelKey: 'sidebar.forms', path: '/' },
  { labelKey: 'sidebar.changelog', path: '/', badge: true },
];

export const docsComponentItems: DocsComponentNavItem[] = [
  {
    id: 'accordion',
    labelKey: 'component.accordion',
    path: '/components/accordion',
    active: true,
  },
  {
    id: 'alert',
    labelKey: 'component.alert',
    path: '/components/alert',
    active: true,
  },
  // {
  //   id: 'alert-dialog',
  //   labelKey: 'component.alertDialog',
  //   path: '/components/alert-dialog',
  //   active: true,
  //   disabled: true,
  // },
  // {
  //   id: 'aspect-ratio',
  //   labelKey: 'component.aspectRatio',
  //   path: '/components/aspect-ratio',
  //   active: true,
  //   disabled: true,
  // },
  {
    id: 'avatar',
    labelKey: 'component.avatar',
    path: '/components/avatar',
    active: true,
  },
  {
    id: 'badge',
    labelKey: 'component.badge',
    path: '/components/badge',
    active: true,
  },
  // {
  //   id: 'breadcrumb',
  //   labelKey: 'component.breadcrumb',
  //   path: '/components/breadcrumb',
  //   active: true,
  //   disabled: true,
  // },
  {
    id: 'button',
    labelKey: 'component.button',
    path: '/components/button',
    active: true,
  },
  {
    id: 'card',
    labelKey: 'component.card',
    path: '/components/card',
    active: true,
  },
  {
    id: 'checkbox',
    labelKey: 'component.checkbox',
    path: '/components/checkbox',
    active: true,
  },
  {
    id: 'collapsible',
    labelKey: 'component.collapsible',
    path: '/components/collapsible',
    active: true,
  },
  {
    id: 'dialog',
    labelKey: 'component.dialog',
    path: '/components/dialog',
    active: true,
  },
  {
    id: 'divider',
    labelKey: 'component.divider',
    path: '/components/divider',
    active: true,
  },
  {
    id: 'input',
    labelKey: 'component.input',
    path: '/components/input',
    active: true,
  },
  {
    id: 'label',
    labelKey: 'component.label',
    path: '/components/label',
    active: true,
  },
  {
    id: 'link',
    labelKey: 'component.link',
    path: '/components/link',
    active: true,
  },
  {
    id: 'progress',
    labelKey: 'component.progress',
    path: '/components/progress',
    active: true,
  },
  {
    id: 'radio',
    labelKey: 'component.radio',
    path: '/components/radio',
    active: true,
  },
  {
    id: 'scroll-area',
    labelKey: 'component.scrollArea',
    path: '/components/scroll-area',
    active: true,
  },
  {
    id: 'skeleton',
    labelKey: 'component.skeleton',
    path: '/components/skeleton',
    active: true,
  },
  {
    id: 'spinner',
    labelKey: 'component.spinner',
    path: '/components/spinner',
    active: true,
  },
  {
    id: 'switch',
    labelKey: 'component.switch',
    path: '/components/switch',
    active: true,
  },
  {
    id: 'tag',
    labelKey: 'component.tag',
    path: '/components/tag',
    active: true,
  },
  {
    id: 'tabs',
    labelKey: 'component.tabs',
    path: '/components/tabs',
    active: true,
  },
  {
    id: 'toggle',
    labelKey: 'component.toggle',
    path: '/components/toggle',
    active: true,
  },
  {
    id: 'tooltip',
    labelKey: 'component.tooltip',
    path: '/components/tooltip',
    active: true,
  },
];

export const docsComponentItemsById = new Map(docsComponentItems.map((item) => [item.id, item]));

const enabledDocsComponentItems = docsComponentItems.filter((item) => !item.disabled);

export function getAdjacentDocsComponent(id: DocsComponentId) {
  const currentIndex = enabledDocsComponentItems.findIndex((item) => item.id === id);

  return {
    previous: currentIndex > 0 ? enabledDocsComponentItems[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < enabledDocsComponentItems.length - 1
        ? enabledDocsComponentItems[currentIndex + 1]
        : null,
  };
}
