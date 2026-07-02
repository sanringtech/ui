export type CliChangeType = 'major' | 'minor' | 'patch';

export interface CliChange {
  type: CliChangeType;
  hash: string | null;
  text: string;
}

export interface CliChangelogVersion {
  version: string;
  changes: CliChange[];
}

const CHANGE_TYPE_HEADING = /^###\s+(Major|Minor|Patch)\s+Changes$/i;
const VERSION_HEADING = /^##\s+(.+)$/;
const CHANGE_ITEM = /^-\s+(?:([a-f0-9]{7,40}):\s*)?(.+)$/;

/**
 * Parses the markdown format Changesets writes to a package's CHANGELOG.md
 * (## version / ### Major|Minor|Patch Changes / - hash: text) into structured data.
 */
export function parseCliChangelog(markdown: string): CliChangelogVersion[] {
  const versions: CliChangelogVersion[] = [];
  let current: CliChangelogVersion | null = null;
  let currentType: CliChangeType | null = null;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();

    const versionMatch = VERSION_HEADING.exec(line);
    if (versionMatch) {
      current = { version: versionMatch[1].trim(), changes: [] };
      versions.push(current);
      currentType = null;
      continue;
    }

    const typeMatch = CHANGE_TYPE_HEADING.exec(line);
    if (typeMatch) {
      currentType = typeMatch[1].toLowerCase() as CliChangeType;
      continue;
    }

    const itemMatch = CHANGE_ITEM.exec(line);
    if (itemMatch && current && currentType) {
      current.changes.push({ type: currentType, hash: itemMatch[1] ?? null, text: itemMatch[2] });
    }
  }

  return versions;
}
