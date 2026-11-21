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
  'blocks.org.preview.withTree': 'With directory tree',
  'blocks.org.preview.withTreeDescription':
    'Default. The tree is for keyboard access; selection stays in sync with the canvas.',
  'blocks.org.preview.canvasOnly': 'Canvas only',
  'blocks.org.preview.canvasOnlyDescription':
    'Set `[showTree]="false"` when you only need the chart. Pan, zoom, and card selection still work.',
  'blocks.bell.title': 'Notification bell',
  'blocks.bell.body':
    'A bell with an unread count and a panel of notifications, with mark all as read, loading / empty / error states, and a toast when new ones arrive.',
  'blocks.bell.scenario':
    'Use this in the app header of any Sanring system that uses sanring-notify. Your backend fetches the notifications; the block only draws them.',
  'blocks.bell.composition':
    'popover holds the panel, spinner covers loading, and toast pops "You have N new notification(s)" when `unreadCount` goes up between polls.',
  'blocks.bell.notes':
    'Pass `null` as `unreadCount` until the first poll returns (not `0`), or the first count shows a toast. The toast needs `ToastService` in your providers and a `<sanring-toaster>` on the page; without them the bell simply does not toast. Turn it off with `[toastOnNew]="false"`.',
  'blocks.bell.preview.simulate': 'Simulate a new notification',

  'blocks.announcement.title': 'Announcement',
  'blocks.announcement.body':
    'Small cards floating in a corner for family-wide announcements such as scheduled maintenance, with an optional link and a close button.',
  'blocks.announcement.scenario':
    'Use this for active sanring-notify banners (`GET /api/v1/banners/active`). The cards are `position: fixed`, so they never push or reflow your layout; place the component once in your app shell.',
  'blocks.announcement.composition':
    'No other components: a fixed stack of cards with lucide icons. Pick the corner with `position` (default bottom-left, away from toasts).',
  'blocks.announcement.notes':
    'For a link inside your own app, handle `linkClicked`, call `event.preventDefault()` and navigate with the router to avoid a full page reload. Opening in a new tab still works.',
  'blocks.announcement.preview.hint': 'The preview frame stands in for the browser window.',
} as const;
