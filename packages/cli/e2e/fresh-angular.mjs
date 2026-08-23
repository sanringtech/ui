#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('../../../', import.meta.url));
const cliRoot = join(workspaceRoot, 'packages/cli');
const angularCliVersion = process.env.SANRING_E2E_ANGULAR_CLI_VERSION ?? '22.0.1';
const keepTemp = process.env.SANRING_E2E_KEEP_TEMP === '1';
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const tempRoot = mkdtempSync(join(tmpdir(), 'sanring-cli-fresh-angular-'));
const packageDir = join(tempRoot, 'package');
const projectDir = join(tempRoot, 'app');

const childEnv = { ...process.env, CI: 'true', NG_CLI_ANALYTICS: 'false', NO_COLOR: '1' };
delete childEnv.FORCE_COLOR;

function run(label, command, args, cwd, options = {}) {
  console.log(`\n[e2e] ${label}`);
  console.log(`[e2e] cwd: ${cwd}`);
  console.log(`[e2e] command: ${command} ${args.join(' ')}`);

  const result = spawnSync(command, args, {
    cwd,
    env: childEnv,
    stdio: options.quiet ? 'pipe' : 'inherit',
    encoding: options.quiet ? 'utf-8' : undefined,
    shell: false,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (options.quiet) {
      if (result.stdout) console.error(result.stdout);
      if (result.stderr) console.error(result.stderr);
    }
    throw new Error(`${label} failed with exit code ${result.status ?? 'unknown'}`);
  }
}

function assertFile(relativePath) {
  const absolutePath = join(projectDir, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Expected generated file is missing: ${relativePath}`);
  }
}

let passed = false;

try {
  mkdirSync(packageDir, { recursive: true });

  run('Build the CLI and bundled registry', pnpm, ['run', 'build'], cliRoot);
  run(
    'Pack the installable CLI tarball',
    pnpm,
    ['pack', '--pack-destination', packageDir],
    cliRoot,
    { quiet: true },
  );

  const tarballs = readdirSync(packageDir).filter((file) => file.endsWith('.tgz'));
  if (tarballs.length !== 1) {
    throw new Error(`Expected one packed CLI tarball, found ${tarballs.length}`);
  }
  const cliTarball = join(packageDir, tarballs[0]);

  run(
    `Scaffold a fresh Angular ${angularCliVersion} application`,
    pnpm,
    [
      `--package=@angular/cli@${angularCliVersion}`,
      'dlx',
      'ng',
      'new',
      'sanring-e2e-app',
      '--directory',
      'app',
      '--defaults',
      '--skip-git',
      '--skip-tests',
      '--skip-install',
      '--package-manager',
      'npm',
      '--style',
      'css',
      '--routing=false',
      '--ssr=false',
      '--ai-config',
      'none',
    ],
    tempRoot,
  );

  run('Install the fresh application dependencies', npm, ['install'], projectDir);
  run(
    'Install the locally packed @sanring/cli',
    npm,
    ['install', '--save-dev', cliTarball],
    projectDir,
  );
  run(
    'Initialize Sanring in the fresh application',
    npx,
    ['--no-install', 'sanring', 'init', '--yes'],
    projectDir,
  );
  run(
    'Install Button from the CLI bundled registry',
    npx,
    ['--no-install', 'sanring', 'add', 'button', '--yes'],
    projectDir,
  );

  for (const file of [
    'sanring.config.json',
    'src/sanring-theme.css',
    'src/app/components/ui/button/button.directive.ts',
    'src/app/components/ui/button/index.ts',
    'src/app/components/ui/shared/utils.ts',
    'src/app/components/ui/shared/component-styles.ts',
  ]) {
    assertFile(file);
  }

  const config = JSON.parse(readFileSync(join(projectDir, 'sanring.config.json'), 'utf-8'));
  if (config.componentPath !== 'src/app/components/ui') {
    throw new Error(`Unexpected componentPath in sanring.config.json: ${config.componentPath}`);
  }
  if (config.installedVersions?.button === undefined) {
    throw new Error('sanring.config.json did not record the installed Button version');
  }

  const projectPackage = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf-8'));
  if (projectPackage.dependencies?.['@angular/cdk'] === undefined) {
    throw new Error(
      'sanring add button did not install the @angular/cdk dependency required by shared/utils.ts',
    );
  }

  writeFileSync(
    join(projectDir, 'src/app/app.ts'),
    `import { Component } from '@angular/core';
import { ButtonDirective } from './components/ui/button';

@Component({
  selector: 'app-root',
  imports: [ButtonDirective],
  template: \`<main><button sanringBtn type="button">Sanring is ready</button></main>\`,
  styles: [\`:host { display: block; padding: 2rem; }\`],
})
export class App {}
`,
    'utf-8',
  );

  run(
    'Compile the installed registry source in a production Angular build',
    npx,
    ['--no-install', 'ng', 'build', '--configuration', 'production'],
    projectDir,
  );

  passed = true;
  console.log(
    '\n[e2e] PASS: packed CLI → fresh Angular app → init → add button → production build',
  );
} catch (error) {
  console.error(`\n[e2e] FAIL: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  if (keepTemp || !passed) {
    console.log(`[e2e] Temporary project preserved at: ${tempRoot}`);
  } else {
    rmSync(tempRoot, { recursive: true, force: true });
    console.log(`[e2e] Removed temporary project: ${tempRoot}`);
  }
}
