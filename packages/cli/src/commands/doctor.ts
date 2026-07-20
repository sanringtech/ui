import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pc from 'picocolors';
import { fetchRegistry } from '../registry.js';
import { hashContent, isAngularProject, readConfig } from '../utils.js';
import { THEME_FILE_PATH } from './init.js';

const DEFAULT_PATH = 'src/app/components/ui';
const MIN_NODE_MAJOR = 18;

export const doctorCommand = new Command('doctor')
  .description('Check your environment and project config for common issues')
  .option('-p, --path <path>', 'component path relative to cwd')
  .option('--offline', 'skip registry connectivity check', false)
  .option('--registry <source>', 'custom registry (URL or local path)')
  .action(async (options: { path?: string; offline: boolean; registry?: string }) => {
    const cwd = process.cwd();
    let errors = 0;
    let warnings = 0;

    const ok = (msg: string) => console.log(`  ${pc.green('✔')} ${msg}`);
    const fail = (msg: string) => { console.log(`  ${pc.red('✖')} ${msg}`); errors++; };
    const warn = (msg: string) => { console.log(`  ${pc.yellow('⚠')} ${msg}`); warnings++; };
    const note = (msg: string) => console.log(`  ${pc.dim('ℹ')} ${msg}`);

    console.log(pc.cyan('\nSanring UI — environment check\n'));

    // ── System ────────────────────────────────────────────────────────────────
    console.log(pc.bold('System'));

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
    console.log(pc.bold('\nConfig'));

    const config = readConfig(cwd);
    if (config) {
      ok(`sanring.config.json  ${pc.dim(`componentPath: ${config.componentPath}`)}`);
    } else {
      warn(`sanring.config.json not found — run ${pc.white('sanring init')} to initialize`);
    }

    if (existsSync(join(cwd, THEME_FILE_PATH))) {
      ok(`Theme  ${pc.dim(THEME_FILE_PATH)}`);
    } else {
      warn(`Theme not found at ${pc.white(THEME_FILE_PATH)} — run ${pc.white('sanring init')}`);
    }

    // ── Installed files ───────────────────────────────────────────────────────
    const componentBasePath = resolve(cwd, options.path ?? config?.componentPath ?? DEFAULT_PATH);
    const installedHashes = config?.installedHashes ?? {};
    const hashEntries = Object.entries(installedHashes);

    if (hashEntries.length > 0) {
      console.log(pc.bold(`\nInstalled files  ${pc.dim(`(${hashEntries.length} tracked)`)}`));

      const customized: string[] = [];
      const orphaned: string[] = [];
      let untouched = 0;

      for (const [label, recordedHash] of hashEntries) {
        // Theme lives at cwd-root; everything else under componentBasePath.
        const filePath =
          label === THEME_FILE_PATH ? join(cwd, label) : join(componentBasePath, label);

        if (!existsSync(filePath)) {
          orphaned.push(label);
        } else {
          const current = hashContent(readFileSync(filePath, 'utf-8'));
          if (current === recordedHash) untouched++;
          else customized.push(label);
        }
      }

      if (untouched > 0) ok(`${untouched} file${untouched > 1 ? 's' : ''} untouched since install`);

      if (customized.length > 0) {
        note(`${customized.length} file${customized.length > 1 ? 's' : ''} customized — local edits detected (expected):`);
        for (const label of customized) console.log(pc.dim(`      ${label}`));
      }

      if (orphaned.length > 0) {
        warn(
          `${orphaned.length} orphaned hash entr${orphaned.length > 1 ? 'ies' : 'y'} — file${orphaned.length > 1 ? 's' : ''} deleted without ${pc.white('sanring remove')}:`,
        );
        for (const label of orphaned) console.log(pc.dim(`      ${label}`));
        console.log(
          pc.dim(`      Run ${pc.white('sanring update')} to reinstall or remove the entries from sanring.config.json manually.`),
        );
      }
    }

    // ── Registry ──────────────────────────────────────────────────────────────
    if (!options.offline) {
      console.log(pc.bold('\nRegistry'));
      try {
        await fetchRegistry(options.registry);
        ok('Reachable');
      } catch {
        fail(`Unreachable — check your network or use ${pc.white('--offline')} to skip`);
      }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
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
