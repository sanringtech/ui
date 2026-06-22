import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'components/accordion',
      },
      {
        path: '',
        loadComponent: () =>
          import('./layouts/docs-article-shell.component').then((m) => m.DocsArticleShellComponent),
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
                loadComponent: () =>
                  import('./pages/components/components-page.component').then(
                    (m) => m.ComponentsPageComponent,
                  ),
              },
              {
                path: 'accordion',
                loadComponent: () =>
                  import('./pages/components/accordion/accordion-page.component').then(
                    (m) => m.AccordionPageComponent,
                  ),
              },
              {
                path: 'alert',
                loadComponent: () =>
                  import('./pages/components/alert/alert-page.component').then(
                    (m) => m.AlertPageComponent,
                  ),
              },
              {
                path: 'badge',
                loadComponent: () =>
                  import('./pages/components/badge/badge-page.component').then(
                    (m) => m.BadgePageComponent,
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
                path: 'card',
                loadComponent: () =>
                  import('./pages/components/card/card-page.component').then(
                    (m) => m.CardPageComponent,
                  ),
              },
              {
                path: 'dialog',
                loadComponent: () =>
                  import('./pages/components/dialog/dialog-page.component').then(
                    (m) => m.DialogPageComponent,
                  ),
              },
              {
                path: 'divider',
                loadComponent: () =>
                  import('./pages/components/divider/divider-page.component').then(
                    (m) => m.DividerPageComponent,
                  ),
              },
              {
                path: 'input',
                loadComponent: () =>
                  import('./pages/components/input/input-page.component').then(
                    (m) => m.InputPageComponent,
                  ),
              },
              {
                path: 'label',
                loadComponent: () =>
                  import('./pages/components/label/label-page.component').then(
                    (m) => m.LabelPageComponent,
                  ),
              },
              {
                path: 'link',
                loadComponent: () =>
                  import('./pages/components/link/link-page.component').then(
                    (m) => m.LinkPageComponent,
                  ),
              },
              {
                path: 'scroll-area',
                loadComponent: () =>
                  import('./pages/components/scroll-area/scroll-area-page.component').then(
                    (m) => m.ScrollAreaPageComponent,
                  ),
              },
              {
                path: 'skeleton',
                loadComponent: () =>
                  import('./pages/components/skeleton/skeleton-page.component').then(
                    (m) => m.SkeletonPageComponent,
                  ),
              },
              {
                path: 'switch',
                loadComponent: () =>
                  import('./pages/components/switch/switch-page.component').then(
                    (m) => m.SwitchPageComponent,
                  ),
              },
              {
                path: 'tag',
                loadComponent: () =>
                  import('./pages/components/tag/tag-page.component').then(
                    (m) => m.TagPageComponent,
                  ),
              },
              {
                path: 'tabs',
                loadComponent: () =>
                  import('./pages/components/tabs/tabs-page.component').then(
                    (m) => m.TabsPageComponent,
                  ),
              },
              {
                path: 'tooltip',
                loadComponent: () =>
                  import('./pages/components/tooltip/tooltip-page.component').then(
                    (m) => m.TooltipPageComponent,
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
