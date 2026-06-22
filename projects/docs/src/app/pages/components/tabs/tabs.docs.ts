import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const tabsPage = {
  componentId: 'tabs',
  titleKey: 'component.tabs',
  descriptionKey: 'tabs.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'tabs.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'tabs.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'tabs.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'tabs.examples.description',
      level: 2,
      children: [
        {
          id: 'example-horizontal',
          titleKey: 'tabs.demo.horizontal',
          level: 3,
        },
        {
          id: 'example-with-icon',
          titleKey: 'tabs.demo.withIcon',
          level: 3,
        },
        {
          id: 'example-line',
          titleKey: 'tabs.demo.line',
          level: 3,
        },
        {
          id: 'example-vertical',
          titleKey: 'tabs.demo.vertical',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'tabs.demo.disabled',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'tabs.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'defaultValue', type: 'string', defaultValue: 'undefined', descriptionKey: 'tabs.api.defaultValue.description' },
    { property: 'orientation', type: 'TabsOrientation', defaultValue: "'horizontal'", descriptionKey: 'tabs.api.orientation.description' },
    { property: 'variant', type: 'TabsVariant', defaultValue: "'default'", descriptionKey: 'tabs.api.variant.description' },
    { property: 'value', type: 'string', defaultValue: 'required', descriptionKey: 'tabs.api.value.description' },
    { property: 'disabled', type: 'boolean', defaultValue: 'false', descriptionKey: 'tabs.api.disabled.description' },
    { property: 'valueChange', type: 'EventEmitter<string>', defaultValue: '-', descriptionKey: 'tabs.api.valueChange.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const tabsPageExamples = {
  basic: `<sanring-tabs defaultValue="account">
  <sanring-tabs-list>
    <sanring-tabs-trigger value="account">Account</sanring-tabs-trigger>
    <sanring-tabs-trigger value="password">Password</sanring-tabs-trigger>
  </sanring-tabs-list>

  <sanring-tabs-content value="account">
    Account settings
  </sanring-tabs-content>
  <sanring-tabs-content value="password">
    Password settings
  </sanring-tabs-content>
</sanring-tabs>`,
  usageImport: `import {
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TabsTriggerComponent,
} from '@sanring/ui';`,
  usageMain: `<sanring-tabs defaultValue="account">
  <sanring-tabs-list>
    <sanring-tabs-trigger value="account">Account</sanring-tabs-trigger>
    <sanring-tabs-trigger value="password">Password</sanring-tabs-trigger>
  </sanring-tabs-list>

  <sanring-tabs-content value="account">
    Account settings
  </sanring-tabs-content>
  <sanring-tabs-content value="password">
    Password settings
  </sanring-tabs-content>
</sanring-tabs>`,
  composition: `TabsComponent
├── TabsListComponent
│   ├── TabsTriggerComponent
│   └── TabsTriggerComponent
├── TabsContentComponent
└── TabsContentComponent`,
  horizontal: `<sanring-tabs defaultValue="overview">
  <sanring-tabs-list>
    <sanring-tabs-trigger value="overview">Overview</sanring-tabs-trigger>
    <sanring-tabs-trigger value="analytics">Analytics</sanring-tabs-trigger>
    <sanring-tabs-trigger value="reports">Reports</sanring-tabs-trigger>
  </sanring-tabs-list>

  <sanring-tabs-content value="overview">Overview content</sanring-tabs-content>
  <sanring-tabs-content value="analytics">Analytics content</sanring-tabs-content>
  <sanring-tabs-content value="reports">Reports content</sanring-tabs-content>
</sanring-tabs>`,
  withIcon: `<sanring-tabs defaultValue="overview">
  <sanring-tabs-list>
    <sanring-tabs-trigger value="overview">
      <svg lucideActivity class="size-4"></svg>
      <span>Overview</span>
    </sanring-tabs-trigger>
    <sanring-tabs-trigger value="security">
      <svg lucideKey class="size-4"></svg>
      <span>Security</span>
    </sanring-tabs-trigger>
    <sanring-tabs-trigger value="settings">
      <svg lucideSettings class="size-4"></svg>
      <span>Settings</span>
    </sanring-tabs-trigger>
  </sanring-tabs-list>

  <sanring-tabs-content value="overview">Overview content</sanring-tabs-content>
  <sanring-tabs-content value="security">Security content</sanring-tabs-content>
  <sanring-tabs-content value="settings">Settings content</sanring-tabs-content>
</sanring-tabs>`,
  line: `<sanring-tabs defaultValue="overview" variant="line">
  <sanring-tabs-list>
    <sanring-tabs-trigger value="overview">Overview</sanring-tabs-trigger>
    <sanring-tabs-trigger value="analytics">Analytics</sanring-tabs-trigger>
    <sanring-tabs-trigger value="reports">Reports</sanring-tabs-trigger>
  </sanring-tabs-list>

  <sanring-tabs-content value="overview">Overview content</sanring-tabs-content>
  <sanring-tabs-content value="analytics">Analytics content</sanring-tabs-content>
  <sanring-tabs-content value="reports">Reports content</sanring-tabs-content>
</sanring-tabs>`,
  vertical: `<sanring-tabs defaultValue="account" orientation="vertical">
  <sanring-tabs-list>
    <sanring-tabs-trigger value="account">Account</sanring-tabs-trigger>
    <sanring-tabs-trigger value="password">Password</sanring-tabs-trigger>
    <sanring-tabs-trigger value="notifications">Notifications</sanring-tabs-trigger>
  </sanring-tabs-list>

  <sanring-tabs-content value="account">Account settings</sanring-tabs-content>
  <sanring-tabs-content value="password">Password settings</sanring-tabs-content>
  <sanring-tabs-content value="notifications">Notification settings</sanring-tabs-content>
</sanring-tabs>`,
  disabled: `<sanring-tabs defaultValue="account">
  <sanring-tabs-list>
    <sanring-tabs-trigger value="account">Account</sanring-tabs-trigger>
    <sanring-tabs-trigger value="password">Password</sanring-tabs-trigger>
    <sanring-tabs-trigger value="notifications" disabled>
      Notifications
    </sanring-tabs-trigger>
  </sanring-tabs-list>

  <sanring-tabs-content value="account">Account settings</sanring-tabs-content>
  <sanring-tabs-content value="password">Password settings</sanring-tabs-content>
  <sanring-tabs-content value="notifications">Notification settings</sanring-tabs-content>
</sanring-tabs>`,
} as const;
