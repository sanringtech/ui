import { TranslationKey } from '../../i18n/translations';
import { DocsComponentId } from '../../navigation/docs-navigation';

export type DocsBlockId = 'dashboard-shell' | 'login' | 'table-page' | 'org-chart';

export interface DocsBlockDefinition {
  id: DocsBlockId;
  /** CLI target, e.g. `block/org-chart`. */
  installName: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  scenarioKey: TranslationKey;
  compositionKey: TranslationKey;
  notesKey?: TranslationKey;
  componentDeps: readonly DocsComponentId[];
  peerDependencies?: Readonly<Record<string, string>>;
  path: `/blocks/${DocsBlockId}`;
}

export const docsBlockCatalog: readonly DocsBlockDefinition[] = [
  {
    id: 'dashboard-shell',
    installName: 'block/dashboard-shell',
    titleKey: 'blocks.dashboard.title',
    descriptionKey: 'blocks.dashboard.body',
    scenarioKey: 'blocks.dashboard.scenario',
    compositionKey: 'blocks.dashboard.composition',
    componentDeps: ['sidebar', 'dropdown-menu', 'avatar', 'breadcrumb', 'badge'],
    path: '/blocks/dashboard-shell',
  },
  {
    id: 'login',
    installName: 'block/login',
    titleKey: 'blocks.login.title',
    descriptionKey: 'blocks.login.body',
    scenarioKey: 'blocks.login.scenario',
    compositionKey: 'blocks.login.composition',
    componentDeps: [
      'card',
      'field',
      'input',
      'label',
      'button',
      'checkbox',
      'link',
      'divider',
      'alert',
    ],
    path: '/blocks/login',
  },
  {
    id: 'table-page',
    installName: 'block/table-page',
    titleKey: 'blocks.table.title',
    descriptionKey: 'blocks.table.body',
    scenarioKey: 'blocks.table.scenario',
    compositionKey: 'blocks.table.composition',
    componentDeps: [
      'table',
      'pagination',
      'input',
      'select',
      'dropdown-menu',
      'checkbox',
      'badge',
      'sheet',
      'skeleton',
      'toast',
      'field',
      'button',
    ],
    path: '/blocks/table-page',
  },
  {
    id: 'org-chart',
    installName: 'block/org-chart',
    titleKey: 'blocks.org.title',
    descriptionKey: 'blocks.org.body',
    scenarioKey: 'blocks.org.scenario',
    compositionKey: 'blocks.org.composition',
    notesKey: 'blocks.org.notes',
    componentDeps: ['avatar', 'badge', 'button', 'skeleton', 'tree'],
    peerDependencies: { elkjs: '^0.12.0' },
    path: '/blocks/org-chart',
  },
];

export function getDocsBlock(id: DocsBlockId): DocsBlockDefinition {
  const block = docsBlockCatalog.find((item) => item.id === id);
  if (!block) throw new Error(`Unknown docs block: ${id}`);
  return block;
}
