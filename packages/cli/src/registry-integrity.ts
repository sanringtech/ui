// Shared registry-integrity checks, factored out so `doctor`, `build --check`,
// CI, and the MCP server can all validate an *already-parsed* registry.json
// the same way instead of re-implementing overlapping logic. This is
// distinct from `validateRegistry` (schema shape) and `registry-scan.ts`
// (scanning a local source tree during `build`) — this module only looks at
// a `Registry` object's internal references and, optionally, whether the
// files it declares are actually fetchable from its source.
import { fetchFile, type Registry } from './registry.js';
import { fetchTextTargetsConcurrent } from './utils.js';

const FILE_FETCH_CONCURRENCY = 6;

export interface RegistryIntegrityIssue {
  kind: 'dangling-component-dep' | 'dangling-shared-dep' | 'dangling-group-component' | 'unparseable-peer-version' | 'unfetchable-file';
  message: string;
}

// Deliberately not a full semver-range parser (no bundled semver
// dependency) — this exists to catch obviously-broken strings in a
// hand-written or third-party registry.json (typos, copy-paste mistakes),
// not to validate npm's full range grammar. Hyphen ranges ("1.0.0 - 2.0.0")
// require surrounding whitespace per npm's own syntax, which is what lets
// us tell them apart from a pre-release suffix ("1.0.0-beta.1") that never
// has surrounding whitespace.
const VERSION_TOKEN_RE =
  /^(>=|<=|>|<|=|\^|~)?\s*v?(\d+|[xX]|\*)(\.(\d+|[xX]|\*))?(\.(\d+|[xX]|\*))?(-[0-9A-Za-z.]+)?(\+[0-9A-Za-z.]+)?$/;

export function isParseableVersionRange(spec: string): boolean {
  const trimmed = spec.trim();
  if (!trimmed) return false;
  if (trimmed === '*' || trimmed === 'latest' || trimmed.startsWith('workspace:')) return true;
  return trimmed.split('||').every((alt) => {
    const sides = alt.trim().split(/\s+-\s+/);
    if (sides.length === 2) return sides.every((side) => VERSION_TOKEN_RE.test(side.trim()));
    return alt
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .every((token) => VERSION_TOKEN_RE.test(token));
  });
}

// Synchronous checks: dangling componentDeps/sharedDeps/group references and
// unparseable peer dependency version specs. Cheap enough to run on every
// `doctor` invocation and every MCP `doctor_project` call, unlike the
// file-fetchability check below.
export function findRegistryReferenceIssues(registry: Registry): RegistryIntegrityIssue[] {
  const issues: RegistryIntegrityIssue[] = [];
  const knownComponentNames = new Set(registry.components.map((c) => c.name));
  const knownSharedNames = new Set(registry.shared.map((s) => s.name));

  for (const component of registry.components) {
    for (const dep of component.componentDeps ?? []) {
      if (!knownComponentNames.has(dep)) {
        issues.push({
          kind: 'dangling-component-dep',
          message: `${component.name}: componentDeps references unknown component "${dep}"`,
        });
      }
    }
    for (const dep of component.sharedDeps ?? []) {
      if (!knownSharedNames.has(dep)) {
        issues.push({
          kind: 'dangling-shared-dep',
          message: `${component.name}: sharedDeps references unknown shared file "${dep}"`,
        });
      }
    }
    for (const [pkg, spec] of Object.entries(component.peerDependencies ?? {})) {
      if (!isParseableVersionRange(spec)) {
        issues.push({
          kind: 'unparseable-peer-version',
          message: `${component.name}: peerDependencies["${pkg}"] = "${spec}" is not a parseable version range`,
        });
      }
    }
  }

  for (const shared of registry.shared) {
    for (const [pkg, spec] of Object.entries(shared.peerDependencies ?? {})) {
      if (!isParseableVersionRange(spec)) {
        issues.push({
          kind: 'unparseable-peer-version',
          message: `shared/${shared.name}: peerDependencies["${pkg}"] = "${spec}" is not a parseable version range`,
        });
      }
    }
  }

  for (const group of registry.groups ?? []) {
    for (const name of group.components) {
      if (!knownComponentNames.has(name)) {
        issues.push({
          kind: 'dangling-group-component',
          message: `group "${group.id}": references unknown component "${name}"`,
        });
      }
    }
  }

  return issues;
}

// Async, network/disk-bound: confirms every file a registry declares is
// actually fetchable from `source`. Opt-in for callers (e.g. `doctor
// --offline` skips this) since it costs one fetch per declared file.
export async function checkRegistryFilesFetchable(
  registry: Registry,
  source?: string,
): Promise<RegistryIntegrityIssue[]> {
  const targets = [
    ...registry.components.flatMap((component) =>
      component.files.map((file) => ({ label: `${component.name}/${file}`, remotePath: `components/${file}` })),
    ),
    ...registry.shared.map((shared) => ({ label: `shared/${shared.name}`, remotePath: shared.file })),
  ];

  const results = await fetchTextTargetsConcurrent(targets, FILE_FETCH_CONCURRENCY, (remotePath) =>
    fetchFile(remotePath, source),
  );

  return results
    .filter((result): result is typeof result & { ok: false; error: unknown } => !result.ok)
    .map((result) => ({
      kind: 'unfetchable-file' as const,
      message: `${result.label}: could not fetch "${result.remotePath}" (${result.error instanceof Error ? result.error.message : String(result.error)})`,
    }));
}

export async function checkRegistryIntegrity(
  registry: Registry,
  options: { source?: string; checkFiles?: boolean } = {},
): Promise<RegistryIntegrityIssue[]> {
  const issues = findRegistryReferenceIssues(registry);
  if (options.checkFiles) {
    issues.push(...(await checkRegistryFilesFetchable(registry, options.source)));
  }
  return issues;
}
