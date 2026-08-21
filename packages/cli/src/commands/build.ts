import { Command } from 'commander';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import pc from 'picocolors';
import {
  type Registry,
  type RegistryComponent,
  type RegistryShared,
  validateRegistry,
} from '../registry.js';
import { findRegistryReferenceIssues } from '../registry-integrity.js';
import {
  canonicalizePeerDependencies,
  classifyModuleSpecifiers,
  discoverComponentSources,
  discoverSharedSources,
  extractDescription,
  filterBaselinePackages,
  resolvePeerDependencyVersion,
  validateReferencedTargets,
  type PackageJsonLike,
  type ResolvedVersion,
} from '../registry-scan.js';

interface CwdPackageJson extends PackageJsonLike {
  name?: string;
}

interface RegistryManifest {
  groups?: Registry['groups'];
  components?: Record<string, Partial<Pick<RegistryComponent, 'description' | 'since' | 'migrations' | 'tags'>>>;
  shared?: Record<string, Partial<Pick<RegistryShared, 'description'>>>;
}

function readCwdPackageJson(cwd: string): CwdPackageJson | null {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as CwdPackageJson;
  } catch {
    return null;
  }
}

function readManifest(cwd: string, path?: string): RegistryManifest | null {
  const manifestPath = resolve(cwd, path ?? 'registry.manifest.json');
  if (!existsSync(manifestPath)) return null;
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf-8')) as RegistryManifest;
  } catch (error) {
    console.warn(pc.yellow(`⚠ Could not read registry manifest: ${error instanceof Error ? error.message : error}`));
    return null;
  }
}

// Raw import/export scan for one component: every file's specifiers,
// classified and baseline-filtered, not yet validated against known targets.
interface RawComponentScan {
  name: string;
  dir: string;
  files: string[];
  componentDepCandidates: string[];
  sharedDepCandidates: string[];
  rawPeerDependencyCandidates: string[];
  description: string;
}

function scanRawComponent(name: string, dir: string, files: string[]): RawComponentScan {
  const componentDepCandidates: string[] = [];
  const sharedDepCandidates: string[] = [];
  const rawPeerDependencyCandidates: string[] = [];
  let description = '';

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    for (const classification of classifyModuleSpecifiers(content)) {
      if (classification.kind === 'componentDep') componentDepCandidates.push(classification.name);
      else if (classification.kind === 'sharedDep') sharedDepCandidates.push(classification.name);
      else if (classification.kind === 'peerDependencyCandidate') {
        rawPeerDependencyCandidates.push(...filterBaselinePackages([classification]));
      }
    }
    if (!description) description = extractDescription(content);
  }

  return { name, dir, files, componentDepCandidates, sharedDepCandidates, rawPeerDependencyCandidates, description };
}

function scanRawShared(name: string, file: string): { name: string; file: string; rawPeerDependencyCandidates: string[] } {
  const content = readFileSync(file, 'utf-8');
  const rawPeerDependencyCandidates = classifyModuleSpecifiers(content)
    .filter((c) => c.kind === 'peerDependencyCandidate')
    .flatMap((c) => filterBaselinePackages([c]));
  return { name, file, rawPeerDependencyCandidates };
}

function resolveVersions(
  packageNames: string[],
  cwdPackageJson: PackageJsonLike | null,
  unresolved: Set<string>,
): Record<string, string> {
  const peerDependencies: Record<string, string> = {};
  for (const name of packageNames) {
    const result: ResolvedVersion = resolvePeerDependencyVersion(name, cwdPackageJson);
    if (result.resolved) peerDependencies[name] = result.version;
    else unresolved.add(result.packageName);
  }
  return peerDependencies;
}

export const buildCommand = new Command('build')
  .description('Generate a registry.json (and matching file layout) from your own component source directory')
  .option('-s, --source <path>', 'directory containing your component subdirectories', './components')
  .option('-o, --out <path>', 'output directory for the generated registry', './dist-registry')
  .option('-n, --name <name>', 'registry name (defaults to package.json "name")')
  .option('--manifest <path>', 'optional metadata manifest (default: registry.manifest.json)')
  .option('--dry-run', 'preview without writing files', false)
  .option('--check', 'scan and validate without writing files (CI mode)', false)
  .option('--json', 'output machine-readable build results (useful for CI and coding agents)', false)
  .action(async (options: { source: string; out: string; name?: string; manifest?: string; dryRun: boolean; check: boolean; json: boolean }) => {
    const cwd = process.cwd();
    const sourceDir = resolve(cwd, options.source);
    const outDir = resolve(cwd, options.out);
    const cwdPackageJson = readCwdPackageJson(cwd);

    if (!existsSync(sourceDir)) {
      if (options.json) {
        console.log(JSON.stringify({ ok: false, error: `Source directory not found: ${sourceDir}` }, null, 2));
      } else {
        console.error(pc.red(`✖ Source directory not found: ${sourceDir}`));
      }
      process.exit(1);
      return;
    }

    const registryName = options.name ?? cwdPackageJson?.name;
    if (!registryName) {
      if (options.json) {
        console.log(
          JSON.stringify(
            { ok: false, error: 'No registry name. Pass --name <name>, or add a "name" field to package.json.' },
            null,
            2,
          ),
        );
      } else {
        console.error(
          pc.red('✖ No registry name. Pass --name <name>, or add a "name" field to package.json.'),
        );
      }
      process.exit(1);
      return;
    }

    const discoveredComponents = discoverComponentSources(sourceDir);
    const discoveredShared = discoverSharedSources(sourceDir);
    const knownComponentNames = new Set(discoveredComponents.map((c) => c.name));
    const knownSharedNames = new Set(discoveredShared.map((s) => s.name));

    const rawComponents = discoveredComponents.map((c) => scanRawComponent(c.name, c.dir, c.files));
    const rawShared = discoveredShared.map((s) => scanRawShared(s.name, s.file));

    // Validate componentDeps/sharedDeps against what was actually discovered —
    // an unvalidated candidate would otherwise silently ship a dangling
    // reference that breaks sanring add's resolveInstallSet lookups.
    const validated = new Map(
      rawComponents.map((raw) => [
        raw.name,
        validateReferencedTargets(
          raw.componentDepCandidates,
          raw.sharedDepCandidates,
          knownComponentNames,
          knownSharedNames,
        ),
      ]),
    );

    const warnings: Array<{ component: string; message: string }> = [];

    for (const raw of rawComponents) {
      const v = validated.get(raw.name)!;
      for (const dropped of v.droppedComponentDeps) {
        const message = `dropping componentDep "${dropped}" — no matching component found`;
        warnings.push({ component: raw.name, message });
        if (!options.json) console.warn(pc.yellow(`⚠ ${raw.name}: ${message}`));
      }
      for (const dropped of v.droppedSharedDeps) {
        const message = `dropping sharedDep "${dropped}" — no matching shared file found`;
        warnings.push({ component: raw.name, message });
        if (!options.json) console.warn(pc.yellow(`⚠ ${raw.name}: ${message}`));
      }
      if (!raw.description) {
        const message = 'no description found, edit registry.json manually';
        warnings.push({ component: raw.name, message });
        if (!options.json) console.warn(pc.yellow(`⚠ ${raw.name}: ${message}`));
      }
    }

    const unresolved = new Set<string>();

    const components: RegistryComponent[] = rawComponents.map((raw) => {
      const finalPeerPackages = canonicalizePeerDependencies(raw.rawPeerDependencyCandidates);
      const peerDependencies = resolveVersions(finalPeerPackages, cwdPackageJson, unresolved);
      const v = validated.get(raw.name)!;

      const component: RegistryComponent = {
        name: raw.name,
        description: raw.description,
        files: raw.files.map((f) => `${raw.name}/${relative(raw.dir, f).split('\\').join('/')}`),
      };
      if (v.sharedDeps.length > 0) component.sharedDeps = v.sharedDeps;
      if (v.componentDeps.length > 0) component.componentDeps = v.componentDeps;
      if (Object.keys(peerDependencies).length > 0) component.peerDependencies = peerDependencies;
      return component;
    });

    const shared: RegistryShared[] = rawShared.map((raw) => {
      const finalPeerPackages = canonicalizePeerDependencies(raw.rawPeerDependencyCandidates);
      const peerDependencies = resolveVersions(finalPeerPackages, cwdPackageJson, unresolved);

      const entry: RegistryShared = {
        name: raw.name,
        description: '',
        file: `shared/${basename(raw.file)}`,
      };
      if (Object.keys(peerDependencies).length > 0) entry.peerDependencies = peerDependencies;
      return entry;
    });

    if (unresolved.size > 0) {
      if (options.json) {
        console.log(
          JSON.stringify(
            { ok: false, error: 'unresolved-peer-dependencies', unresolvedPeerDependencies: [...unresolved].sort() },
            null,
            2,
          ),
        );
      } else {
        console.error(
          pc.red(
            `✖ Could not resolve a version for ${unresolved.size} peer dependenc${unresolved.size > 1 ? 'ies' : 'y'}:`,
          ),
        );
        for (const name of [...unresolved].sort()) console.error(pc.dim(`  - ${name}`));
        console.error(
          pc.dim('  Add them to dependencies/devDependencies/peerDependencies in package.json and re-run.'),
        );
      }
      process.exit(1);
      return;
    }

    const manifest = readManifest(cwd, options.manifest);
    for (const component of components) Object.assign(component, manifest?.components?.[component.name] ?? {});
    for (const item of shared) Object.assign(item, manifest?.shared?.[item.name] ?? {});
    const registry: Registry = { name: registryName, shared, components };
    if (manifest?.groups) registry.groups = manifest.groups;

    let validatedRegistry: Registry;
    try {
      validatedRegistry = validateRegistry(registry);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (options.json) {
        console.log(JSON.stringify({ ok: false, error: 'validation-failed', message }, null, 2));
      } else {
        console.error(pc.red('✖ Generated registry failed validation:'));
        console.error(pc.dim(`  ${message}`));
      }
      process.exit(1);
      return;
    }

    // Component/sharedDep candidates were already validated against
    // discovered names during scanning (see `validated` above), so this
    // mainly catches what scanning can't: a manifest-supplied `groups` entry
    // referencing an unknown component, or a garbage peer dependency version
    // string pulled verbatim from package.json.
    for (const issue of findRegistryReferenceIssues(validatedRegistry)) {
      warnings.push({ component: '(registry)', message: issue.message });
      if (!options.json) console.warn(pc.yellow(`⚠ ${issue.message}`));
    }

    const componentSummaries = components.map((component) => ({
      name: component.name,
      componentDeps: component.componentDeps ?? [],
      sharedDeps: component.sharedDeps ?? [],
      peerDependencies: component.peerDependencies ? Object.keys(component.peerDependencies) : [],
    }));

    if (!options.json) {
      console.log(pc.cyan(`\n${pc.bold(registryName)}`) + pc.dim(` — ${components.length} component(s), ${shared.length} shared file(s)\n`));
      for (const component of components) {
        const deps: string[] = [];
        if (component.componentDeps?.length) deps.push(`componentDeps: ${component.componentDeps.join(', ')}`);
        if (component.sharedDeps?.length) deps.push(`sharedDeps: ${component.sharedDeps.join(', ')}`);
        if (component.peerDependencies && Object.keys(component.peerDependencies).length) {
          deps.push(`peerDependencies: ${Object.keys(component.peerDependencies).join(', ')}`);
        }
        console.log(`  ${pc.bold(component.name)}${deps.length ? pc.dim(`  (${deps.join('; ')})`) : ''}`);
      }
    }

    if (options.dryRun || options.check) {
      if (options.json) {
        console.log(
          JSON.stringify(
            {
              ok: true,
              registryName,
              components: componentSummaries,
              sharedCount: shared.length,
              warnings,
              written: false,
            },
            null,
            2,
          ),
        );
      } else {
        console.log(pc.dim(`\n  ${options.check ? 'Check' : 'Dry run'} — nothing written${options.check ? '.' : `; run without --dry-run to write to ${outDir}.`}\n`));
      }
      return;
    }

    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'registry.json'), JSON.stringify(validatedRegistry, null, 2) + '\n', 'utf-8');

    for (const raw of rawComponents) {
      const destDir = join(outDir, 'components', raw.name);
      mkdirSync(destDir, { recursive: true });
      for (const file of raw.files) {
        const relativeFile = relative(raw.dir, file);
        const destination = join(destDir, relativeFile);
        mkdirSync(dirname(destination), { recursive: true });
        copyFileSync(file, destination);
      }
    }

    if (rawShared.length > 0) {
      const sharedDestDir = join(outDir, 'shared');
      mkdirSync(sharedDestDir, { recursive: true });
      for (const raw of rawShared) {
        const destination = join(outDir, 'shared', basename(raw.file));
        mkdirSync(dirname(destination), { recursive: true });
        copyFileSync(raw.file, destination);
      }
    }

    if (options.json) {
      console.log(
        JSON.stringify(
          {
            ok: true,
            registryName,
            components: componentSummaries,
            sharedCount: shared.length,
            warnings,
            written: true,
            outDir,
          },
          null,
          2,
        ),
      );
    } else {
      console.log(pc.green(`\n✔ Wrote ${outDir}\n`));
    }
  });
