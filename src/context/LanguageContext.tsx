import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (gujarati: string, english: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kps_lang');
    return (saved === 'en' || saved === 'gu') ? saved : 'gu';
  });

  useEffect(() => {
    localStorage.setItem('kps_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'gu' ? 'en' : 'gu'));
  };

  const t = (gujarati: string, english: string) => {
    return lang === 'gu' ? gujarati : english;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
