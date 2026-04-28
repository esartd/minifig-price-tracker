'use client';

import { useState } from 'react';

export default function TestBanner() {
  const [show, setShow] = useState(true);

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
          Show Banner Again
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
              🌍 We detected you're in Sweden. Show prices in SEK?
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
              Yes, use SEK
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
              Keep USD
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ paddingTop: '80px', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Currency Banner Preview</h1>
          <p style={{ fontSize: '16px', color: '#737373', marginBottom: '24px' }}>
            This is what new users will see when they first visit FigTracker from a non-US country.
          </p>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Features:</h2>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Auto-detects country from browser locale</li>
              <li>Shows only for non-USD currencies</li>
              <li>Dismissible - never shows again after choice</li>
              <li>Saves to localStorage (anonymous) or database (logged in)</li>
              <li>Smooth slide-down animation</li>
              <li>Purple gradient design matches FigTracker branding</li>
            </ul>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>User Flow:</h2>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>First visit from Sweden</strong> → Banner appears</li>
              <li><strong>Click "Yes, use SEK"</strong> → Currency set to SEK, page reloads, all prices fetched in SEK</li>
              <li><strong>Click "Keep USD"</strong> → Banner dismissed forever, uses USD</li>
              <li><strong>Future visits</strong> → Banner never shows again (preference remembered)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
