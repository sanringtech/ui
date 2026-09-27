export const timelineTranslations = {
  'timeline.description':
    'Composable timeline primitives for chronological events, activity feeds, and process milestones.',
  'timeline.examples.basic.description':
    'A vertical list with a built-in rail. Leave the separator empty for a default marker, or project an icon or avatar.',
  'timeline.usage.description':
    'Each item is a separator plus content. The separator draws the connector; project a node only when the default marker is not enough.',
  'timeline.installation.description':
    'Install the timeline primitives and compose item, separator, and content directives where each event renders.',
  'timeline.demo.horizontal': 'Horizontal',
  'timeline.demo.divBased': 'Div-based timeline',
  'timeline.demo.reorder': 'Reorder',
  'timeline.demo.releaseActivity': 'Release activity',
  'timeline.demo.releaseActivityDescription':
    'A compact activity trail for release notes and registry updates.',
  'timeline.demo.today': 'Today',
  'timeline.demo.created': 'Created project',
  'timeline.demo.createdDescription': 'Workspace and registry files are ready.',
  'timeline.demo.createdMeta': '09:12',
  'timeline.demo.reviewed': 'Reviewed content',
  'timeline.demo.reviewedDescription':
    'Documentation examples were checked against the primitive API.',
  'timeline.demo.reviewedMeta': '10:48',
  'timeline.demo.shipped': 'Published update',
  'timeline.demo.shippedDescription':
    'The component can now be installed through the registry workflow.',
  'timeline.demo.shippedMeta': '13:30',
  'timeline.demo.plan': 'Plan',
  'timeline.demo.planDescription': 'Define scope, owners, and release notes.',
  'timeline.demo.build': 'Build',
  'timeline.demo.buildDescription': 'Run checks and package registry files.',
  'timeline.demo.release': 'Release',
  'timeline.demo.releaseDescription': 'Publish docs and sync the CLI registry.',
  'timeline.demo.divTitle': 'Imported activity feed',
  'timeline.demo.divMeta': 'UI team',
  'timeline.demo.divDescription':
    'Use div-based markup when the source data is not naturally a native list.',
  'timeline.demo.qaTitle': 'Quality review',
  'timeline.demo.qaMeta': 'QA pass',
  'timeline.demo.qaDescription': 'Visual spacing and empty states were reviewed before publishing.',
  'timeline.demo.reorder.description':
    'Compose with sortable and drag the grip to reorder. Timeline stays layout; sortable owns order. Also install sortable.',
  'timeline.api.description': 'Inputs supported by the Timeline directives.',
  'timeline.api.orientation.description':
    'Controls whether items stack vertically or horizontally.',
  'timeline.api.class.description': 'Additional classes merged with the timeline root.',
  'timeline.api.itemClass.description': 'Additional classes merged with each timeline item.',
  'timeline.api.separatorClass.description':
    'Additional classes merged with each separator wrapper.',
  'timeline.api.contentClass.description': 'Additional classes merged with each content container.',
  'timeline.accessibility.description':
    'The root sets role=list and each item sets role=listitem so Tailwind Preflight does not strip list semantics. The separator is aria-hidden. Prefer native ul or ol when the sequence is ordered.',
  'timeline.keyboard.description': 'Not focusable unless interactive children are present.',
  'timeline.stateModel.description':
    'Stateless layout component — no value, selection, or event state.',
} as const;
