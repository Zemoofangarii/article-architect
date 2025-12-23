import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Direction } from '@/types';
import { defaultLocale, getDirection, getTranslation, localeConfig } from '@/lib/i18n';

interface LocaleContextType {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localeConfig: typeof localeConfig;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale') as Locale;
      if (saved && (saved === 'en' || saved === 'ar')) {
        return saved;
      }
    }
    return defaultLocale;
  });

  const direction = getDirection(locale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string) => getTranslation(locale, key);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <LocaleContext.Provider value={{ locale, direction, setLocale, t, localeConfig }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
