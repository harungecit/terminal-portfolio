import { commandAliases } from '../config/commandAliases';
import type { CommandAlias } from '../config/commandAliases';

export function resolveCommandAlias(command: string, language: 'en' | 'tr'): CommandAlias | null {
  const aliases = commandAliases[language];
  
  for (const [baseCommand, commandList] of Object.entries(aliases)) {
    if (commandList.includes(command.toLowerCase())) {
      return baseCommand as CommandAlias;
    }
  }
  
  return null;
}