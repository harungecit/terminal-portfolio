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
        <p className="text-yellow-400">Backend Development:</p>
        <p>PHP, Laravel, Zend Framework, Node.js</p>
      </div>
      <div className="mt-2">
        <p className="text-yellow-400">Frontend:</p>
        <p>React.js, JQuery, TypeScript, Tailwind CSS, Bootstrap CSS</p>
      </div>
      <div className="mt-2">
        <p className="text-yellow-400">Cloud & DevOps:</p>
        <p>AWS, Google Cloud, Git, GitHub, GitHub Actions, Docker, Kubernetes</p>
      </div>
    <div className="mt-2">
      <p className="text-yellow-400">AI Tools:</p>
      <p>GPT-4, OpenAI, ChatGPT, Tabnine, Claude</p>
    </div>
    </div>
  ),
};