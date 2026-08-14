'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app-lang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('app-lang', newLang);
    document.body.style.fontFamily = newLang === 'kh' ? 'var(--font-battambang)' : 'var(--font-poppins)';
  };

  useEffect(() => {
     document.body.style.fontFamily = lang === 'kh' ? 'var(--font-battambang)' : 'var(--font-poppins)';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
