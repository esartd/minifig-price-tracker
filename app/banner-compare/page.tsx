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

export default function BannerCompare() {
  const [option, setOption] = useState<'above' | 'below'>('above');
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const t = getTranslations(locale).bannerCompare;

  const Banner = ({ style }: { style: React.CSSProperties }) => (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      ...style
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
            🌍 {t.currencyBanner}
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexShrink: 0
        }}>
          <button
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#667eea',
              background: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t.yesSEK}
          </button>
          <button
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t.keepUSD}
          </button>
        </div>
      </div>
    </div>
  );

  const FakeHeader = () => (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e5e5e5',
      padding: '16px 24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#171717'
        }}>
          🧱 {t.logoText}
        </div>
        <nav style={{
          display: 'flex',
          gap: '24px',
          fontSize: '15px',
          color: '#525252'
        }}>
          <span>{t.navSearch}</span>
          <span>{t.navCollection}</span>
          <span>{t.navInventory}</span>
          <span>{t.navAccount}</span>
        </nav>
      </div>
    </header>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Control Panel */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20000,
        background: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={() => setOption('above')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            color: option === 'above' ? 'white' : '#667eea',
            background: option === 'above' ? '#667eea' : 'white',
            border: `2px solid #667eea`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {t.aboveNavigation}
        </button>
        <button
          onClick={() => setOption('below')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            color: option === 'below' ? 'white' : '#667eea',
            background: option === 'below' ? '#667eea' : 'white',
            border: `2px solid #667eea`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {t.belowNavigation}
        </button>
      </div>

      {/* Option 1: Banner Above Navigation */}
      {option === 'above' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10001 }}>
          <Banner style={{}} />
          <FakeHeader />
        </div>
      )}

      {/* Option 2: Banner Below Navigation */}
      {option === 'below' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10001 }}>
          <FakeHeader />
          <Banner style={{}} />
        </div>
      )}

      {/* Content */}
      <div style={{ paddingTop: option === 'above' ? '130px' : '130px', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
            {t.title}
          </h1>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              {option === 'above' ? `✅ ${t.aboveNavigation}` : `✅ ${t.belowNavigation}`}
            </h2>

            {option === 'above' ? (
              <>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>{t.usedBy}</strong> {t.usedByAbove}
                </p>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>{t.pros}</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '12px' }}>
                  {t.prosAbove.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>{t.cons}</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  {t.consAbove.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>{t.usedBy}</strong> {t.usedByBelow}
                </p>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>{t.pros}</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '12px' }}>
                  {t.prosBelow.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>{t.cons}</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  {t.consBelow.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </>
            )}
          </div>

          <div style={{ background: '#fff7ed', border: '2px solid #fdba74', padding: '20px', borderRadius: '12px' }}>
            <p style={{ fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
              <strong>💡 {t.recommendation}</strong> {t.recommendationText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
