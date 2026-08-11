export const registryTranslations = {
  'registry.page.description':
    'Build and host your own component registry so teams and third-party libraries can distribute Angular components with the same install experience as Sanring UI.',
  'registry.overview.title': 'Overview',
  'registry.overview.body':
    'A registry is a single static JSON file (registry.json) that describes a collection of components: their source files, component dependencies, shared utilities, and peer npm packages. The CLI reads this file the same way it reads the official Sanring registry — which means any URL or local path that serves the correct schema works as a drop-in registry.',
  'registry.schema.title': 'registry.json schema',
  'registry.schema.body':
    'The root object has two arrays: components (installable components) and shared (shared utilities that components may depend on). Each component entry needs a name, a files list (relative paths from the registry root), optional componentDeps and sharedDeps arrays (names of other entries in this registry), and a peerDependencies map (npm packages the component needs at runtime).',
  'registry.structure.title': 'Project structure',
  'registry.structure.body':
    'Organize source files so sanring build can scan them automatically. Each component lives in its own subdirectory under a components/ folder; shared utilities live flat under shared/. The scanner resolves imports between files to derive componentDeps, sharedDeps, and peerDependencies — so you rarely need to write those by hand.',
  'registry.build.title': 'sanring build',
  'registry.build.body':
    'Run sanring build from the root of your component library. It scans the source directory, resolves cross-component imports, collects peer dependencies from your package.json, and writes the result to registry.json. Use --dry-run to preview the output without writing any files.',
  'registry.hosting.title': 'Hosting',
  'registry.hosting.body':
    'Serve the generated registry.json over HTTP from any static hosting provider (GitHub Pages, a CDN, your internal artifact server). During local development you can point the CLI at a file path instead of a URL — the CLI accepts both.',
  'registry.consuming.title': 'Using your registry',
  'registry.consuming.body':
    "Register your registry URL in sanring.config.json under the registries key with an alias of your choice. Then prefix component names with that alias when running any CLI command — add, remove, info, diff, update, search, list. The alias keeps components from different registries unambiguous in your project's installed-components record.",
} as const;
