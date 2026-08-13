import { Command } from 'commander';
import pc from 'picocolors';
import { createRegistryIndex, fetchRegistry } from '../registry.js';
import {
  getCliVersion,
  parseComponentRef,
  readConfig,
  requireAngularProject,
  resolveRegistrySource,
  semverLte,
} from '../utils.js';

interface MigrationTarget {
  key: string;
  name: string;
  installedVersion: string;
}

function migrationTargetFromKey(key: string, installedVersion: string): MigrationTarget {
  return { key, name: parseComponentRef(key).name, installedVersion };
}

function findInstalledVersion(
  installedVersions: Record<string, string>,
  componentRef: string,
): string | undefined {
  const parsed = parseComponentRef(componentRef);
  const exact = installedVersions[componentRef];
  if (exact !== undefined) return exact;

  const bare = installedVersions[parsed.name];
  if (bare !== undefined) return bare;

  const aliasedMatches = Object.entries(installedVersions).filter(
    ([key]) => parseComponentRef(key).name === parsed.name,
  );
  return aliasedMatches.length === 1 ? aliasedMatches[0][1] : undefined;
}

export const migrateCommand = new Command('migrate')
  .description(
    'Detect breaking changes between your installed component versions and the current registry, and print migration steps',
  )
  .argument('[components...]', 'component name(s) to check; omit to check all installed')
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option(
    '--check',
    'exit 1 if any migration is needed (CI gate), without printing steps',
    false,
  )
  .action(
    async (
      componentNames: string[],
      options: { registry?: string; check: boolean },
    ) => {
      const cwd = process.cwd();

      requireAngularProject(cwd);

      const config = readConfig(cwd);
      if (!config) {
        console.error(
          pc.red('✖ sanring.config.json not found. Run `sanring init` first.'),
        );
        process.exit(1);
        return;
      }

      const registry = await fetchRegistry(resolveRegistrySource(undefined, config, options.registry));
      const registryIndex = createRegistryIndex(registry);
      const currentCliVersion = getCliVersion();

      // Determine which components to check
      const installedVersions = config.installedVersions ?? {};
      const installedComponentNames = Object.keys(installedVersions);

      // If config has no installedVersions at all, fall back to inferring from
      // installedHashes (keys like "button/button.component.ts" → "button")
      const inferredNames = new Set<string>();
      if (installedComponentNames.length === 0 && config.installedHashes) {
        for (const label of Object.keys(config.installedHashes)) {
          const parts = label.split('/');
          if (parts.length >= 2 && parts[0] !== 'shared' && parts[0] !== 'src') {
            inferredNames.add(parts[0]);
          }
        }
      }

      const targets: MigrationTarget[] =
        componentNames.length > 0
          ? componentNames.map((name) =>
              migrationTargetFromKey(name, findInstalledVersion(installedVersions, name) ?? '0.0.0'),
            )
          : installedComponentNames.length > 0
            ? installedComponentNames.map((key) => migrationTargetFromKey(key, installedVersions[key]))
            : [...inferredNames].map((name) => migrationTargetFromKey(name, '0.0.0'));

      if (targets.length === 0) {
        console.log(pc.dim('No installed components found in sanring.config.json.\n'));
        return;
      }

      type MigrationResult =
        | { kind: 'upToDate'; key: string; name: string }
        | { kind: 'notFound'; key: string; name: string }
        | {
            kind: 'needsMigration';
            key: string;
            name: string;
            installedVersion: string;
            migrations: Array<{ fromVersion: string; breaking: boolean; steps: string[] }>;
          };

      const results: MigrationResult[] = [];

      for (const target of targets) {
        const component = registryIndex.componentsByName.get(target.name);
        if (!component) {
          results.push({ kind: 'notFound', key: target.key, name: target.name });
          continue;
        }

        if (!component.migrations || component.migrations.length === 0) {
          results.push({ kind: 'upToDate', key: target.key, name: target.name });
          continue;
        }

        // A migration applies when the installed version is at or behind the
        // migration's fromVersion — meaning the user hasn't yet received the
        // breaking change introduced after fromVersion.
        const applicable = component.migrations.filter(
          (m) => semverLte(target.installedVersion, m.fromVersion),
        );

        if (applicable.length === 0) {
          results.push({ kind: 'upToDate', key: target.key, name: target.name });
        } else {
          results.push({
            kind: 'needsMigration',
            key: target.key,
            name: target.name,
            installedVersion: target.installedVersion,
            migrations: applicable,
          });
        }
      }

      const needsMigration = results.filter((r) => r.kind === 'needsMigration');

      if (options.check) {
        if (needsMigration.length > 0) {
          console.error(
            pc.red(
              `✖ ${needsMigration.length} component${needsMigration.length > 1 ? 's need' : ' needs'} migration. Run \`sanring migrate\` for details.`,
            ),
          );
          process.exit(1);
        }
        console.log(pc.green('✔ All installed components are up to date.\n'));
        return;
      }

      console.log(`\n${pc.bold('sanring migrate')}   (current CLI: v${currentCliVersion})\n`);

      let anyOutput = false;

      for (const result of results) {
        if (result.kind === 'notFound') {
          console.log(`  ${pc.yellow(`⚠ ${result.key}`)}  ${pc.dim('not found in registry, skipping')}`);
          anyOutput = true;
          continue;
        }
        if (result.kind === 'upToDate') continue;

        if (result.kind === 'needsMigration') {
          const { key, name, installedVersion, migrations } = result;
          const breakingCount = migrations.filter((m) => m.breaking).length;
          const breakingTag =
            breakingCount > 0
              ? ' ' + pc.bgRed(pc.white(pc.bold(' BREAKING ')))
              : '';

          console.log(
            `  ${pc.bold(key)}${breakingTag}  ${pc.dim(`installed: v${installedVersion} → current: v${currentCliVersion}`)}`,
          );

          let stepIndex = 1;
          for (const migration of migrations) {
            if (migration.breaking) {
              console.log(pc.red(`  ⚠ Breaking change (introduced after v${migration.fromVersion})`));
            }
            for (const step of migration.steps) {
              console.log(`    ${pc.dim(`${stepIndex}.`)} ${step}`);
              stepIndex++;
            }
          }
          console.log(
            `\n    ${pc.dim('→')} Run ${pc.cyan(`sanring update ${name}`)} to apply source file changes.\n`,
          );
          anyOutput = true;
        }
      }

      if (!anyOutput && needsMigration.length === 0) {
        const upToDate = results.filter((r) => r.kind === 'upToDate').length;
        console.log(
          pc.green(
            `✔ All ${upToDate} installed component${upToDate !== 1 ? 's are' : ' is'} up to date.\n`,
          ),
        );
      }
    },
  );
