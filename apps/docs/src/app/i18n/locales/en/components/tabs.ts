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
    'Controls the horizontal/vertical grid layout of sanring-tabs itself. Does not drive keyboard navigation — set orientation on sanring-tabs-list too, to the same value, for Arrow-key navigation to match.',
  'tabs.api.listOrientation.description':
    'Drives the actual keyboard-navigation axis (Arrow Left/Right vs Up/Down) — set to the same value as the orientation on sanring-tabs, since the two are not synced automatically.',
  'tabs.api.selectionMode.description':
    "'follow' (default) selects a tab as soon as it receives focus via keyboard (automatic activation, per the ARIA APG tabs pattern). 'explicit' requires Enter/Space to select the focused tab (manual activation) — useful when switching tabs is expensive (e.g. triggers a network request).",
  'tabs.api.variant.description': 'Controls the visual treatment of the trigger list.',
  'tabs.api.value.description': 'Required value used to pair a trigger with its content panel.',
  'tabs.api.disabled.description':
    'Prevents a trigger from being selected or focused by keyboard navigation.',
  'tabs.api.valueChange.description': 'Emits when the selected tab value changes.',
  'tabs.accessibility.description': "WAI-ARIA Tabs pattern via @angular/aria/tabs. role='tablist' on sanring-tabs-list, role='tab' on each trigger, role='tabpanel' on each content panel, linked with aria-controls and aria-labelledby. aria-selected reflects the active tab.",
  'tabs.keyboard.description': 'Arrow navigation within the trigger list; Tab moves into the active panel.',
  'tabs.keyboard.arrowLeftRight': 'Navigate between tab triggers (horizontal orientation).',
  'tabs.keyboard.arrowUpDown': 'Navigate between tab triggers (vertical orientation).',
  'tabs.keyboard.tab': 'Move focus from the active trigger into the active panel content.',
  'tabs.keyboard.homeEnd': 'Jump focus to the first / last enabled tab trigger.',
  'tabs.stateModel.description': "Controlled via value / valueChange on <sanring-tabs>. selectionMode='follow' (default) activates a tab on arrow-key focus; selectionMode='explicit' requires Enter or Space — useful when switching tabs triggers a network request. Note: set orientation on both sanring-tabs and sanring-tabs-list since they are not auto-synced.",
} as const;
