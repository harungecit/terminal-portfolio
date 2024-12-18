import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useLanguage } from '../../contexts/LanguageContext';

export default function WelcomeMessage() {
  const { t } = useLanguage();
  
  return (
    <div className="mb-4">
      <Typewriter
        words={[t('welcome')]}
        cursor
        cursorStyle="_"
        typeSpeed={70}
      />
    </div>
  );
}