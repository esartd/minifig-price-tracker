'use client';

import React, { createContext, useContext } from 'react';
import type { Locale } from '@/lib/i18n-subdomain';

interface TranslationContextType {
  locale: Locale;
  translations: Record<string, any>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({
  locale,
  translations,
  children
}: {
  locale: Locale;
  translations: Record<string, any>;
  children: React.ReactNode;
}) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters like {name}, {count}, etc.
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <TranslationContext.Provider value={{ locale, translations, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

// Hook for just the translation function
export function useT() {
  const { t } = useTranslation();
  return t;
}
