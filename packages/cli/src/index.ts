#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import pc from 'picocolors';
import { addCommand } from './commands/add.js';
import { buildCommand } from './commands/build.js';
import { diffCommand } from './commands/diff.js';
import { doctorCommand } from './commands/doctor.js';
import { infoCommand } from './commands/info.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { mcpCommand } from './commands/mcp.js';
import { removeCommand } from './commands/remove.js';
import { searchCommand } from './commands/search.js';
import { migrateCommand } from './commands/migrate.js';
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

${pc.bold('Command groups')}
  ${pc.dim('Install    ')} init, add, remove
  ${pc.dim('Explore    ')} info, list, search
  ${pc.dim('Maintain   ')} diff, migrate, update, doctor
  ${pc.dim('Publish    ')} build   ${pc.dim('(for registry authors)')}
  ${pc.dim('Agent      ')} mcp     ${pc.dim('(for AI coding agents)')}

${pc.dim('No installation required — components are copied into your project as source,')}
${pc.dim('not installed as an npm package. Docs: https://ui.sanring.dev')}
`,
  );

// Registration order matches the "Command groups" summary above and drives
// the order commands are listed in the auto-generated help output.
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(removeCommand);
program.addCommand(infoCommand);
program.addCommand(listCommand);
program.addCommand(searchCommand);
program.addCommand(diffCommand);
program.addCommand(migrateCommand);
program.addCommand(updateCommand);
program.addCommand(doctorCommand);
program.addCommand(buildCommand);
program.addCommand(mcpCommand);

program.parse();
