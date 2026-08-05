export const introTranslations = {
  'intro.page.description':
    'Source-first Angular UI primitives. Inspect behavior and APIs in the docs, then copy the components you need into your own project.',
  'intro.actions.start': 'Start with the CLI',
  'intro.actions.example': 'View Button example',
  'intro.whatIs.title': 'What is Sanring UI?',
  'intro.whatIs.body':
    'Sanring UI is a source-first component system for Angular apps. It provides composable primitives, interaction-focused documentation, and a registry workflow so teams can maintain UI as their own code instead of depending on opaque package versions.',
  'intro.whatIs.noteTitle': 'Not a traditional npm UI package.',
  'intro.whatIs.noteBody':
    'The CLI copies component source into your repository, where it can be adapted, reviewed, tested, and versioned with the rest of your product.',
  'intro.sourceFirst.title': 'Why source-first?',
  'intro.sourceFirst.own.title': 'Own the code',
  'intro.sourceFirst.own.description':
    'After installation, components live in your source tree. Your team can manage them with its own review, test, and release process.',
  'intro.sourceFirst.compose.title': 'Composable primitives',
  'intro.sourceFirst.compose.description':
    'Components are small building blocks for forms, overlays, navigation, and data-heavy product interfaces.',
  'intro.sourceFirst.inspect.title': 'Docs before install',
  'intro.sourceFirst.inspect.description':
    'Each component page covers usage, API, keyboard behavior, accessibility, and state model before you add it to a project.',
  'intro.quickStart.title': 'Quick Start',
  'intro.quickStart.body':
    'Initialize the registry config, then add your first component. Button is the quickest way to verify styling and the CLI flow.',
  'intro.quickStart.tailwind':
    'Then import the generated theme file and point Tailwind at your local component source. Add this to your CSS entry file:',
  'intro.quickStart.import':
    'Finally, place the component in a real interface. The first example should immediately confirm button styling, hover/focus states, and Angular standalone imports:',
  'intro.quickStart.expectedTitle': 'Expected result:',
  'intro.quickStart.expectedBody':
    'A Sanring-styled Button appears on the page. If hover, focus, and spacing look correct, the theme and component source are wired up.',
  'intro.requirements.title': 'Requirements',
  'intro.next.title': 'Where to go next',
  'intro.next.components.title': 'Browse components',
  'intro.next.components.description':
    'Start with Button, Field, Dialog, or Select to inspect examples, APIs, and state models.',
  'intro.next.cli.title': 'Understand the CLI workflow',
  'intro.next.cli.description':
    'Review init, add, diff, update, and how registry checks fit into CI or agent workflows.',
  'intro.next.theming.title': 'Configure theming',
  'intro.next.theming.description':
    'Learn how sanring-theme.css, CSS variables, and Tailwind v4 source scanning work together.',
} as const;
