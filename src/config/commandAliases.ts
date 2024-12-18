export const commandAliases = {
  en: {
    help: ['help'],
    about: ['about'],
    skills: ['skills'],
    contact: ['contact'],
    clear: ['clear'],
    lang: ['lang'],
  },
  tr: {
    help: ['yardim', 'help'],
    about: ['hakkimda', 'about'],
    skills: ['yetenekler', 'skills'],
    contact: ['iletisim', 'contact'],
    clear: ['temizle', 'clear'],
    lang: ['dil', 'lang'],
  },
} as const;

export type CommandAlias = keyof typeof commandAliases.en;