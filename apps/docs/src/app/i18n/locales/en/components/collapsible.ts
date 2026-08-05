export const collapsibleTranslations = {
  'collapsible.description':
    'A stateful primitive for revealing and hiding a single region of content from a trigger.',
  'collapsible.controlledState': 'Controlled State',
  'collapsible.controlledState.description':
    'Bind [(open)] when the expanded state needs to be coordinated with external controls or saved preferences.',
  'collapsible.demo.settingsPanel': 'Settings Panel',
  'collapsible.demo.fileTree': 'File Tree',
  'collapsible.demo.open': 'Open',
  'collapsible.demo.close': 'Close',
  'collapsible.demo.advancedOptions': 'Advanced options',
  'collapsible.demo.controlledContent':
    'This panel follows external state while still supporting trigger clicks and keyboard activation.',
  'collapsible.demo.basicQuestion': 'What changed this week?',
  'collapsible.demo.basicAnswer': 'We added audit exports, role presets, and quieter empty states.',
  'collapsible.demo.workspacePreferences': 'Workspace preferences',
  'collapsible.demo.weeklyDigest': 'Send weekly digest',
  'collapsible.demo.weeklyDigestDescription': 'Receive a compact summary every Monday.',
  'collapsible.demo.requireReview': 'Require review before publish',
  'collapsible.demo.requireReviewDescription': 'Keep drafts locked until a teammate approves them.',
  'collapsible.examples.description':
    'Common collapsible patterns for inline details, dense settings, and nested navigation.',
  'collapsible.installation.description':
    'Add the component with the CLI, then import the root component with its trigger and content directives.',
  'collapsible.usage.description':
    'Wrap a trigger and a content region in sanring-collapsible. The trigger controls the open state and wires ARIA attributes to the content.',
  'collapsible.composition.description':
    'Collapsible is composed from a state root plus trigger and content directives, so you can choose the native elements and styling.',
  'collapsible.api.description':
    'Inputs, outputs, and methods supported by the collapsible primitives.',
  'collapsible.api.class.description': 'Additional classes merged with the root element.',
  'collapsible.api.open.description':
    'Controls whether the content region is visible. Supports [(open)] two-way binding.',
  'collapsible.api.disabled.description':
    'Disables trigger interaction while preserving the current open state.',
  'collapsible.api.toggle.description':
    'Toggles the open state unless the collapsible is disabled.',
  'collapsible.api.openChange.description':
    'Emits whenever the open state changes through the model binding.',
  'collapsible.keyboard.description':
    'Keyboard behavior comes from the interactive trigger element.',
  'collapsible.keyboard.enterSpace': 'Activates the trigger and toggles the content region.',
  'collapsible.keyboard.tabShiftTab': 'Moves focus to and from the trigger in document order.',
} as const;
