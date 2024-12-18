import React, { createContext, useContext, useState } from 'react';
import { commandAliases } from '../config/commandAliases';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'welcome': 'Welcome to my interactive portfolio! Type "help" to see available commands.',
    'available.commands': 'Available commands:',
    'about.title': 'Full Stack Developer',
    'about.description': 'Passionate about building scalable and maintainable web applications.',
    'about.experience': 'Experienced in both frontend and backend development.',
    'contact.title': 'Contact Information:',
    'tools.title': 'Tools Information:',
    'skills.notFound': 'Category not found. Available categories:',
    'tools.notFound': 'Category not found. Available categories:',
    'command.not.found': 'Command not found. Type "help" for available commands.',
  },
  tr: {
    'welcome': 'İnteraktif portfolyoma hoş geldiniz! Mevcut komutları görmek için "yardim" yazın.',
    'available.commands': 'Kullanılabilir komutlar:',
    'about.title': 'Full Stack Geliştirici',
    'about.description': 'Ölçeklenebilir ve sürdürülebilir web uygulamaları geliştirmeye tutkulu.',
    'about.experience': 'Frontend ve backend geliştirmede deneyimli.',
    'contact.title': 'İletişim Bilgileri:',
    'tools.title': 'Kullanılan Araçlar:',
    'skills.notFound': 'Kategori bulunamadı. Mevcut kategoriler:',
    'tools.notFound': 'Kategori bulunamadı. Mevcut kategoriler:',
    'command.not.found': 'Komut bulunamadı. Mevcut komutları görmek için "yardim" yazın.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}