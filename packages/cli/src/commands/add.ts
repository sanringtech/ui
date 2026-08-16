import { Command } from 'commander';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import ora from 'ora';
import pc from 'picocolors';
import {
  detectPackageManager,
  fetchFile,
  fetchRegistry,
  installCommand,
  installCommandParts,
  type RegistryIndex,
  type Registry,
  type RegistryComponent,
  type RegistryShared,
  createRegistryIndex,
} from '../registry.js';
import {
  confirmPrompt,
  getCliVersion,
  getInstalledPackageSpecs,
  hashContent,
  fetchTextTargetsConcurrent,
  readConfig,
  requireAngularProject,
  resolveComponentPath,
  resolveRegistrySource,
  satisfiesMinimumPackageSpec,
  writeConfig,
} from '../utils.js';
import { buildDiffJobs, printFileDiff, registryRelativePath } from './diff.js';

// Splits the `alias:componentName` syntax from ADR-0001 apart. No colon
// means "no explicit registry" — the caller falls back to defaultRegistry.
export function parseComponentRef(ref: string): { alias?: string; name: string } {
  const idx = ref.indexOf(':');
  if (idx === -1) return { name: ref };
  return { alias: ref.slice(0, idx), name: ref.slice(idx + 1) };
}

export function writeFile(dest: string, content: string, force: boolean): 'written' | 'skipped' {
  if (existsSync(dest) && !force) return 'skipped';
  const dir = dirname(dest);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(dest, content, 'utf-8');
  return 'written';
}

export interface OverwriteCandidate {
  label: string;
  dest: string;
}

export function collectPeerDeps(
  components: RegistryComponent[],
  sharedItems: RegistryShared[] | RegistryIndex,
): Record<string, string> {
  const deps: Record<string, string> = {};
  const sharedByName = Array.isArray(sharedItems)
    ? new Map(sharedItems.map((shared) => [shared.name, shared]))
    : sharedItems.sharedByName;

  for (const component of components) {
    Object.assign(deps, component.peerDependencies);
    for (const depName of component.sharedDeps ?? []) {
      const shared = sharedByName.get(depName);
      if (shared?.peerDependencies) Object.assign(deps, shared.peerDependencies);
    }
  }
  return deps;
}

export function collectOverwriteCandidates(
  components: RegistryComponent[],
  sharedItems: RegistryShared[] | RegistryIndex,
  componentBasePath: string,
  sharedDestDir: string,
): OverwriteCandidate[] {
  const candidates: OverwriteCandidate[] = [];
  const sharedNamesNeeded = new Set<string>();
  const sharedByName = Array.isArray(sharedItems)
    ? new Map(sharedItems.map((shared) => [shared.name, shared]))
    : sharedItems.sharedByName;

  for (const component of components) {
    for (const depName of component.sharedDeps ?? []) sharedNamesNeeded.add(depName);
  }

  for (const depName of sharedNamesNeeded) {
    const shared = sharedByName.get(depName);
    if (!shared) continue;

    const fileName = registryRelativePath(shared.file, 'shared');
    const dest = join(sharedDestDir, fileName);
    if (existsSync(dest)) candidates.push({ label: `shared/${fileName}`, dest });
  }

  for (const component of components) {
    const destDir = join(componentBasePath, component.name);
    for (const file of component.files) {
      const fileName = registryRelativePath(file, component.name);
      const dest = join(destDir, fileName);
      if (existsSync(dest)) candidates.push({ label: `${component.name}/${fileName}`, dest });
    }
  }

  return candidates;
}

async function confirmOverwrite(candidates: OverwriteCandidate[], yes: boolean): Promise<boolean> {
  if (candidates.length === 0) return true;

  console.log(
    pc.yellow(
      `  ⚠ ${candidates.length} existing file${candidates.length > 1 ? 's' : ''} would be overwritten:`,
    ),
  );
  for (const candidate of candidates) {
    console.log(pc.dim(`  – ${candidate.label}`));
  }

  if (yes) {
    console.log(pc.dim('\n  Proceeding because --yes was provided.\n'));
  }

  return confirmPrompt({
    yes,
    question: pc.dim('\n  Continue and overwrite these files?') + ' [y/N]: ',
    nonTtyRefusal: {
      title: 'Refusing to overwrite files without confirmation.',
      hint: `Re-run with ${pc.white('--dry-run')} to preview, or ${pc.white('--force --yes')} to confirm in non-interactive environments.`,
    },
  });
}

// Resolves the requested component names plus their transitive `componentDeps`
// into one ordered install list, so e.g. `sanring add select` also pulls in
// `listbox` instead of just printing a notice telling the user to run it again.
export function resolveInstallSet(
  requestedNames: string[],
  registry: Registry | RegistryIndex,
): { toInstall: RegistryComponent[]; autoAdded: string[]; missing: string[] } {
  const byName =
    'componentsByName' in registry
      ? registry.componentsByName
      : createRegistryIndex(registry).componentsByName;
  const requestedSet = new Set(requestedNames);
  const seen = new Set<string>();
  const toInstall: RegistryComponent[] = [];
  const autoAdded: string[] = [];
  const missing: string[] = [];
  const queue = [...requestedNames];

  while (queue.length > 0) {
    const name = queue.shift()!;
    if (seen.has(name)) continue;
    seen.add(name);

    const component = byName.get(name);
    if (!component) {
      if (requestedSet.has(name)) missing.push(name);
      continue;
    }

    toInstall.push(component);
    if (!requestedSet.has(name)) autoAdded.push(name);
    for (const dep of component.componentDeps ?? []) {
      if (!seen.has(dep)) queue.push(dep);
    }
  }

  return { toInstall, autoAdded, missing };
}

const FILE_FETCH_CONCURRENCY = 6;

interface SharedJob {
  shared: RegistryShared;
  fileName: string;
  dest: string;
  remotePath: string;
}

interface ComponentFileJob {
  file: string;
  fileName: string;
  dest: string;
  remotePath: string;
}

export const addCommand = new Command('add')
  .description('Add one or more components to your project')
  .argument('<components...>', 'component name(s) (e.g. accordion button)')
  .option('-p, --path <path>', 'destination path relative to cwd')
  .option('-s, --shared-path <path>', 'destination for shared utilities (default: <path>/shared)')
  .option('-f, --force', 'overwrite existing files', false)
  .option('-y, --yes', 'skip overwrite confirmation when using --force', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option('--dry-run', 'preview changes without writing files', false)
  .option('--check', 'validate every registry file can be fetched without writing files', false)
  .option('--diff', 'show diff between registry and local files without installing', false)
  .option('--view', 'show registry file contents without installing', false)
  .action(
    async (
      componentNames: string[],
      options: {
        path?: string;
        sharedPath?: string;
        force: boolean;
        yes: boolean;
        registry?: string;
        dryRun: boolean;
        check: boolean;
        diff: boolean;
        view: boolean;
      },
    ) => {
      const cwd = process.cwd();

      // Angular project guard
      requireAngularProject(
        cwd,
        'Run from the root of an Angular project, or run `sanring init` first.',
      );

      // Parse `alias:componentName` syntax. All requested components in one
      // `add` call must share the same explicit alias (if any) — the CLI
      // fetches a single registry per invocation, it doesn't merge component
      // lists across registries (ADR-0001).
      const parsedRefs = componentNames.map(parseComponentRef);
      const explicitAliases = new Set(
        parsedRefs.map((ref) => ref.alias).filter((a): a is string => a !== undefined),
      );
      if (explicitAliases.size > 1) {
        console.error(
          pc.red(`✖ Cannot mix registries in one \`add\`: ${[...explicitAliases].join(', ')}`),
        );
        console.error(pc.dim('  Run separate `add` commands for components from different registries.'));
        process.exit(1);
        return;
      }
      const alias = explicitAliases.size === 1 ? [...explicitAliases][0] : undefined;
      const strippedNames = parsedRefs.map((ref) => ref.name);

      // Resolve component path: CLI option > sanring.config.json > default
      const config = readConfig(cwd);
      const registrySource = resolveRegistrySource(alias, config, options.registry);
      // The alias actually used to resolve the registry — kept separate from
      // `registrySource` because `--registry` can override the fetch target
      // without changing what the install should be recorded under.
      const effectiveAlias = alias ?? config?.defaultRegistry;
      const resolvedComponentPath = resolveComponentPath(options.path, config);
      const componentBasePath = resolve(cwd, resolvedComponentPath);
      const resolvedSharedPath = options.sharedPath ?? config?.sharedPath;
      const installedHashes = { ...config?.installedHashes };
      const installedVersions = { ...config?.installedVersions };

      // Fetch registry
      const registrySpinner = ora('Loading registry...').start();
      const registry = await fetchRegistry(registrySource);
      const registryIndex = createRegistryIndex(registry);
      registrySpinner.stop();

      const { toInstall, autoAdded, missing } = resolveInstallSet(strippedNames, registryIndex);

      if (missing.length > 0) {
        const available = registryIndex.componentNames.join(', ');
        console.error(
          pc.red(`✖ Component${missing.length > 1 ? 's' : ''} not found: ${missing.join(', ')}`),
        );
        console.error(pc.dim(`  Available: ${available}`));
        process.exit(1);
        return;
      }

      const requestedLabel = componentNames.join(', ');
      const autoLabel =
        autoAdded.length > 0
          ? pc.dim(` (+ ${autoAdded.length} dependency: ${autoAdded.join(', ')})`)
          : '';

      // --diff: show diff between registry and local without installing
      if (options.diff) {
        console.log(pc.cyan(`\nDiff: ${pc.bold(requestedLabel)}${autoLabel}\n`));
        const jobs = buildDiffJobs(toInstall, registryIndex, {
          componentBasePath,
          sharedDestDir: config?.sharedPath ? resolve(cwd, config.sharedPath) : join(componentBasePath, 'shared'),
          installedHashes: config?.installedHashes,
        });
        const results = await fetchTextTargetsConcurrent(
          jobs,
          FILE_FETCH_CONCURRENCY,
          (remotePath) => fetchFile(remotePath, registrySource),
        );
        for (const result of results) {
          if (!existsSync(result.localPath)) {
            console.log(pc.cyan(`  + ${result.label} (new, not yet installed)`));
            continue;
          }
          if (!result.ok) {
            console.warn(pc.yellow(`  ⚠ Could not fetch ${result.remotePath}: ${result.error instanceof Error ? result.error.message : result.error}`));
            continue;
          }
          printFileDiff(result.label, readFileSync(result.localPath, 'utf-8'), result.content, result.recordedHash);
        }
        return;
      }

      // --view: show raw registry file contents without installing
      if (options.view) {
        console.log(pc.cyan(`\nView: ${pc.bold(requestedLabel)}${autoLabel}\n`));
        for (const component of toInstall) {
          const label = autoAdded.includes(component.name)
            ? `${component.name} ${pc.dim('(dependency)')}`
            : component.name;
          for (const file of component.files) {
            const fileName = registryRelativePath(file, component.name);
            console.log(pc.bold(`── ${label}/${fileName} ──\n`));
            const content = await fetchFile(`components/${file}`, registrySource);
            console.log(content);
          }
        }
        return;
      }

      console.log(pc.cyan(`\nAdding ${pc.bold(requestedLabel)}${autoLabel}...\n`));
      if (options.dryRun) {
        console.log(pc.dim('  Dry run — no files will be written.\n'));
      }

      const sharedDestDir = options.sharedPath
        ? resolve(cwd, options.sharedPath)
        : config?.sharedPath
          ? resolve(cwd, config.sharedPath)
          : join(componentBasePath, 'shared');

      // A metadata-only dry run can look healthy while an individual source
      // file is missing from a remote/custom registry. Validate the complete
      // install set before presenting the plan (and expose the same check as
      // an explicit CI-friendly flag).
      if (options.dryRun || options.check) {
        const validationTargets = [
          ...[...new Set(toInstall.flatMap((component) => component.sharedDeps ?? []))]
            .map((depName) => registryIndex.sharedByName.get(depName))
            .filter((shared): shared is RegistryShared => Boolean(shared))
            .map((shared) => ({ remotePath: shared.file, label: `shared/${shared.name}` })),
          ...toInstall.flatMap((component) =>
            component.files.map((file) => ({
              remotePath: `components/${file}`,
              label: `${component.name}/${file}`,
            })),
          ),
        ];
        const validation = await fetchTextTargetsConcurrent(
          validationTargets,
          FILE_FETCH_CONCURRENCY,
          (remotePath) => fetchFile(remotePath, registrySource),
        );
        const failedValidation = validation.filter((result) => !result.ok);
        if (failedValidation.length > 0) {
          console.error(pc.red(`✖ ${failedValidation.length} registry file${failedValidation.length > 1 ? 's' : ''} could not be fetched:`));
          for (const result of failedValidation) {
            console.error(pc.dim(`  ${result.label}: ${result.error instanceof Error ? result.error.message : result.error}`));
          }
          console.error(pc.dim('  Fix the registry or run with a different --registry source.\n'));
          process.exit(1);
          return;
        }
        if (options.check) {
          console.log(pc.green(`✔ Validated ${validation.length} registry file${validation.length !== 1 ? 's' : ''}; nothing written.\n`));
          return;
        }
      }

      if (options.force && !options.dryRun) {
        const overwriteCandidates = collectOverwriteCandidates(
          toInstall,
          registryIndex,
          componentBasePath,
          sharedDestDir,
        );
        const confirmed = await confirmOverwrite(overwriteCandidates, options.yes);
        if (!confirmed) {
          console.log(pc.dim('\n  No files were written.\n'));
          process.exit(1);
          return;
        }
      }

      let written = 0,
        skipped = 0,
        failed = 0,
        peerInstallFailed = false;

      // Shared utilities — deduped across the whole install set so a dep used
      // by multiple requested components is only fetched/written once.
      const sharedNamesNeeded = new Set<string>();
      for (const component of toInstall) {
        for (const depName of component.sharedDeps ?? []) sharedNamesNeeded.add(depName);
      }

      if (sharedNamesNeeded.size > 0) {
        console.log(pc.dim('  Shared utilities:'));
        const sharedJobs: SharedJob[] = [...sharedNamesNeeded].flatMap((depName) => {
          const shared = registryIndex.sharedByName.get(depName);
          if (!shared) {
            console.warn(pc.yellow(`  ⚠ Unknown shared dep "${depName}"`));
            return [];
          }
          const fileName = registryRelativePath(shared.file, 'shared');
          const dest = join(sharedDestDir, fileName);
          return [{ shared, fileName, dest, remotePath: shared.file }];
        });

        for (const { fileName, dest } of sharedJobs) {
          if (options.dryRun) {
            const exists = existsSync(dest);
            if (exists && !options.force) {
              console.log(pc.dim(`  – shared/${fileName} (exists, would skip)`));
              skipped++;
            } else {
              console.log(
                pc.cyan(`  + shared/${fileName}${exists ? pc.dim(' (would overwrite)') : ''}`),
              );
              written++;
            }
            continue;
          }
        }

        if (!options.dryRun) {
          const sharedResults = await fetchTextTargetsConcurrent(
            sharedJobs,
            FILE_FETCH_CONCURRENCY,
            (remotePath) => fetchFile(remotePath, registrySource),
          );

          for (const result of sharedResults) {
            if (!result.ok) {
              console.log(pc.yellow(`  ⚠ shared/${result.fileName} (fetch failed)`));
              failed++;
              continue;
            }
            const writeResult = writeFile(result.dest, result.content, options.force);
            if (writeResult === 'written') {
              installedHashes[`shared/${result.fileName}`] = hashContent(result.content);
              console.log(pc.green(`  ✔ shared/${result.fileName}`));
              written++;
            } else {
              console.log(
                pc.dim(`  – shared/${result.fileName} (exists, use --force to overwrite)`),
              );
              skipped++;
            }
          }
        }
        console.log('');
      }

      // Component files
      for (const component of toInstall) {
        const destDir = join(componentBasePath, component.name);
        const label = autoAdded.includes(component.name)
          ? `${component.name} ${pc.dim('(dependency)')}`
          : component.name;
        console.log(pc.dim(`  ${label}:`));

        const fileJobs: ComponentFileJob[] = component.files.map((file) => {
          const fileName = registryRelativePath(file, component.name);
          const dest = join(destDir, fileName);
          return { file, fileName, dest, remotePath: `components/${file}` };
        });

        for (const { fileName, dest } of fileJobs) {
          if (options.dryRun) {
            const exists = existsSync(dest);
            if (exists && !options.force) {
              console.log(pc.dim(`  – ${fileName} (exists, would skip)`));
              skipped++;
            } else {
              console.log(pc.cyan(`  + ${fileName}${exists ? pc.dim(' (would overwrite)') : ''}`));
              written++;
            }
            continue;
          }
        }

        if (!options.dryRun) {
          const fileResults = await fetchTextTargetsConcurrent(
            fileJobs,
            FILE_FETCH_CONCURRENCY,
            (remotePath) => fetchFile(remotePath, registrySource),
          );

          for (const result of fileResults) {
            if (!result.ok) {
              console.log(pc.yellow(`  ⚠ ${result.fileName} (fetch failed)`));
              failed++;
              continue;
            }
            const writeResult = writeFile(result.dest, result.content, options.force);
            if (writeResult === 'written') {
              installedHashes[`${component.name}/${result.fileName}`] = hashContent(result.content);
              console.log(pc.green(`  ✔ ${result.fileName}`));
              written++;
            } else {
              console.log(pc.dim(`  – ${result.fileName} (exists, use --force to overwrite)`));
              skipped++;
            }
          }
        }
        console.log('');
      }

      // Peer dependencies — collected once across the whole install set.
      const allPeerDeps = collectPeerDeps(toInstall, registryIndex);
      if (Object.keys(allPeerDeps).length > 0) {
        const installed = getInstalledPackageSpecs(cwd);
        const missingDeps = Object.entries(allPeerDeps).filter(([pkg]) => !installed.has(pkg));
        const outdatedDeps = Object.entries(allPeerDeps).filter(([pkg, ver]) => {
          const installedSpec = installed.get(pkg);
          return installedSpec !== undefined && !satisfiesMinimumPackageSpec(installedSpec, ver);
        });
        const already = Object.entries(allPeerDeps)
          .filter(([pkg, ver]) => {
            const installedSpec = installed.get(pkg);
            return installedSpec !== undefined && satisfiesMinimumPackageSpec(installedSpec, ver);
          })
          .map(([pkg]) => pkg);
        const depsToInstall = [...missingDeps, ...outdatedDeps];

        if (already.length > 0) {
          console.log(pc.dim(`  Already installed: ${already.map((p) => pc.green(p)).join(', ')}`));
        }

        if (outdatedDeps.length > 0) {
          console.log(
            pc.dim(
              `  Updating peer dependencies: ${outdatedDeps
                .map(([pkg, ver]) => `${pc.yellow(pkg)} ${installed.get(pkg)} → ${ver}`)
                .join(', ')}`,
            ),
          );
        }

        if (depsToInstall.length > 0) {
          const pm = detectPackageManager(cwd);
          const pkgs = depsToInstall.map(([pkg, ver]) => `${pkg}@${ver}`);
          const cmd = installCommand(pm, pkgs);

          if (options.dryRun) {
            console.log(pc.dim(`  Would install: ${pc.cyan(cmd)}`));
          } else {
            console.log(pc.dim(`  Installing: ${pc.cyan(cmd)}\n`));
            const { bin, args } = installCommandParts(pm, pkgs);
            const result = spawnSync(bin, args, { stdio: 'inherit', shell: false });
            if (result.status !== 0) {
              peerInstallFailed = true;
              console.warn(pc.yellow(`  ⚠ Install failed. Run manually:\n  ${pc.white(cmd)}`));
            }
          }
        }
        console.log('');
      }

      if (!options.dryRun && written > 0) {
        const cliVersion = getCliVersion();
        for (const component of toInstall) {
          // Lazy migration: a component touched by `add` gets the current key
          // format. Legacy bare keys are only left alone until next touched.
          if (effectiveAlias) delete installedVersions[component.name];
          const key = effectiveAlias ? `${effectiveAlias}:${component.name}` : component.name;
          installedVersions[key] = cliVersion;
        }
        writeConfig(cwd, {
          ...config,
          componentPath: resolvedComponentPath,
          sharedPath: resolvedSharedPath,
          installedHashes,
          installedVersions,
        });
      }

      const parts: string[] = [];
      if (written > 0) parts.push(pc.green(`${written} ${options.dryRun ? 'to add' : 'added'}`));
      if (skipped > 0) parts.push(pc.dim(`${skipped} skipped`));
      if (failed > 0) parts.push(pc.yellow(`${failed} failed`));
      if (peerInstallFailed) parts.push(pc.red('peer dependencies failed'));
      const suffix = options.dryRun ? pc.dim(' (dry run, no files written)') : '';
      console.log(`${pc.bold(requestedLabel)} — ${parts.join(', ')}${suffix}\n`);

      if (peerInstallFailed) {
        console.error(pc.yellow(`  Source files were written, but dependencies were not installed.`));
        console.error(pc.dim(`  Run ${pc.white('sanring doctor')} after repairing the package manager state.\n`));
        process.exit(1);
      }

      if (skipped > 0 && !options.dryRun) {
        console.log(pc.dim(`  Run with ${pc.white('--force')} to overwrite existing files.\n`));
      }
    },
  );
