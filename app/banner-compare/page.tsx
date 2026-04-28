'use client';

import { useState } from 'react';

export default function BannerCompare() {
  const [option, setOption] = useState<'above' | 'below'>('above');

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
            🌍 We detected you're in Sweden. Show prices in SEK?
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
            Yes, use SEK
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
            Keep USD
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
          🧱 FigTracker
        </div>
        <nav style={{
          display: 'flex',
          gap: '24px',
          fontSize: '15px',
          color: '#525252'
        }}>
          <span>Search</span>
          <span>Collection</span>
          <span>Inventory</span>
          <span>Account</span>
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
          Banner Above Navigation
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
          Banner Below Navigation
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
            Banner Position Comparison
          </h1>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              {option === 'above' ? '✅ Banner Above Navigation (Most Common)' : '✅ Banner Below Navigation'}
            </h2>

            {option === 'above' ? (
              <>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>Used by:</strong> GitHub, Stripe, Amazon, most cookie consent banners
                </p>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>Pros:</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '12px' }}>
                  <li>Immediately visible - can't be missed</li>
                  <li>Standard web pattern users expect</li>
                  <li>Shows the banner is important/site-wide</li>
                  <li>Doesn't interfere with navigation clicks</li>
                </ul>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>Cons:</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Pushes content down slightly</li>
                </ul>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>Used by:</strong> Some promotional banners, sale announcements
                </p>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>Pros:</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '12px' }}>
                  <li>Logo/branding stays at very top</li>
                  <li>Feels less intrusive</li>
                </ul>
                <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <strong>Cons:</strong>
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Less standard pattern</li>
                  <li>Could be confused with page content</li>
                  <li>Easier to scroll past without noticing</li>
                </ul>
              </>
            )}
          </div>

          <div style={{ background: '#fff7ed', border: '2px solid #fdba74', padding: '20px', borderRadius: '12px' }}>
            <p style={{ fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
              <strong>💡 Recommendation:</strong> Go with "Above Navigation" - it's the industry standard for important site-wide notifications like currency detection. Users expect and recognize this pattern.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
