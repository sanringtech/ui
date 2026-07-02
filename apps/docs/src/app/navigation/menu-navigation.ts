import { TranslationKey } from '../i18n/translations';

export interface MenuItem {
  labelKey: TranslationKey;
  path: string;
  exact: boolean;
}

export const menuItems: MenuItem[] = [
  { labelKey: 'nav.components', path: '/components', exact: false },
];
