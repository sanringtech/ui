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
  'blocks.org.title': 'Org chart',
  'blocks.org.body':
    'A classic org chart: managers above reports, dual managers and dotted-line reporting, orthogonal connectors routed around cards. Pan and zoom the canvas, or use the directory tree for keyboard selection. Layout runs in a Web Worker via elkjs (EPL-2.0, ~336 KB transfer); the CLI installs elkjs as a peer. Add `allowedCommonJsDependencies: ["elkjs"]` to your Angular build options if the CLI warns about CommonJS.',
  'blocks.org.notes':
    'elkjs is EPL-2.0. The worker keeps layout off the main thread; expect ~336 KB transfer for the worker chunk.',
} as const;
