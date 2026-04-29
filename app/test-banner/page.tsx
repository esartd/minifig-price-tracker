'use client';

import { useState, useEffect } from 'react';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';
  const host = window.location.hostname;
  if (host.startsWith('de.')) return 'de';
  if (host.startsWith('fr.')) return 'fr';
  if (host.startsWith('es.')) return 'es';
  return 'en';
}

export default function TestBanner() {
  const [show, setShow] = useState(true);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const t = getTranslations(locale).testBanner;
  const tBanner = getTranslations(locale).bannerCompare;

  if (!show) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <button
          onClick={() => setShow(true)}
          style={{
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {t.showBannerAgain}
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fafafa' }}>
      {/* Currency Banner */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10001,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        animation: 'slideDown 0.3s ease-out'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{
              fontSize: '15px',
              fontWeight: '500',
              margin: 0
            }}>
              🌍 {tBanner.currencyBanner}
            </p>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexShrink: 0
          }}>
            <button
              onClick={() => setShow(false)}
              style={{
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#667eea',
                background: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {tBanner.yesSEK}
            </button>
            <button
              onClick={() => setShow(false)}
              style={{
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              {tBanner.keepUSD}
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ paddingTop: '80px', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>{t.title}</h1>
          <p style={{ fontSize: '16px', color: '#737373', marginBottom: '24px' }}>
            {t.subtitle}
          </p>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{t.featuresTitle}</h2>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {t.features.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{t.userFlowTitle}</h2>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {t.userFlow.map((item: string, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
