import { Routes } from '@angular/router';
import { TranslationKey } from './i18n/translations';
export { docsComponentItems, docsSectionItems, type DocsSidebarItem } from './docs-navigation';

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

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'components/accordion',
      },
      {
        path: '',
        loadComponent: () =>
          import('./layouts/docs-article-shell.component').then(
            (m) => m.DocsArticleShellComponent,
          ),
        children: [
          {
            path: 'components',
            loadComponent: () =>
              import('./layouts/component-docs-layout.component').then(
                (m) => m.ComponentDocsLayoutComponent,
              ),
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'accordion',
              },
              {
                path: 'accordion',
                loadComponent: () =>
                  import('./pages/components/accordion/accordion-page.component').then(
                    (m) => m.AccordionPageComponent,
                  ),
              },
              {
                path: 'button',
                loadComponent: () =>
                  import('./pages/components/button/button-page.component').then(
                    (m) => m.ButtonPageComponent,
                  ),
              },
              {
                path: 'divider',
                loadComponent: () =>
                  import('./pages/components/divider/divider-page.component').then(
                    (m) => m.DividerPageComponent,
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'components/accordion',
  },
];
