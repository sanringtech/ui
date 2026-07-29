export const tabsTranslations = {
  'tabs.description':
    'A compound tab primitive for switching between related panels without leaving the page.',
  'tabs.demo.account': 'Account',
  'tabs.demo.password': 'Password',
  'tabs.demo.notifications': 'Notifications',
  'tabs.demo.overview': 'Overview',
  'tabs.demo.analytics': 'Analytics',
  'tabs.demo.reports': 'Reports',
  'tabs.demo.security': 'Security',
  'tabs.demo.settings': 'Settings',
  'tabs.demo.horizontal': 'Horizontal',
  'tabs.demo.withIcon': 'With icon',
  'tabs.demo.vertical': 'Vertical',
  'tabs.demo.line': 'Line variant',
  'tabs.demo.disabled': 'Disabled tab',
  'tabs.examples.description':
    'Common tab layouts for settings, dashboards, disabled options, and vertical navigation.',
  'tabs.examples.basic.description':
    'Tabs pair triggers with matching content values. When no defaultValue is provided, the first enabled trigger is selected.',
  'tabs.usage.description':
    'Import the tabs primitives and compose root, list, trigger, and content together.',
  'tabs.installation.description':
    'Use sanring-tabs as the state root, then match each trigger value with a content value.',
  'tabs.composition.description':
    'Tabs are split into root, list, trigger, and content primitives so layout and panels remain flexible.',
  'tabs.api.description': 'Inputs and outputs supported by the tabs primitives.',
  'tabs.api.defaultValue.description': 'Initial tab value selected when the component is created.',
  'tabs.api.orientation.description':
    'Controls horizontal or vertical tabs layout and keyboard navigation.',
  'tabs.api.variant.description': 'Controls the visual treatment of the trigger list.',
  'tabs.api.value.description': 'Required value used to pair a trigger with its content panel.',
  'tabs.api.disabled.description':
    'Prevents a trigger from being selected or focused by keyboard navigation.',
  'tabs.api.valueChange.description': 'Emits when the selected tab value changes.',
} as const;
