// P9 batch D (ADR-0001, Charter: .claude/charters/p9-sanring-build.md) —
// pure functions that scan a third party's own Angular component source
// tree and classify its import/export relationships into the same
// componentDep/sharedDep/peerDependency shape `registry.json` uses. No CLI
// wiring, no process.exit, no writes — `commands/build.ts` (batch C) is the
// only caller and owns all I/O side effects and user-facing output.
import { existsSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import ts from 'typescript';

const SOURCE_FILE_EXCLUDE = /\.(spec|test|stories|cy)\.ts$/;

export interface DiscoveredComponentSource {
  name: string;
  dir: string;
  /** Absolute paths, .ts only, spec/test/stories/cy files excluded. */
  files: string[];
}

// Every immediate subdirectory of `sourceDir` is treated as one component,
// named after the directory. `shared` is reserved — a third party nesting
// their shared utilities inside the components dir (instead of alongside it,
// see `discoverSharedSources`) would otherwise be misread as a component
// named "shared".
export function discoverComponentSources(sourceDir: string): DiscoveredComponentSource[] {
  return readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'shared')
    .map((entry) => {
      const dir = join(sourceDir, entry.name);
      const files = readdirSync(dir, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith('.ts') && !SOURCE_FILE_EXCLUDE.test(f.name))
        .map((f) => join(dir, f.name));
      return { name: entry.name, dir, files };
    });
}

export interface DiscoveredSharedSource {
  name: string;
  file: string;
}

// Shared utilities live in a `shared/` directory *alongside* `sourceDir`
// (mirrors this repo's `registry/components` + `registry/shared` layout),
// not nested inside it. Only flat `.ts` files are considered — matches what
// a `../shared/xxx` import specifier can actually reference. A third party
// with no shared code at all is a legitimate registry, not an error, so a
// missing `shared/` directory returns [] rather than throwing.
export function discoverSharedSources(sourceDir: string): DiscoveredSharedSource[] {
  const sharedDir = join(dirname(sourceDir), 'shared');
  if (!existsSync(sharedDir)) return [];
  return readdirSync(sharedDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => ({ name: basename(entry.name, '.ts'), file: join(sharedDir, entry.name) }));
}

// '@angular/cdk/overlay' -> '@angular/cdk' (scoped: first two segments).
// 'embla-carousel/foo' -> 'embla-carousel' (unscoped: first segment).
export function canonicalizePackageName(specifier: string): string {
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

// Baseline packages assumed always-present in any Angular project. Imported
// constantly but never declared as a registry peerDependency — without this
// exclusion every single component would be misclassified as depending on
// them. Compared against the *canonicalized* specifier: an initial version
// of this matched the raw specifier exactly (verified against an 8-component
// ADR-0001 spike sample), but the full registry.json golden-fixture test
// (batch C) found `rxjs/operators` slipping through uncaught — canonicalizing
// both sides catches every submodule of a baseline package, not just its
// bare import.
export const BASELINE_PACKAGES = new Set([
  '@angular/core',
  '@angular/core/rxjs-interop',
  '@angular/common',
  'rxjs',
]);

export type ModuleSpecifierClassification =
  | { kind: 'sharedDep'; name: string }
  | { kind: 'componentDep'; name: string }
  | { kind: 'peerDependencyCandidate'; specifier: string }
  | { kind: 'internal' };

export function classifyModuleSpecifier(specifier: string): ModuleSpecifierClassification {
  if (specifier.startsWith('../shared/')) {
    return { kind: 'sharedDep', name: specifier.slice('../shared/'.length).split('/')[0] };
  }
  if (specifier.startsWith('../')) {
    return { kind: 'componentDep', name: specifier.slice('../'.length).split('/')[0] };
  }
  if (specifier.startsWith('./')) {
    return { kind: 'internal' };
  }
  return { kind: 'peerDependencyCandidate', specifier };
}

// Walks a single file's top-level `import ... from '...'` and
// `export ... from '...'` declarations and classifies each module
// specifier. Doesn't resolve or type-check anything — just reads the
// specifier text off the AST, so it works on a source tree that isn't
// necessarily a buildable TypeScript project on its own (this repo's own
// `registry/components/*` isn't one either — see registry-scan.test.ts).
export function classifyModuleSpecifiers(fileContent: string): ModuleSpecifierClassification[] {
  const source = ts.createSourceFile('scan.ts', fileContent, ts.ScriptTarget.Latest, true);
  const classifications: ModuleSpecifierClassification[] = [];

  ts.forEachChild(source, (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      classifications.push(classifyModuleSpecifier(node.moduleSpecifier.text));
    }
  });

  return classifications;
}

export function filterBaselinePackages(
  candidates: Extract<ModuleSpecifierClassification, { kind: 'peerDependencyCandidate' }>[],
): string[] {
  return candidates
    .map((c) => c.specifier)
    .filter((specifier) => !BASELINE_PACKAGES.has(canonicalizePackageName(specifier)));
}

export interface ValidatedDeps {
  componentDeps: string[];
  sharedDeps: string[];
  /** componentDep candidates that didn't match any discovered component — dropped, not written. */
  droppedComponentDeps: string[];
  /** sharedDep candidates that didn't match any discovered shared file — dropped, not written. */
  droppedSharedDeps: string[];
}

// componentDep/sharedDep candidates are only as trustworthy as the relative
// path they were parsed from — a typo or a stale import (or, as found during
// the ADR-0001 spike, an existing registry bug: see TODOLIST P24) would
// otherwise silently ship a dangling reference that breaks `sanring add`'s
// `resolveInstallSet`/`sharedByName.get` lookups at install time. Anything
// that doesn't resolve to something `discoverComponentSources`/
// `discoverSharedSources` actually found is dropped here instead, with the
// caller (batch C) responsible for surfacing the drop as a warning.
export function validateReferencedTargets(
  componentDepCandidates: string[],
  sharedDepCandidates: string[],
  knownComponentNames: ReadonlySet<string>,
  knownSharedNames: ReadonlySet<string>,
): ValidatedDeps {
  const componentDeps: string[] = [];
  const droppedComponentDeps: string[] = [];
  for (const name of new Set(componentDepCandidates)) {
    (knownComponentNames.has(name) ? componentDeps : droppedComponentDeps).push(name);
  }

  const sharedDeps: string[] = [];
  const droppedSharedDeps: string[] = [];
  for (const name of new Set(sharedDepCandidates)) {
    (knownSharedNames.has(name) ? sharedDeps : droppedSharedDeps).push(name);
  }

  return {
    componentDeps: componentDeps.sort(),
    sharedDeps: sharedDeps.sort(),
    droppedComponentDeps: droppedComponentDeps.sort(),
    droppedSharedDeps: droppedSharedDeps.sort(),
  };
}

// Looks for a `/** ... */` block directly above a class's `@Component(...)`
// decorator and takes its first line as the description. None of this
// repo's own components use this convention (their registry.json
// descriptions are hand-written prose, unrelated to source comments) — this
// exists for third-party authors who do document their components this way.
// Returns '' (not a guess) when there's nothing to find, so the caller can
// warn instead of shipping a fabricated description.
export function extractDescription(fileContent: string): string {
  const source = ts.createSourceFile('scan.ts', fileContent, ts.ScriptTarget.Latest, true);
  const fullText = source.getFullText();

  let description = '';

  ts.forEachChild(source, (node) => {
    if (description || !ts.isClassDeclaration(node) || !ts.canHaveDecorators(node)) return;

    const decorators = ts.getDecorators(node);
    const componentDecorator = decorators?.find(
      (d) =>
        ts.isCallExpression(d.expression) &&
        ts.isIdentifier(d.expression.expression) &&
        d.expression.expression.text === 'Component',
    );
    if (!componentDecorator) return;

    const commentRanges = ts.getLeadingCommentRanges(fullText, componentDecorator.getFullStart());
    // The comment directly above the decorator (i.e. last in source order).
    const jsDocRange = [...(commentRanges ?? [])]
      .reverse()
      .find((range) => range.kind === ts.SyntaxKind.MultiLineCommentTrivia);
    if (!jsDocRange) return;

    const raw = fullText.slice(jsDocRange.pos, jsDocRange.end);
    const firstLine = raw
      .replace(/^\/\*\*?/, '')
      .replace(/\*\/$/, '')
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, '').trim())
      .find((line) => line.length > 0);

    description = firstLine ?? '';
  });

  return description;
}

// ---------------------------------------------------------------------------
// Batch B — peerDependency transitive-closure dedup
//
// Only peerDependencies need this. componentDeps don't (`sanring add`'s
// resolveInstallSet walks the full componentDeps list itself — a cycle
// there, e.g. select/listbox, is a legitimate, already-tested case, not an
// error). sharedDeps don't either (every batch A/B mismatch against
// registry.json's sharedDeps traced back to a pre-existing registry bug —
// see TODOLIST P24 — never to a transitive relationship).
// ---------------------------------------------------------------------------

export interface ScannedComponent {
  name: string;
  /** Validated componentDep names (batch A's validateReferencedTargets output). */
  componentDeps: string[];
  /** Baseline-filtered, not yet canonicalized (batch A's filterBaselinePackages output). */
  rawPeerDependencyCandidates: string[];
}

export function buildComponentDepGraph(
  components: ScannedComponent[],
): ReadonlyMap<string, readonly string[]> {
  return new Map(components.map((c) => [c.name, c.componentDeps]));
}

// From `componentName`, walks every componentDep transitively (cycle-safe —
// a `seen` set means a cycle is simply not revisited, not an error) and
// returns the canonicalized peerDependency package names declared by every
// *other* component reachable that way. `componentName` itself is excluded:
// this is "what's already covered by my dependencies", not "what I need".
export function computeUpstreamPeerCoverage(
  componentName: string,
  graph: ReadonlyMap<string, readonly string[]>,
  rawPeerDepsByComponent: ReadonlyMap<string, readonly string[]>,
): Set<string> {
  const coverage = new Set<string>();
  const seen = new Set<string>([componentName]);
  const queue = [...(graph.get(componentName) ?? [])];

  while (queue.length > 0) {
    const name = queue.shift()!;
    if (seen.has(name)) continue;
    seen.add(name);

    for (const raw of rawPeerDepsByComponent.get(name) ?? []) {
      coverage.add(canonicalizePackageName(raw));
    }
    for (const dep of graph.get(name) ?? []) {
      if (!seen.has(dep)) queue.push(dep);
    }
  }

  return coverage;
}

// Final peerDependency package list for one component: its own canonicalized
// candidates, minus whatever's already covered by an upstream componentDep.
export function dedupePeerDependencies(
  rawPeerDependencyCandidates: string[],
  upstreamCoverage: ReadonlySet<string>,
): string[] {
  const canonical = new Set(rawPeerDependencyCandidates.map(canonicalizePackageName));
  return [...canonical].filter((name) => !upstreamCoverage.has(name)).sort();
}

export interface PackageJsonLike {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export type ResolvedVersion =
  | { resolved: true; version: string }
  | { resolved: false; packageName: string };

// Looks up a package's declared version spec from the user's own
// package.json — dependencies, then devDependencies, then peerDependencies.
// Never guesses a version when none of those have it; the caller (batch C)
// is responsible for what happens on `resolved: false` (charter Open
// Questions: fail the build rather than write an unresolved version).
export function resolvePeerDependencyVersion(
  packageName: string,
  cwdPackageJson: PackageJsonLike | null,
): ResolvedVersion {
  const version =
    cwdPackageJson?.dependencies?.[packageName] ??
    cwdPackageJson?.devDependencies?.[packageName] ??
    cwdPackageJson?.peerDependencies?.[packageName];

  return version !== undefined ? { resolved: true, version } : { resolved: false, packageName };
}
