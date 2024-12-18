import React from 'react';
import { Command, LanguageContextType } from '../types/terminal';

export const aboutCommand: Command = {
  name: 'about',
  description: 'Display information about me',
  execute: (args: string[], context: LanguageContextType) => (
    <div className="space-y-2">
      <p className="text-green-400">{context.t('about.title')}</p>
      <p>{context.t('about.description')}</p>
      <p>{context.t('about.experience')}</p>
      <div className="mt-4">
        <p className="text-yellow-400">Backend:</p>
        <p>PHP, Laravel, Node.js, Docker, Kubernetes</p>
      </div>
      <div className="mt-2">
        <p className="text-yellow-400">Frontend:</p>
        <p>React.js, TypeScript, Tailwind CSS</p>
      </div>
      <div className="mt-2">
        <p className="text-yellow-400">Cloud & DevOps:</p>
        <p>AWS, Google Cloud, GitHub Actions</p>
      </div>
    </div>
  ),
};