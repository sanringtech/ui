import { Routes } from '@angular/router';

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
