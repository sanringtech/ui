import { Command } from 'commander';
import { existsSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'picocolors';
import {
  createRegistryIndex,
  fetchRegistry,
  type Registry,
  type RegistryIndex,
} from '../registry.js';
import {
  confirmPrompt,
  DEFAULT_COMPONENT_PATH,
  readConfig,
  reportRegistryFetchError,
  requireAngularProject,
  resolveComponentBasePath,
  resolveRegistrySource,
  writeConfig,
} from '../utils.js';
import { listInstalledComponentNames, registryRelativePath } from './diff.js';
import { parseComponentRef } from './add.js';

export interface RemovalPlan {
  toRemove: string[];
  /** known in the registry, but not currently installed — soft skip */
  notInstalled: string[];
  /** not present in the registry at all — hard input error */
  unknown: string[];
  /** name being removed -> still-installed component names that depend on it */
  blockedBy: Map<string, string[]>;
  /** shared dep names used only by the components being removed */
  possiblyUnusedShared: string[];
}

function listFiles(dir: string, prefix = ''): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = prefix ? join(prefix, entry.name) : entry.name;
    if (entry.isDirectory()) return listFiles(join(dir, entry.name), relativePath);
    return [relativePath];
  });
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
  registry: Registry | RegistryIndex,
): RemovalPlan {
  const installedSet = new Set(installedNames);
  const byName =
    'componentsByName' in registry
      ? registry.componentsByName
      : createRegistryIndex(registry).componentsByName;

  const toRemove = requestedNames.filter((n) => installedSet.has(n));
  const notRequestedInstalled = requestedNames.filter((n) => !installedSet.has(n));
  const notInstalled = notRequestedInstalled.filter((n) => byName.has(n));
  const unknown = notRequestedInstalled.filter((n) => !byName.has(n));
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

  const possiblyUnusedShared = [...sharedUsedByRemoved].filter(
    (dep) => !sharedStillNeeded.has(dep),
  );

  return { toRemove, notInstalled, unknown, blockedBy, possiblyUnusedShared };
}

function confirmRemoval(names: string[], yes: boolean): Promise<boolean> {
  return confirmPrompt({
    yes,
    question: pc.dim(`\n  Delete ${names.join(', ')}? This cannot be undone.`) + ' [y/N]: ',
    nonTtyRefusal: {
      title: 'Refusing to remove files without confirmation.',
      hint: `Re-run with ${pc.white('--yes')} to confirm in non-interactive environments.`,
    },
  });
}

export const removeCommand = new Command('remove')
  .alias('rm')
  .description('Remove one or more installed components from your project')
  .argument('<components...>', 'component name(s) to remove')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('-y, --yes', 'skip confirmation', false)
  .option('-f, --force', 'remove even if another installed component still depends on it', false)
  .option('--dry-run', 'show tracked files, preserved files, and dependency blockers without deleting', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(
    async (
      componentNames: string[],
      options: { path?: string; yes: boolean; force: boolean; dryRun: boolean; registry?: string },
    ) => {
      const cwd = process.cwd();

      requireAngularProject(cwd);

      const config = readConfig(cwd);
      const registrySource = resolveRegistrySource(undefined, config, options.registry);
      const componentBasePath = resolveComponentBasePath(cwd, options.path, config);

      let registry;
      try {
        registry = await fetchRegistry(registrySource);
      } catch (e) {
        reportRegistryFetchError(e);
      }
      const registryIndex = createRegistryIndex(registry);
      const installed = listInstalledComponentNames(componentBasePath, registryIndex);
      const parsed = componentNames.map(parseComponentRef);
      const requestedNames = parsed.map((ref) => ref.name);
      const plan = planRemoval(requestedNames, installed, registryIndex);

      if (plan.unknown.length > 0) {
        console.error(
          pc.red(`✖ Unknown component${plan.unknown.length > 1 ? 's' : ''}: ${plan.unknown.join(', ')}`),
        );
        // Unknown targets are input errors, independent of how the rest of the
        // batch turns out — matches diff/update's "unknown target always fails".
        process.exit(1);
        return;
      }

      if (plan.notInstalled.length > 0) {
        console.log(pc.dim(`  Not installed, nothing to remove: ${plan.notInstalled.join(', ')}`));
      }

      if (plan.toRemove.length === 0) {
        return;
      }

      if (plan.blockedBy.size > 0 && !options.force) {
        console.error(
          pc.red('\n✖ Refusing to remove — other installed components still depend on this:\n'),
        );
        for (const [name, dependents] of plan.blockedBy) {
          console.error(`  ${pc.bold(name)} ${pc.dim('is required by')} ${dependents.join(', ')}`);
        }
        console.error(
          pc.dim(
            `\n  Remove ${pc.white([...plan.blockedBy.keys()].join(', '))} last, or re-run with ${pc.white('--force')}.\n`,
          ),
        );
        process.exit(1);
        return;
      }

      const filePlans = plan.toRemove.map((name) => {
        const dir = join(componentBasePath, name);
        const tracked = new Set(
          (registryIndex.componentsByName.get(name)?.files ?? []).map((file) => registryRelativePath(file, name)),
        );
        const actual = listFiles(dir);
        return {
          name,
          tracked: actual.filter((file) => tracked.has(file)),
          extra: actual.filter((file) => !tracked.has(file)),
        };
      });

      if (options.dryRun) {
        console.log(pc.cyan('\nRemoval plan\n'));
        for (const filePlan of filePlans) {
          console.log(pc.bold(`  ${filePlan.name}`));
          for (const file of filePlan.tracked) console.log(pc.red(`    - ${file}`));
          for (const file of filePlan.extra) console.log(pc.green(`    keep ${file} (user file)`));
        }
        if (plan.possiblyUnusedShared.length > 0) {
          console.log(pc.dim(`\n  Shared files to keep: ${plan.possiblyUnusedShared.join(', ')}`));
        }
        if (plan.blockedBy.size > 0) {
          console.log(pc.yellow('\n  Blocked by dependents:'));
          for (const [name, dependents] of plan.blockedBy) console.log(`    ${name} ← ${dependents.join(', ')}`);
        }
        console.log(pc.dim('\n  Dry run — no files were deleted.\n'));
        return;
      }

      if (plan.blockedBy.size > 0 && options.force) {
        console.warn(
          pc.yellow('\n⚠ Proceeding with --force — this will leave a dangling import in:\n'),
        );
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
      const installedVersions = { ...config?.installedVersions };
      let prunedConfig = false;

      for (const name of plan.toRemove) {
        const filePlan = filePlans.find((item) => item.name === name)!;
        const dir = join(componentBasePath, name);
        for (const file of filePlan.tracked) {
          const filePath = join(dir, file);
          if (existsSync(filePath)) unlinkSync(filePath);
          for (const label of Object.keys(installedHashes)) {
            if (label === `${name}/${file}`) {
              delete installedHashes[label];
              prunedConfig = true;
            }
          }
        }
        // Remove now-empty nested directories, but never touch a directory that
        // still contains user-owned files.
        const remaining = listFiles(dir);
        if (remaining.length === 0 && existsSync(dir)) rmdirSync(dir);
        console.log(pc.green(`✔ Removed ${name}`));

        // Drop this component's baseline-hash entries so a stale manifest
        // doesn't accumulate — shared files are left alone since we never
        // delete those (they may still be imported by hand-written code).
        for (const key of Object.keys(installedVersions)) {
          if (key === name || key.endsWith(`:${name}`)) {
            delete installedVersions[key];
            prunedConfig = true;
          }
        }
      }

      if (prunedConfig) {
        writeConfig(cwd, {
          ...config,
          componentPath: config?.componentPath ?? DEFAULT_COMPONENT_PATH,
          installedHashes,
          installedVersions,
        });
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
