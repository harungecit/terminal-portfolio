import { Command } from '../types/terminal';

export const clearCommand: Command = {
  name: 'clear',
  description: 'Clear the terminal',
  execute: () => '',
};