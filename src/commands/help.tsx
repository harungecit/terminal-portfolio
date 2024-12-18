import React from 'react';
import { Command, LanguageContextType } from '../types/terminal';
import { commands } from './index';
import { commandAliases } from '../config/commandAliases';

export const helpCommand: Command = {
  name: 'help',
  description: 'List all available commands',
  execute: (args: string[], context: LanguageContextType) => {
    const aliases = commandAliases[context.language];
    
    return (
      <div className="space-y-2">
        <p className="text-green-400">{context.t('available.commands')}</p>
        {Object.entries(commands).map(([cmdName, cmd]) => (
          <div key={cmdName} className="pl-4">
            <span className="text-yellow-400">
              {aliases[cmdName as keyof typeof aliases].join(', ')}
            </span>
            {cmd.usage && <span className="text-gray-400"> {cmd.usage}</span>}
            <span className="text-gray-400"> - {cmd.description}</span>
          </div>
        ))}
      </div>
    );
  },
};