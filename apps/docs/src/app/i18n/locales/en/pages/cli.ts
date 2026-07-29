export const cliTranslations = {
  'cli.page.description':
    'A command-line tool for scaffolding Sanring UI components directly into your project — copy the source, wire up dependencies, and stay in control of the code.',
  'cli.overview.title': 'Overview',
  'cli.overview.body':
    'The @sanring/cli package exposes nine commands — init, add, remove, info, diff, update, list, search, and doctor — that read from the same component registry used by this documentation site. Run it with npx so you always get the latest version.',
  'cli.init.title': 'init',
  'cli.init.body':
    "Run once per project. Verifies you're in an Angular project, writes a sanring.config.json with your chosen component path, generates src/sanring-theme.css (the --sanring-* design tokens every component reads — skipped by default if it already exists, to protect your customizations), and installs the base peer dependencies (clsx, tailwind-merge).",
  'cli.add.title': 'add',
  'cli.add.body':
    "Copies one or more components' source files into your project and installs any missing peer dependencies. Start with button when you want the smallest first install; components with extra package requirements install those dependencies automatically. Pass --dry-run to preview exactly which files would be created or overwritten without touching your filesystem. Use --diff to see the line-by-line changes against your local files before committing, or --view to print the raw registry content without writing anything.",
  'cli.remove.title': 'remove',
  'cli.remove.body':
    "Removes one or more installed components. Refuses to remove a component that another still-installed component depends on (e.g. removing badge while tag is installed) unless you pass --force. Shared files like utils.ts are never deleted automatically — if none of your remaining components need one anymore, it's reported so you can delete it by hand. Aliased as rm.",
  'cli.info.title': 'info',
  'cli.info.body':
    'Called without a component name, shows project context without a network call: CLI version, Angular detection, config path, theme status, and installed components. Pass a component name to see its description, the full file list it would install, and its peer dependencies — without writing anything. Both modes accept --json for CI and coding-agent use.',
  'cli.diff.title': 'diff',
  'cli.diff.body':
    "Sanring UI has no version concept — components are copied source, not npm packages — so there's no automatic way to know if your local files have drifted from the registry. diff compares your installed components and sanring-theme.css against the current registry line by line, showing what you've customized locally and what's changed upstream, so you can check before running update. Omit the component names to check everything currently installed. Pass --exit-code to exit 1 when any file differs — useful as a CI gate.",
  'cli.update.title': 'update',
  'cli.update.body':
    'Applies registry changes to installed files, one file at a time. Files you never touched since installing are updated silently; files you have customized show a diff and ask for confirmation. Omit component names to check everything installed. Use --trust for projects that predated v0.9.0 hash tracking — it treats all files with no recorded baseline as untouched so they catch up cleanly.',
  'cli.list.title': 'list',
  'cli.list.body':
    'Prints every component available in the registry, along with its peer dependencies. Pass -i / --installed to filter to only components already installed in the current project. Aliased as ls.',
  'cli.search.title': 'search',
  'cli.search.body':
    'Searches the registry by component name or description. Name matches are ranked above description-only matches. When run from inside an Angular project, installed components are marked with a ✔ badge.',
  'cli.doctor.title': 'doctor',
  'cli.doctor.body':
    'Checks your environment and project config for common issues: Node.js version, Angular project detection, sanring.config.json validity, theme file presence, per-file hash integrity (untouched / customized / orphaned), and registry reachability. Use --offline to skip the network check. Exits 1 when hard errors are found, making it suitable as a CI readiness gate.',
  'cli.requirements.title': 'Requirements',
  'cli.requirements.body':
    'Run the CLI from the root of an Angular project. Before starting, make sure your project matches these versions and stylesheet requirements.',

} as const;
