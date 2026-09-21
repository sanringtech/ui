export const registryTranslations = {
  'registry.page.description':
    'Build and host your own component registry so teams and third-party libraries can distribute Angular components with the same install experience as Sanring UI.',
  'registry.overview.title': 'Overview',
  'registry.overview.body':
    'A registry is a single static JSON file (registry.json) that describes a collection of components: their source files, component dependencies, shared utilities, and peer npm packages. The CLI reads this file the same way it reads the official Sanring registry — which means any URL, local path, or github:owner/repo source that serves the correct schema works as a drop-in registry.',
  'registry.schema.title': 'registry.json schema',
  'registry.schema.body':
    'The root object has components (installable components), shared (shared utilities), and an optional blocks array (page-level templates with the same shape as components). Each component or block entry needs a name, a files list (paths relative to components/ or blocks/), optional componentDeps and sharedDeps arrays, and a peerDependencies map.',
  'registry.api.title': 'API reference',
  'registry.api.body':
    'Field definitions for registry.json. Required fields are marked. Third-party registries can omit blocks and groups.',
  'registry.api.root.heading': 'Root object',
  'registry.api.item.heading': 'components[] / blocks[] item',
  'registry.api.sharedItem.heading': 'shared[] item',
  'registry.api.group.heading': 'groups[] item',
  'registry.api.migration.heading': 'migrations[] item',
  'registry.api.root.name': 'Required. Registry display name shown by list and search.',
  'registry.api.root.shared': 'Required. Shared utilities that components and blocks may depend on.',
  'registry.api.root.components': 'Required. Installable components. Files live under components/.',
  'registry.api.root.blocks':
    'Optional. Page-level templates with the same shape as components. Files live under blocks/. Names must not collide with a component.',
  'registry.api.root.groups':
    'Optional. Sidebar groupings. If omitted, the CLI synthesizes a single Components group.',
  'registry.api.item.name': 'Required. Unique install name. Use sanring add <name> or sanring add block/<name>.',
  'registry.api.item.description': 'Required. One-line summary shown by list, search, and info.',
  'registry.api.item.files':
    'Required. Paths relative to components/<name>/ or blocks/<name>/, not the registry root.',
  'registry.api.item.componentDeps':
    'Other component names in this registry that must be installed first.',
  'registry.api.item.sharedDeps': 'Names of shared[] entries this item imports.',
  'registry.api.item.peerDependencies':
    'npm packages the CLI should install when this item is added.',
  'registry.api.item.since': 'CLI version that first shipped this item.',
  'registry.api.item.tags': 'Search tags. Not required for install.',
  'registry.api.item.migrations':
    'Breaking-change guides, oldest first. Shown by sanring migrate.',
  'registry.api.shared.name': 'Required. Name referenced by sharedDeps.',
  'registry.api.shared.description': 'Required. One-line summary of the shared file.',
  'registry.api.shared.file': 'Required. Path from the registry root, usually shared/<file>.ts.',
  'registry.api.shared.peerDependencies':
    'npm packages needed by this shared file. Merged into the install set.',
  'registry.api.group.id': 'Required. Stable group id used by sanring search --group.',
  'registry.api.group.title': 'Required. Display title.',
  'registry.api.group.description': 'Optional longer explanation for the group.',
  'registry.api.group.components':
    'Required. Component or block names that belong in this group.',
  'registry.api.migration.fromVersion':
    'Required. Users at this installed version or older need the migration.',
  'registry.api.migration.breaking': 'Required. Whether the change is breaking.',
  'registry.api.migration.steps': 'Required. Human-readable steps to apply after update.',
  'registry.github.title': 'GitHub registries',
  'registry.github.body':
    'Point the CLI at a GitHub repository that has registry.json at the repo root. The github:owner/repo source expands to the raw main-branch file; append #ref or @ref to pin a branch, tag, or commit.',
  'registry.structure.title': 'Project structure',
  'registry.structure.body':
    'Organize source files so sanring build can scan them automatically. Each component lives in its own subdirectory under a components/ folder; shared utilities live flat under shared/. The scanner resolves imports between files to derive componentDeps, sharedDeps, and peerDependencies — so you rarely need to write those by hand.',
  'registry.build.title': 'sanring build',
  'registry.build.body':
    'Run sanring build from the root of your component library. It scans the source directory, resolves cross-component imports, collects peer dependencies from your package.json, and writes the result to registry.json. Use --dry-run to preview the output without writing any files.',
  'registry.hosting.title': 'Hosting',
  'registry.hosting.body':
    'Serve the generated registry.json over HTTP from any static hosting provider (GitHub Pages, a CDN, your internal artifact server). During local development you can point the CLI at a file path instead of a URL — the CLI accepts both. If the file already lives at the root of a public GitHub repo, skip hosting and use a github: source instead.',
  'registry.consuming.title': 'Using your registry',
  'registry.consuming.body':
    "Register your registry URL or github:owner/repo source in sanring.config.json under the registries key with an alias of your choice. Then prefix component names with that alias when running any CLI command — add, remove, info, diff, update, search, list. The alias keeps components from different registries unambiguous in your project's installed-components record.",
} as const;
