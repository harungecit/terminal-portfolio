import { ReactNode } from 'react';

export interface Command {
  name: string;
  description: string;
  usage?: string;
  execute: (args: string[], context?: any) => string | ReactNode;
}

export interface CommandHistory {
  command: string;
  output: string | ReactNode;
  timestamp: Date;
}

export interface LanguageContextType {
  language: 'en' | 'tr';
  setLanguage: (lang: 'en' | 'tr') => void;
  t: (key: string) => string;
}