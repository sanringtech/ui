#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { diffCommand } from './commands/diff.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8')) as {
  version: string;
};

const program = new Command();

program
  .name('sanring')
  .description('Add Sanring UI components to your Angular project')
  .version(version);

program.addCommand(initCommand);
program.addCommand(listCommand);
program.addCommand(addCommand);
program.addCommand(diffCommand);

program.parse();
