export const commandTranslations = {
  'command.description':
    'A searchable command list for quick navigation and actions, with an optional ⌘K / Ctrl K dialog wrapper.',
  'command.examples.basic.description':
    'Compose input, list, groups, and items. Typing filters items against their visible text.',
  'command.usage.description':
    'Import the command primitives and listen for valueChange to react to a selection.',
  'command.installation.description':
    'Add the component with the CLI, then import the command primitives into the standalone component that renders the list.',
  'command.composition.description':
    'Command separates the search input, scrollable list, groups, items, and an optional dialog wrapper so each piece can be used independently.',
  'command.demo.dialog': 'Command dialog',
  'command.demo.shortcuts': 'Shortcuts and disabled items',
  'command.demo.placeholder': 'Search commands...',
  'command.demo.empty': 'No results found.',
  'command.demo.suggestions': 'Suggestions',
  'command.demo.settingsGroup': 'Settings',
  'command.demo.openDialog': 'Search...',
  'command.demo.disabledItem': 'Archive',
  'command.api.description': 'Inputs and outputs supported by the command primitives.',
  'command.api.value.description':
    'Unique value identifying a `sanring-command-item`, emitted on selection.',
  'command.api.disabled.description':
    'Excludes the item from filtering, keyboard navigation, and selection.',
  'command.api.heading.description': 'Optional label rendered above a `sanring-command-group`.',
  'command.api.placeholder.description': 'Placeholder text for the search input.',
  'command.api.class.description': 'Additional classes merged onto the corresponding primitive.',
  'command.api.selected.description':
    "Emits a `sanring-command-item`'s value when it is clicked or activated with Enter.",
  'command.api.valueChange.description':
    'Emits from the root `sanring-command` whenever any item is selected.',
  'command.api.shortcutHint.description':
    'Read-only signal on `sanring-command-dialog` with the platform-appropriate shortcut label (⌘K on Mac, Ctrl K elsewhere).',

} as const;
