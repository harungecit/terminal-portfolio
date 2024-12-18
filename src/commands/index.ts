import { Command } from '../types/terminal';
import { helpCommand } from './help';
import { aboutCommand } from './about';
import { skillsCommand } from './skills';
import { toolsCommand } from './tools';
import { contactCommand } from './contact';
import { clearCommand } from './clear';
import { languageCommand } from './language';

export const commands: Record<string, Command> = {
  help: helpCommand,
  about: aboutCommand,
  skills: skillsCommand,
  tools: toolsCommand,
  contact: contactCommand,
  clear: clearCommand,
  lang: languageCommand,
};