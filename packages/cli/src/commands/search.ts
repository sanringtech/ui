import { Command } from 'commander';
import { resolve } from 'node:path';
import ora from 'ora';
import pc from 'picocolors';
import { fetchRegistry } from '../registry.js';
import { isAngularProject, readConfig } from '../utils.js';
import { listInstalledComponentNames } from './diff.js';

const DEFAULT_PATH = 'src/app/components/ui';

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
  .option('--registry <url>', 'custom registry URL')
  .action(async (query: string, options: { path?: string; registry?: string }) => {
    const spinner = ora('Loading components...').start();
    const registry = await fetchRegistry(options.registry);
    spinner.stop();

    const q = query.toLowerCase();

    // Name matches ranked above description-only matches.
    const nameMatches = registry.components.filter((c) => c.name.toLowerCase().includes(q));
    const descMatches = registry.components.filter(
      (c) => !c.name.toLowerCase().includes(q) && c.description.toLowerCase().includes(q),
    );
    const matches = [...nameMatches, ...descMatches];

    if (matches.length === 0) {
      console.log(pc.dim(`\n  No components matching "${query}".\n`));
      console.log(pc.dim(`  Run ${pc.white('sanring list')} to see all available components.\n`));
      return;
    }

    // Check install status when inside an Angular project.
    let installedNames: Set<string> | null = null;
    if (isAngularProject(process.cwd())) {
      const config = readConfig(process.cwd());
      const componentBasePath = resolve(
        process.cwd(),
        options.path ?? config?.componentPath ?? DEFAULT_PATH,
      );
      installedNames = new Set(listInstalledComponentNames(componentBasePath, registry));
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
