'use client';

import { useTranslation } from './TranslationProvider';
import { localeNames, getLocaleUrl, type Locale } from '@/lib/i18n-subdomain';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    // Get current pathname
    const pathname = window.location.pathname;
    // Redirect to same path on new subdomain
    window.location.href = getLocaleUrl(newLocale, pathname);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: '#525252',
          background: 'transparent',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#d4d4d4';
          e.currentTarget.style.background = '#fafafa';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e5e5';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{locale.toUpperCase()}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '160px',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {Object.entries(localeNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as Locale)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: 'var(--text-sm)',
                fontWeight: locale === code ? '600' : '500',
                color: locale === code ? '#3b82f6' : '#171717',
                background: locale === code ? '#f0f9ff' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                if (locale !== code) {
                  e.currentTarget.style.background = '#fafafa';
                }
              }}
              onMouseLeave={(e) => {
                if (locale !== code) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{name}</span>
              {locale === code && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.5 4.5L6 12L2.5 8.5"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
