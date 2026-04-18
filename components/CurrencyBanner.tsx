'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SUPPORTED_CURRENCIES } from '@/lib/currency-config';

export default function CurrencyBanner() {
  const { data: session, update } = useSession();
  const [show, setShow] = useState(false);
  const [detectedCurrency, setDetectedCurrency] = useState<string | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  useEffect(() => {
    // Don't show if user already has a currency preference
    if (session?.user?.preferredCurrency) {
      return;
    }

    // Check localStorage for dismissed banner
    const dismissed = localStorage.getItem('currencyBannerDismissed');
    if (dismissed === 'true') {
      return;
    }

    // Detect currency from browser locale
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1] || 'US';

    // Find matching currency
    const currency = SUPPORTED_CURRENCIES.find(c => c.countryCode === countryCode);

    if (currency && currency.code !== 'USD') {
      setDetectedCurrency(currency.code);
      setDetectedCountry(currency.name);
      setShow(true);
    }
  }, [session]);

  const handleAccept = async () => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === detectedCurrency);
    if (!currency) return;

    if (session?.user) {
      // Logged in - save to database
      try {
        const response = await fetch('/api/auth/update-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preferredCurrency: currency.code,
            preferredCountryCode: currency.countryCode,
            preferredRegion: currency.region,
            currencySymbol: currency.symbol,
            locale: currency.locale
          })
        });

        if (response.ok) {
          await update({
            preferredCurrency: currency.code,
            preferredCountryCode: currency.countryCode,
            preferredRegion: currency.region,
            currencySymbol: currency.symbol,
            locale: currency.locale
          });
          setShow(false);
          window.location.reload(); // Refresh to fetch prices in new currency
        }
      } catch (error) {
        console.error('Failed to update currency:', error);
      }
    } else {
      // Anonymous - save to localStorage
      localStorage.setItem('preferredCurrency', currency.code);
      localStorage.setItem('preferredCountryCode', currency.countryCode);
      localStorage.setItem('preferredRegion', currency.region);
      setShow(false);
      window.location.reload();
    }
  };

  const handleKeepUSD = () => {
    localStorage.setItem('currencyBannerDismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
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
            🌍 We detected you're in {detectedCountry}. Show prices in {detectedCurrency}?
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexShrink: 0
        }}>
          <button
            onClick={handleAccept}
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
            Yes, use {detectedCurrency}
          </button>
          <button
            onClick={handleKeepUSD}
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
            Keep USD
          </button>
        </div>
      </div>
    </div>
  );
}
