#!/usr/bin/env node
import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { diffCommand } from './commands/diff.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';

const program = new Command();

program
  .name('sanring')
  .description('Add Sanring UI components to your Angular project')
  .version('0.0.1');

program.addCommand(initCommand);
program.addCommand(listCommand);
program.addCommand(addCommand);
program.addCommand(diffCommand);

program.parse();
