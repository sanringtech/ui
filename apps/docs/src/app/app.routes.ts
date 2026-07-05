import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import('./layouts/docs-article-shell.component').then((m) => m.DocsArticleShellComponent),
        children: [
          {
            path: 'introduction',
            loadComponent: () =>
              import('./pages/introduction/introduction-page.component').then(
                (m) => m.IntroductionPageComponent,
              ),
          },
          {
            path: 'theming',
            loadComponent: () =>
              import('./pages/theming/theming-page.component').then(
                (m) => m.ThemingPageComponent,
              ),
          },
          {
            path: 'cli',
            loadComponent: () =>
              import('./pages/cli/cli-page.component').then((m) => m.CliPageComponent),
          },
          {
            path: 'changelog',
            loadComponent: () =>
              import('./pages/changelog/changelog-page.component').then(
                (m) => m.ChangelogPageComponent,
              ),
          },
          {
            path: 'roadmap',
            loadComponent: () =>
              import('./pages/roadmap/roadmap-page.component').then(
                (m) => m.RoadmapPageComponent,
              ),
          },
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
                path: 'breadcrumb',
                loadComponent: () =>
                  import('./pages/components/breadcrumb/breadcrumb-page.component').then(
                    (m) => m.BreadcrumbPageComponent,
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
                path: 'aspect-ratio',
                loadComponent: () =>
                  import('./pages/components/aspect-ratio/aspect-ratio-page.component').then(
                    (m) => m.AspectRatioPageComponent,
                  ),
              },
              {
                path: 'avatar',
                loadComponent: () =>
                  import('./pages/components/avatar/avatar-page.component').then(
                    (m) => m.AvatarPageComponent,
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
                path: 'checkbox',
                loadComponent: () =>
                  import('./pages/components/checkbox/checkbox-page.component').then(
                    (m) => m.CheckboxPageComponent,
                  ),
              },
              {
                path: 'collapsible',
                loadComponent: () =>
                  import('./pages/components/collapsible/collapsible-page.component').then(
                    (m) => m.CollapsiblePageComponent,
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
                path: 'dropdown-menu',
                loadComponent: () =>
                  import('./pages/components/dropdown-menu/dropdown-menu-page.component').then(
                    (m) => m.DropdownMenuPageComponent,
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
                path: 'pagination',
                loadComponent: () =>
                  import('./pages/components/pagination/pagination-page.component').then(
                    (m) => m.PaginationPageComponent,
                  ),
              },
              {
                path: 'popover',
                loadComponent: () =>
                  import('./pages/components/popover/popover-page.component').then(
                    (m) => m.PopoverPageComponent,
                  ),
              },
              {
                path: 'progress',
                loadComponent: () =>
                  import('./pages/components/progress/progress-page.component').then(
                    (m) => m.ProgressPageComponent,
                  ),
              },
              {
                path: 'radio',
                loadComponent: () =>
                  import('./pages/components/radio/radio-page.component').then(
                    (m) => m.RadioPageComponent,
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
                path: 'select',
                loadComponent: () =>
                  import('./pages/components/select/select-page.component').then(
                    (m) => m.SelectPageComponent,
                  ),
              },
              {
                path: 'sheet',
                loadComponent: () =>
                  import('./pages/components/sheet/sheet-page.component').then(
                    (m) => m.SheetPageComponent,
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
                path: 'slider',
                loadComponent: () =>
                  import('./pages/components/slider/slider-page.component').then(
                    (m) => m.SliderPageComponent,
                  ),
              },
              {
                path: 'spinner',
                loadComponent: () =>
                  import('./pages/components/spinner/spinner-page.component').then(
                    (m) => m.SpinnerPageComponent,
                  ),
              },
              {
                path: 'stepper',
                loadComponent: () =>
                  import('./pages/components/stepper/stepper-page.component').then(
                    (m) => m.StepperPageComponent,
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
                path: 'table',
                loadComponent: () =>
                  import('./pages/components/table/table-page.component').then(
                    (m) => m.TablePageComponent,
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
                path: 'textarea',
                loadComponent: () =>
                  import('./pages/components/textarea/textarea-page.component').then(
                    (m) => m.TextareaPageComponent,
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
                path: 'toggle',
                loadComponent: () =>
                  import('./pages/components/toggle/toggle-page.component').then(
                    (m) => m.TogglePageComponent,
                  ),
              },
              {
                path: 'toast',
                loadComponent: () =>
                  import('./pages/components/toast/toast-page.component').then(
                    (m) => m.ToastPageComponent,
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
    redirectTo: '',
  },
];
