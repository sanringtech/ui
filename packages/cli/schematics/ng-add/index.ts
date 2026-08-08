import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

interface NgAddOptions {
  path?: string;
  skipConfirmation?: boolean;
  force?: boolean;
  registry?: string;
}

/**
 * `ng add @sanring/cli` shells out to the already-built `sanring init` CLI instead of
 * re-implementing its interactive prompts, network fetch, and dependency install as
 * Tree operations. This means it writes directly to disk rather than through the
 * schematics Tree, so `ng add --dry-run` won't preview its file writes.
 */
export function ngAdd(options: NgAddOptions): Rule {
  return (_tree: Tree, context: SchematicContext): void => {
    const cliEntry = join(__dirname, '..', '..', 'index.js');
    const args = ['init'];

    if (options.path) args.push('--path', options.path);
    if (options.skipConfirmation) args.push('--yes');
    if (options.force) args.push('--force');
    if (options.registry) args.push('--registry', options.registry);

    context.logger.info('Running sanring init…');
    const result = spawnSync(process.execPath, [cliEntry, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    if (result.status !== 0) {
      throw new Error(
        'sanring init failed. You can re-run it manually with: npx @sanring/cli@latest init',
      );
    }
  };
}
