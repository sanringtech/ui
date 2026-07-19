import { Command } from 'commander';
import { existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import pc from 'picocolors';
import { fetchRegistry, type Registry } from '../registry.js';
import { isAngularProject, readConfig, writeConfig } from '../utils.js';
import { listInstalledComponentNames } from './diff.js';

const DEFAULT_PATH = 'src/app/components/ui';

export interface RemovalPlan {
  toRemove: string[];
  notInstalled: string[];
  /** name being removed -> still-installed component names that depend on it */
  blockedBy: Map<string, string[]>;
  /** shared dep names used only by the components being removed */
  possiblyUnusedShared: string[];
}

// Figures out what's actually safe to delete: refuses (unless the caller
// ignores blockedBy, i.e. --force) to remove a component that a *remaining*
// installed component still declares as a componentDep, since that would
// leave a dangling import. Shared files are never deleted automatically —
// they're just reported as candidates, since a shared file being unused by
// installed *components* doesn't mean it isn't imported by hand-written code.
export function planRemoval(
  requestedNames: string[],
  installedNames: string[],
  registry: Registry,
): RemovalPlan {
  const installedSet = new Set(installedNames);
  const byName = new Map(registry.components.map((c) => [c.name, c]));

  const toRemove = requestedNames.filter((n) => installedSet.has(n));
  const notInstalled = requestedNames.filter((n) => !installedSet.has(n));
  const remaining = installedNames.filter((n) => !toRemove.includes(n));

  const blockedBy = new Map<string, string[]>();
  for (const removedName of toRemove) {
    const dependents = remaining.filter((remainingName) =>
      (byName.get(remainingName)?.componentDeps ?? []).includes(removedName),
    );
    if (dependents.length > 0) blockedBy.set(removedName, dependents);
  }

  const sharedStillNeeded = new Set<string>();
  for (const name of remaining) {
    for (const dep of byName.get(name)?.sharedDeps ?? []) sharedStillNeeded.add(dep);
  }

  const sharedUsedByRemoved = new Set<string>();
  for (const name of toRemove) {
    for (const dep of byName.get(name)?.sharedDeps ?? []) sharedUsedByRemoved.add(dep);
  }

  const possiblyUnusedShared = [...sharedUsedByRemoved].filter((dep) => !sharedStillNeeded.has(dep));

  return { toRemove, notInstalled, blockedBy, possiblyUnusedShared };
}

async function confirmRemoval(names: string[], yes: boolean): Promise<boolean> {
  if (yes) return true;
  if (!process.stdin.isTTY) {
    console.error(pc.red('\n✖ Refusing to remove files without confirmation.'));
    console.error(pc.dim(`  Re-run with ${pc.white('--yes')} to confirm in non-interactive environments.\n`));
    return false;
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    pc.dim(`\n  Delete ${names.join(', ')}? This cannot be undone.`) + ' [y/N]: ',
  );
  rl.close();
  return answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes';
}

export const removeCommand = new Command('remove')
  .alias('rm')
  .description('Remove one or more installed components from your project')
  .argument('<components...>', 'component name(s) to remove')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('-y, --yes', 'skip confirmation', false)
  .option('-f, --force', 'remove even if another installed component still depends on it', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(
    async (
      componentNames: string[],
      options: { path?: string; yes: boolean; force: boolean; registry?: string },
    ) => {
      const cwd = process.cwd();
      const registrySource = options.registry;

      if (!isAngularProject(cwd)) {
        console.error(pc.red('✖ No angular.json found.'));
        console.error(pc.dim('  Run from the root of an Angular project.'));
        process.exit(1);
      }

      const config = readConfig(cwd);
      const componentBasePath = resolve(cwd, options.path ?? config?.componentPath ?? DEFAULT_PATH);

      const registry = await fetchRegistry(registrySource);
      const installed = listInstalledComponentNames(componentBasePath, registry);
      const plan = planRemoval(componentNames, installed, registry);

      if (plan.notInstalled.length > 0) {
        console.error(
          pc.red(
            `✖ Not installed, nothing to remove: ${plan.notInstalled.join(', ')}`,
          ),
        );
      }

      if (plan.toRemove.length === 0) {
        process.exit(plan.notInstalled.length > 0 ? 1 : 0);
        return;
      }

      if (plan.blockedBy.size > 0 && !options.force) {
        console.error(pc.red('\n✖ Refusing to remove — other installed components still depend on this:\n'));
        for (const [name, dependents] of plan.blockedBy) {
          console.error(`  ${pc.bold(name)} ${pc.dim('is required by')} ${dependents.join(', ')}`);
        }
        console.error(pc.dim(`\n  Remove ${pc.white([...plan.blockedBy.keys()].join(', '))} last, or re-run with ${pc.white('--force')}.\n`));
        process.exit(1);
        return;
      }

      if (plan.blockedBy.size > 0 && options.force) {
        console.warn(pc.yellow('\n⚠ Proceeding with --force — this will leave a dangling import in:\n'));
        for (const [name, dependents] of plan.blockedBy) {
          console.warn(`  ${dependents.join(', ')} ${pc.dim(`(imports ${name})`)}`);
        }
        console.warn('');
      }

      const confirmed = await confirmRemoval(plan.toRemove, options.yes);
      if (!confirmed) {
        console.log(pc.dim('\n  Nothing removed.\n'));
        return;
      }

      const installedHashes = { ...config?.installedHashes };
      let prunedHashes = false;

      for (const name of plan.toRemove) {
        const dir = join(componentBasePath, name);
        if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
        console.log(pc.green(`✔ Removed ${name}`));

        // Drop this component's baseline-hash entries so a stale manifest
        // doesn't accumulate — shared files are left alone since we never
        // delete those (they may still be imported by hand-written code).
        const prefix = `${name}/`;
        for (const label of Object.keys(installedHashes)) {
          if (label.startsWith(prefix)) {
            delete installedHashes[label];
            prunedHashes = true;
          }
        }
      }

      if (prunedHashes) {
        writeConfig(cwd, { componentPath: config?.componentPath ?? DEFAULT_PATH, installedHashes });
      }

      if (plan.possiblyUnusedShared.length > 0) {
        console.log(
          pc.dim(
            `\n  These shared files may no longer be needed by any installed component: ${plan.possiblyUnusedShared.join(', ')}`,
          ),
        );
        console.log(pc.dim('  Left in place — delete manually if nothing else references them.\n'));
      } else {
        console.log('');
      }
    },
  );
