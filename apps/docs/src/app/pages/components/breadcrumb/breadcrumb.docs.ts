import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const breadcrumbPage = {
  componentId: 'breadcrumb',
  titleKey: 'component.breadcrumb',
  descriptionKey: 'breadcrumb.description',
  sections: [
    { id: 'basic',        titleKey: 'toc.basic',            descriptionKey: 'breadcrumb.examples.basic.description', level: 2 },
    { id: 'usage',        titleKey: 'toc.usage',            descriptionKey: 'breadcrumb.usage.description',          level: 2 },
    { id: 'installation', titleKey: 'sidebar.installation',  descriptionKey: 'breadcrumb.installation.description',   level: 2 },
    { id: 'composition',  titleKey: 'toc.composition',      descriptionKey: 'breadcrumb.composition.description',    level: 2 },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'breadcrumb.examples.description',
      level: 2,
      children: [
        { id: 'example-divider',   titleKey: 'breadcrumb.demo.divider',       level: 3 },
        { id: 'example-ellipsis',  titleKey: 'breadcrumb.demo.withEllipsis',  level: 3 },
        { id: 'example-custom',    titleKey: 'breadcrumb.demo.customDivider', level: 3 },
      ],
    },
    { id: 'api', titleKey: 'toc.apiReference', descriptionKey: 'breadcrumb.api.description', level: 2 },
  ],
  apiRows: [
    { property: 'type (BreadcrumbDividerComponent)', type: "'chevron' | 'dot'", defaultValue: "'chevron'", descriptionKey: 'breadcrumb.api.type.description' },
    { property: 'routerLink (BreadcrumbLinkComponent)', type: 'string | unknown[] | null',  defaultValue: 'undefined', descriptionKey: 'breadcrumb.api.routerLink.description' },
    { property: 'class',  type: 'string', defaultValue: "''", descriptionKey: 'breadcrumb.api.class.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const breadcrumbPageExamples = {
  basic: `<sanring-breadcrumb>
  <sanring-breadcrumb-list>
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>

    <sanring-breadcrumb-divider />

    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/components">Components</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>

    <sanring-breadcrumb-divider />

    <sanring-breadcrumb-item>
      <sanring-breadcrumb-page>Breadcrumb</sanring-breadcrumb-page>
    </sanring-breadcrumb-item>
  </sanring-breadcrumb-list>
</sanring-breadcrumb>`,

  usageImport: `import { SANRING_BREADCRUMB_IMPORTS } from '@sanring/ui';`,

  usageMain: `<sanring-breadcrumb>
  <sanring-breadcrumb-list>
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>
    <sanring-breadcrumb-divider />
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-page>Current Page</sanring-breadcrumb-page>
    </sanring-breadcrumb-item>
  </sanring-breadcrumb-list>
</sanring-breadcrumb>`,

  composition: `sanring-breadcrumb                  <!-- nav wrapper -->
└── sanring-breadcrumb-list           <!-- ol list -->
    ├── sanring-breadcrumb-item       <!-- li item -->
    │   └── sanring-breadcrumb-link   <!-- navigable link -->
    ├── sanring-breadcrumb-divider    <!-- separator (chevron / dot / custom) -->
    ├── sanring-breadcrumb-item
    │   └── sanring-breadcrumb-ellipsis  <!-- collapsed items indicator -->
    ├── sanring-breadcrumb-divider
    └── sanring-breadcrumb-item
        └── sanring-breadcrumb-page   <!-- current page (non-link) -->`,

  divider: `<!-- Chevron (default) -->
<sanring-breadcrumb>
  <sanring-breadcrumb-list>
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>
    <sanring-breadcrumb-divider type="chevron" />
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-page>Page</sanring-breadcrumb-page>
    </sanring-breadcrumb-item>
  </sanring-breadcrumb-list>
</sanring-breadcrumb>

<!-- Dot -->
<sanring-breadcrumb>
  <sanring-breadcrumb-list>
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>
    <sanring-breadcrumb-divider type="dot" />
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-page>Page</sanring-breadcrumb-page>
    </sanring-breadcrumb-item>
  </sanring-breadcrumb-list>
</sanring-breadcrumb>`,

  ellipsis: `<sanring-breadcrumb>
  <sanring-breadcrumb-list>
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>
    <sanring-breadcrumb-divider />

    <sanring-breadcrumb-item>
      <sanring-breadcrumb-ellipsis />
    </sanring-breadcrumb-item>
    <sanring-breadcrumb-divider />

    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/components">Components</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>
    <sanring-breadcrumb-divider />

    <sanring-breadcrumb-item>
      <sanring-breadcrumb-page>Breadcrumb</sanring-breadcrumb-page>
    </sanring-breadcrumb-item>
  </sanring-breadcrumb-list>
</sanring-breadcrumb>`,

  custom: `<!-- Custom divider via ng-content slot -->
<sanring-breadcrumb>
  <sanring-breadcrumb-list>
    <sanring-breadcrumb-item>
      <sanring-breadcrumb-link routerLink="/">Home</sanring-breadcrumb-link>
    </sanring-breadcrumb-item>

    <sanring-breadcrumb-divider>
      <span aria-hidden="true">/</span>
    </sanring-breadcrumb-divider>

    <sanring-breadcrumb-item>
      <sanring-breadcrumb-page>Page</sanring-breadcrumb-page>
    </sanring-breadcrumb-item>
  </sanring-breadcrumb-list>
</sanring-breadcrumb>`,
} as const;
