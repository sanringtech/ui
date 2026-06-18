import { TranslationKey } from '../i18n/translations';

export interface MenuItem {
  labelKey: TranslationKey;
  path: string;
  exact: boolean;
}

export const menuItems: MenuItem[] = [
  { labelKey: 'nav.home', path: '/', exact: true },
  { labelKey: 'nav.docs', path: '/', exact: true },
  { labelKey: 'nav.components', path: '/components/accordion', exact: false },
  { labelKey: 'nav.blocks', path: '/', exact: true },
  { labelKey: 'nav.charts', path: '/', exact: true },
  { labelKey: 'nav.directory', path: '/', exact: true },
  { labelKey: 'nav.create', path: '/', exact: true },
];
