import React from 'react';
import { Command, LanguageContextType } from '../types/terminal';

export const languageCommand: Command = {
  name: 'lang',
  description: 'Change language (en/tr)',
  usage: '<en|tr>',
  execute: (args: string[], context: LanguageContextType) => {
    const lang = args[0]?.toLowerCase();

    if (lang !== 'en' && lang !== 'tr') {
      return (
        <div className="text-red-400">
          Invalid language. Available options: en, tr
        </div>
      );
    }

    context.setLanguage(lang as 'en' | 'tr');
    return (
      <div className="text-green-400">
        {lang === 'en' ? 'Language changed to English' : 'Dil Türkçe olarak değiştirildi'}
      </div>
    );
  },
};