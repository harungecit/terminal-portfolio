import React from 'react';
import { Command, LanguageContextType } from '../types/terminal';

export const contactCommand: Command = {
  name: 'contact',
  description: 'Display contact information',
  execute: (args: string[], context: LanguageContextType) => (
    <div className="space-y-2">
      <p className="text-green-400">{context.t('contact.title')}</p>
      <p>
        Email: <span className="text-blue-400">contact@example.com</span>
      </p>
      <p>
        GitHub: <span className="text-blue-400">github.com/username</span>
      </p>
      <p>
        LinkedIn: <span className="text-blue-400">linkedin.com/in/username</span>
      </p>
    </div>
  ),
};