import { Command } from 'commander';
import ora from 'ora';
import pc from 'picocolors';
import { fetchRegistry } from '../registry.js';
import {
  isAngularProject,
  readConfig,
  reportRegistryFetchError,
  resolveComponentBasePath,
  resolveRegistrySource,
} from '../utils.js';
import { listInstalledComponentNames } from './diff.js';

function highlight(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    pc.underline(pc.bold(text.slice(idx, idx + query.length))) +
    text.slice(idx + query.length)
  );
}

export const searchCommand = new Command('search')
  .description('Search available components by name or description')
  .argument('<query>', 'search term')
  .option('-p, --path <path>', 'component path relative to cwd (used to show install status)')
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option('--group <id>', 'filter by registry group')
  .option('--tag <tag>', 'filter by component tag')
  .option('--json', 'output machine-readable results', false)
  .action(async (query: string, options: { path?: string; registry?: string; group?: string; tag?: string; json: boolean }) => {
    const config = readConfig(process.cwd());
    const spinner = ora('Loading components...').start();
    let registry;
    try {
      registry = await fetchRegistry(resolveRegistrySource(undefined, config, options.registry));
    } catch (e) {
      spinner.stop();
      reportRegistryFetchError(e, { json: options.json });
    }
    spinner.stop();

    const q = query.toLowerCase();

    const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);
    const groupNames = options.group
      ? new Set(registry.groups?.find((group) => group.id === options.group || group.title.toLowerCase() === options.group?.toLowerCase())?.components ?? [])
      : null;
    const scored = registry.components
      .filter((component) => !groupNames || groupNames.has(component.name))
      .filter((component) => !options.tag || component.tags?.includes(options.tag))
      .map((component) => {
        const name = component.name.toLowerCase();
        const description = component.description.toLowerCase();
        let score = 0;
        if (name === q) score += 100;
        if (name.startsWith(q)) score += 40;
        if (name.includes(q)) score += 20;
        if (description.includes(q)) score += 8;
        for (const token of tokens) {
          if (name.includes(token)) score += 10;
          if (description.includes(token)) score += 3;
        }
        return { component, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.component.name.localeCompare(b.component.name));
    const matches = scored.map((entry) => entry.component);

    if (matches.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({ query, results: [] }, null, 2));
        return;
      }
      console.log(pc.dim(`\n  No components matching "${query}".\n`));
      console.log(pc.dim(`  Run ${pc.white('sanring list')} to see all available components.\n`));
      return;
    }

    // Check install status when inside an Angular project.
    let installedNames: Set<string> | null = null;
    if (isAngularProject(process.cwd())) {
      const componentBasePath = resolveComponentBasePath(process.cwd(), options.path, config);
      installedNames = new Set(listInstalledComponentNames(componentBasePath, registry));
    }

    if (options.json) {
      console.log(JSON.stringify({
        query,
        results: scored.map(({ component, score }) => ({
          name: component.name,
          description: component.description,
          score,
          installed: installedNames?.has(component.name) ?? false,
        })),
      }, null, 2));
      return;
    }

    console.log(
      pc.cyan(`\nSearch: ${pc.bold(query)}`) +
        pc.dim(` — ${matches.length} result${matches.length > 1 ? 's' : ''}`) +
        (installedNames ? pc.dim('  (✔ = installed)') : '') +
        '\n',
    );

    const nameWidth = Math.max(...matches.map((c) => c.name.length), 4);

    for (const c of matches) {
      const badge = installedNames?.has(c.name) ? pc.green(' ✔') : '';
      // Pad first so alignment is based on plain string length, then highlight.
      const paddedName = c.name.padEnd(nameWidth);
      const displayName = pc.bold(highlight(paddedName, q));
      const desc = highlight(c.description, q);
      const deps = c.peerDependencies ? Object.keys(c.peerDependencies).join(', ') : '';
      const depsStr = deps ? pc.dim(`  [${deps}]`) : '';
      console.log(`  ${displayName}  ${desc}${depsStr}${badge}`);
    }

    console.log(pc.dim(`\n  Run ${pc.white('sanring add <component>')} to install.\n`));
  });
