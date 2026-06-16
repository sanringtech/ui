import { Routes } from '@angular/router';

export interface MenuItem {
  name: string;
  path: string;
  exact: boolean;
}

export interface DocsSidebarItem {
  name: string;
  path?: string;
  active?: boolean;
  badge?: boolean;
  disabled?: boolean;
}

export const menuItems: MenuItem[] = [
  { name: 'Home', path: '/', exact: true },
  { name: 'Docs', path: '/', exact: true },
  { name: 'Components', path: '/components/accordion', exact: false },
  { name: 'Blocks', path: '/', exact: true },
  { name: 'Charts', path: '/', exact: true },
  { name: 'Directory', path: '/', exact: true },
  { name: 'Create', path: '/', exact: true },
];

export const docsSectionItems: DocsSidebarItem[] = [
  { name: 'Introduction', path: '/' },
  { name: 'Components', path: '/components/accordion', active: true },
  { name: 'Installation', path: '/' },
  { name: 'Theming', path: '/' },
  { name: 'CLI', path: '/' },
  { name: 'RTL', path: '/' },
  { name: 'Skills', path: '/' },
  { name: 'MCP Server', path: '/' },
  { name: 'Registry', path: '/' },
  { name: 'Forms', path: '/' },
  { name: 'Changelog', path: '/', badge: true },
];

export const docsComponentItems: DocsSidebarItem[] = [
  { name: 'Accordion', path: '/components/accordion', active: true },
  { name: 'Alert', path: '/' },
  { name: 'Alert Dialog', path: '/' },
  { name: 'Aspect Ratio', path: '/' },
  { name: 'Avatar', path: '/' },
  { name: 'Badge', path: '/' },
  { name: 'Breadcrumb', path: '/' },
  { name: 'Button', disabled: true },
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/docs-layout.component').then((m) => m.DocsLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'components/accordion',
      },
      {
        path: 'components/accordion',
        loadComponent: () =>
          import('./pages/components/accordion/accordion-page.component').then(
            (m) => m.AccordionPageComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'components/accordion',
  },
];
