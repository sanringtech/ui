#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import pc from 'picocolors';
import { addCommand } from './commands/add.js';
import { diffCommand } from './commands/diff.js';
import { infoCommand } from './commands/info.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { removeCommand } from './commands/remove.js';
import { updateCommand } from './commands/update.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8')) as {
  version: string;
};

const program = new Command();

program
  .name('sanring')
  .description('Add Sanring UI components to your Angular project')
  .version(version)
  .addHelpText(
    'after',
    `
${pc.bold('Quick start')}
  $ npx @sanring/cli@latest init
  $ npx @sanring/cli@latest add button

${pc.dim('No installation required — components are copied into your project as source,')}
${pc.dim('not installed as an npm package. Docs: https://ui.sanring.dev')}
`,
  );

program.addCommand(initCommand);
program.addCommand(listCommand);
program.addCommand(infoCommand);
program.addCommand(addCommand);
program.addCommand(removeCommand);
program.addCommand(diffCommand);
program.addCommand(updateCommand);

program.parse();
