import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pc from 'picocolors';
import { createRegistryIndex, fetchRegistry } from '../registry.js';
import { findRegistryReferenceIssues } from '../registry-integrity.js';
import {
  getInstalledPackageSpecs,
  hashContent,
  isAngularProject,
  migrateInstalledVersionsKeys,
  readConfig,
  resolveComponentBasePath,
  resolveRegistrySource,
  satisfiesMinimumPackageSpec,
  writeConfig,
} from '../utils.js';
import { collectPeerDeps, parseComponentRef } from './add.js';
import { THEME_FILE_PATH } from './init.js';

const MIN_NODE_MAJOR = 18;

export const doctorCommand = new Command('doctor')
  .description('Check your environment and project config for common issues')
  .option('-p, --path <path>', 'component path relative to cwd')
  .option('--offline', 'skip registry connectivity check', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .option('--json', 'output machine-readable check results', false)
  .option('--fix', 'apply safe repairs such as hash cleanup and alias migration', false)
  .action(async (options: { path?: string; offline: boolean; registry?: string; json: boolean; fix: boolean }) => {
    const cwd = process.cwd();
    let errors = 0;
    let warnings = 0;
    const checks: Array<{ status: 'ok' | 'error' | 'warning' | 'note'; message: string }> = [];

    const ok = (msg: string) => { checks.push({ status: 'ok', message: msg }); if (!options.json) console.log(`  ${pc.green('✔')} ${msg}`); };
    const fail = (msg: string) => { checks.push({ status: 'error', message: msg }); if (!options.json) console.log(`  ${pc.red('✖')} ${msg}`); errors++; };
    const warn = (msg: string) => { checks.push({ status: 'warning', message: msg }); if (!options.json) console.log(`  ${pc.yellow('⚠')} ${msg}`); warnings++; };
    const note = (msg: string) => { checks.push({ status: 'note', message: msg }); if (!options.json) console.log(`  ${pc.dim('ℹ')} ${msg}`); };

    if (!options.json) console.log(pc.cyan('\nSanring UI — environment check\n'));

    // ── System ────────────────────────────────────────────────────────────────
    if (!options.json) console.log(pc.bold('System'));

    const nodeVersion = process.version;
    const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0], 10);
    if (nodeMajor >= MIN_NODE_MAJOR) {
      ok(`Node.js ${nodeVersion}`);
    } else {
      fail(`Node.js ${nodeVersion}  — v${MIN_NODE_MAJOR}+ required`);
    }

    if (isAngularProject(cwd)) {
      ok('Angular project detected');
    } else {
      fail(`No angular.json found — run from the root of an Angular project`);
    }

    // ── Config ────────────────────────────────────────────────────────────────
    if (!options.json) console.log(pc.bold('\nConfig'));

    const config = readConfig(cwd);
    if (config) {
      ok(`sanring.config.json  ${pc.dim(`componentPath: ${config.componentPath}`)}`);
      const legacyKeys = Object.keys(config.installedVersions ?? {}).filter((key) => !key.includes(':'));
      if (legacyKeys.length > 0) {
        const message = `${legacyKeys.length} legacy installedVersions key${legacyKeys.length > 1 ? 's' : ''}`;
        if (config.defaultRegistry) warn(`${message} can be migrated with --fix`);
        else note(`${message}; set defaultRegistry before migrating`);
      }
    } else {
      warn(`sanring.config.json not found — run ${pc.white('sanring init')} to initialize`);
    }

    if (existsSync(join(cwd, THEME_FILE_PATH))) {
      ok(`Theme  ${pc.dim(THEME_FILE_PATH)}`);
    } else {
      warn(`Theme not found at ${pc.white(THEME_FILE_PATH)} — run ${pc.white('sanring init')}`);
    }

    // ── Installed files ───────────────────────────────────────────────────────
    const componentBasePath = resolveComponentBasePath(cwd, options.path, config);
    const installedHashes = config?.installedHashes ?? {};
    const hashEntries = Object.entries(installedHashes);
    const orphanedHashes: string[] = [];
    const missingHashes: Array<{ label: string; filePath: string }> = [];

    if (hashEntries.length > 0) {
      if (!options.json) console.log(pc.bold(`\nInstalled files  ${pc.dim(`(${hashEntries.length} tracked)`)}`));

      const customized: string[] = [];
      const orphaned: string[] = [];
      let untouched = 0;

      for (const [label, recordedHash] of hashEntries) {
        // Theme lives at cwd-root; everything else under componentBasePath.
        const filePath =
          label === THEME_FILE_PATH ? join(cwd, label) : join(componentBasePath, label);

        if (!existsSync(filePath)) {
          orphaned.push(label);
          orphanedHashes.push(label);
        } else {
          const current = hashContent(readFileSync(filePath, 'utf-8'));
          if (current === recordedHash) untouched++;
          else customized.push(label);
        }
      }

      if (untouched > 0) ok(`${untouched} file${untouched > 1 ? 's' : ''} untouched since install`);

      if (customized.length > 0) {
        note(`${customized.length} file${customized.length > 1 ? 's' : ''} customized — local edits detected (expected):`);
        if (!options.json) for (const label of customized) console.log(pc.dim(`      ${label}`));
      }

      if (orphaned.length > 0) {
        warn(
          `${orphaned.length} orphaned hash entr${orphaned.length > 1 ? 'ies' : 'y'} — file${orphaned.length > 1 ? 's' : ''} deleted without ${pc.white('sanring remove')}:`,
        );
        if (!options.json) {
          for (const label of orphaned) console.log(pc.dim(`      ${label}`));
          console.log(pc.dim(`      Run ${pc.white('sanring update')} to reinstall or remove the entries from sanring.config.json manually.`));
        }
      }
    }

    // ── Registry ──────────────────────────────────────────────────────────────
    if (!options.offline) {
      if (!options.json) console.log(pc.bold('\nRegistry'));
      try {
        const registry = await fetchRegistry(resolveRegistrySource(undefined, config, options.registry));
        const index = createRegistryIndex(registry);
        ok('Reachable');
        // Internal referential integrity of the fetched registry.json itself
        // (dangling componentDeps/sharedDeps/group references, unparseable
        // peer dependency versions) — distinct from the checks below, which
        // compare this project's installed state against the registry.
        const integrityIssues = findRegistryReferenceIssues(registry);
        for (const issue of integrityIssues) warn(`Registry integrity: ${issue.message}`);
        if (config?.defaultRegistry && !config.registries?.[config.defaultRegistry]) {
          warn(`defaultRegistry "${config.defaultRegistry}" is missing from registries`);
        }
        for (const key of Object.keys(config?.installedVersions ?? {})) {
          const name = parseComponentRef(key).name;
          if (!index.componentsByName.has(name)) warn(`installedVersions target not found in registry: ${key}`);
        }
        for (const label of Object.keys(config?.installedHashes ?? {})) {
          if (label === THEME_FILE_PATH) continue;
          if (label.startsWith('shared/')) {
            if (!index.sharedByName || !registry.shared.some((shared) => shared.file === label)) {
              warn(`installed hash points to a shared file no longer present in registry: ${label}`);
            }
            continue;
          }
          const slash = label.indexOf('/');
          const name = slash === -1 ? label : label.slice(0, slash);
          const component = index.componentsByName.get(name);
          if (!component || !component.files.includes(label)) {
            warn(`installed hash points to a file no longer present in registry: ${label}`);
          }
        }
        const installedNames = new Set(
          registry.components
            .filter((component) => existsSync(join(componentBasePath, component.name)))
            .map((component) => component.name),
        );
        for (const key of Object.keys(config?.installedVersions ?? {})) installedNames.add(parseComponentRef(key).name);
        const sharedDestDir = config?.sharedPath
          ? resolve(cwd, config.sharedPath)
          : join(componentBasePath, 'shared');
        if (existsSync(join(cwd, THEME_FILE_PATH)) && !installedHashes[THEME_FILE_PATH]) {
          missingHashes.push({ label: THEME_FILE_PATH, filePath: join(cwd, THEME_FILE_PATH) });
        }
        for (const name of installedNames) {
          const component = index.componentsByName.get(name);
          if (!component) continue;
          for (const file of component.files) {
            const relativeFile = file.startsWith(`${name}/`) ? file.slice(name.length + 1) : file.split('/').pop()!;
            const label = `${name}/${relativeFile}`;
            const filePath = join(componentBasePath, name, relativeFile);
            if (existsSync(filePath) && !installedHashes[label]) missingHashes.push({ label, filePath });
          }
          for (const depName of component.sharedDeps ?? []) {
            const shared = index.sharedByName.get(depName);
            if (!shared) continue;
            const relativeFile = shared.file.startsWith('shared/') ? shared.file.slice('shared/'.length) : shared.file.split('/').pop()!;
            const label = `shared/${relativeFile}`;
            const filePath = join(sharedDestDir, relativeFile);
            if (existsSync(filePath) && !installedHashes[label]) missingHashes.push({ label, filePath });
          }
        }
        if (missingHashes.length > 0) {
          note(`${missingHashes.length} installed file${missingHashes.length === 1 ? '' : 's'} have no baseline hash; run --fix to backfill safely`);
        }
        const peerDeps = collectPeerDeps(
          [...installedNames].flatMap((name) => {
            const component = index.componentsByName.get(name);
            return component ? [component] : [];
          }),
          index,
        );
        const installedPackages = getInstalledPackageSpecs(cwd);
        for (const [pkg, version] of Object.entries(peerDeps)) {
          const installed = installedPackages.get(pkg);
          if (!installed) warn(`Missing peer dependency: ${pkg}@${version}`);
          else if (!satisfiesMinimumPackageSpec(installed, version)) warn(`Outdated peer dependency: ${pkg} ${installed} (requires ${version})`);
        }
      } catch {
        fail(`Unreachable — check your network or use ${pc.white('--offline')} to skip`);
      }
    }

    if (options.fix && config) {
      const migrated = migrateInstalledVersionsKeys(config);
      const cleanedHashes = { ...migrated.installedHashes };
      for (const label of orphanedHashes) delete cleanedHashes[label];
      for (const { label, filePath } of missingHashes) cleanedHashes[label] = hashContent(readFileSync(filePath, 'utf-8'));
      const changed = orphanedHashes.length > 0 || missingHashes.length > 0 || migrated !== config;
      if (changed) {
        writeConfig(cwd, { ...migrated, installedHashes: cleanedHashes });
        note(`Applied safe config repairs (--fix): ${missingHashes.length} hash${missingHashes.length === 1 ? '' : 'es'} backfilled, ${orphanedHashes.length} orphaned hash${orphanedHashes.length === 1 ? '' : 'es'} removed, legacy keys migrated.`);
      } else {
        note('No safe config repairs were needed (--fix).');
      }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    if (options.json) {
      console.log(JSON.stringify({ ok: errors === 0, errors, warnings, checks }, null, 2));
      if (errors > 0) process.exit(1);
      return;
    }

    console.log('');
    if (errors === 0 && warnings === 0) {
      console.log(pc.green('✔ All checks passed.\n'));
    } else {
      const parts: string[] = [];
      if (errors > 0) parts.push(pc.red(`${errors} error${errors > 1 ? 's' : ''}`));
      if (warnings > 0) parts.push(pc.yellow(`${warnings} warning${warnings > 1 ? 's' : ''}`));
      console.log(`${parts.join(', ')}\n`);
      if (errors > 0) process.exit(1);
    }
  });
