#!/usr/bin/env node
import { Command } from 'commander';
import { addCommand } from './commands/add.js';

const program = new Command();

program
  .name('sanring')
  .description('Add Sanring UI components to your Angular project')
  .version('0.0.1');

program.addCommand(addCommand);

program.parse();
