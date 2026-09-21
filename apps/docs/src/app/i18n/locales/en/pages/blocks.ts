export const blocksTranslations = {
  'blocks.page.description':
    'Installable page-level templates. One command copies the block and the components it is built from.',
  'blocks.overview.title': 'Overview',
  'blocks.overview.body':
    'Blocks are composed from existing Sanring components. They are not part of the UI package — the CLI copies them into your app so you can edit the source. Use the block/ prefix when you want to be explicit, or the bare name when it does not collide with a component.',
  'blocks.install.title': 'Install',
  'blocks.dashboard.title': 'Dashboard shell',
  'blocks.dashboard.body':
    'Persistent app chrome: sidebar, breadcrumbs, and a user menu. Project your page into ng-content.',
  'blocks.login.title': 'Login',
  'blocks.login.body': 'A sign-in card with email, password, remember-me, and an error alert.',
  'blocks.table.title': 'Table page',
  'blocks.table.body':
    'A data table with search, status filter, row selection, a create sheet, loading skeletons, and toast.',
} as const;
