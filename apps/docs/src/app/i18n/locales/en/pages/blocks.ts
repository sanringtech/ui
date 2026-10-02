export const blocksTranslations = {
  'blocks.page.description':
    'Installable page-level templates. One command copies the block and the components it is built from.',
  'blocks.overview.title': 'Overview',
  'blocks.overview.body':
    'Blocks are composed from existing Sanring components. They are not part of the UI package — the CLI copies them into your app so you can edit the source. Use the block/ prefix when you want to be explicit, or the bare name when it does not collide with a component.',
  'blocks.catalog.title': 'All blocks',
  'blocks.section.scenario': 'When to use',
  'blocks.section.composition': 'Composition',
  'blocks.section.compositionHint': 'Installed with the block via componentDeps. Open a component page for its API.',
  'blocks.section.peers': 'Peer dependencies',
  'blocks.section.components': 'Components',
  'blocks.section.installation': 'Installation',
  'blocks.section.usage': 'Usage',
  'blocks.section.preview': 'Preview',
  'blocks.section.notes': 'Notes',

  'blocks.dashboard.title': 'Dashboard shell',
  'blocks.dashboard.body':
    'Persistent app chrome: sidebar, breadcrumbs, and a user menu. Project your page into ng-content.',
  'blocks.dashboard.scenario':
    'Use this when you need a standard authenticated app frame — left nav, top breadcrumb trail, and account menu — and want the page body to stay in your router outlet.',
  'blocks.dashboard.composition':
    'Assembles sidebar for navigation, breadcrumb for location, avatar plus dropdown-menu for the user menu, and badge for optional nav counts.',

  'blocks.login.title': 'Login',
  'blocks.login.body': 'A sign-in card with email, password, remember-me, and an error alert.',
  'blocks.login.scenario':
    'Use this for a standalone sign-in screen before the app shell. Wire `(submitted)` to your auth API and pass `error` when credentials fail.',
  'blocks.login.composition':
    'Built as a card form: field + input + label for controls, checkbox for remember-me, alert for failures, link and divider for secondary actions, button to submit.',

  'blocks.table.title': 'Table page',
  'blocks.table.body':
    'A data table with search, status filter, row selection, a create sheet, loading skeletons, and toast.',
  'blocks.table.scenario':
    'Use this as a starting CRUD list page: filterable rows, bulk-friendly selection, a sheet to create records, and toast feedback after mutations.',
  'blocks.table.composition':
    'Combines table and pagination for the grid, input/select/field for filters, checkbox for row selection, dropdown-menu for row actions, sheet for create/edit, skeleton while loading, badge for status, toast for feedback, and button for primary actions.',

  'blocks.org.title': 'Org chart',
  'blocks.org.body':
    'A classic org chart with dual managers, dotted-line reporting, pan/zoom, and a directory tree for keyboard access.',
  'blocks.org.scenario':
    'Use this when you need a 2D reporting graph — not an ARIA tree alone. Pass people and solid/dotted links; selection stays in sync between the canvas and the directory.',
  'blocks.org.composition':
    'Cards use avatar and badge; toolbar buttons and skeleton cover chrome and loading. tree provides keyboard navigation beside the canvas. Layout runs in a Web Worker via the elkjs peer.',
  'blocks.org.notes':
    'elkjs is EPL-2.0 (~336 KB transfer for the worker chunk). Add `allowedCommonJsDependencies: ["elkjs"]` to your Angular build options if the CLI warns about CommonJS.',
} as const;
