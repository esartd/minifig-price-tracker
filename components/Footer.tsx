'use client';

export default function Footer() {
  return (
    <footer style={{
      padding: 'var(--space-6) var(--space-4)',
      textAlign: 'center',
      fontSize: 'var(--text-sm)',
      color: '#737373',
      borderTop: '1px solid #e5e5e5',
      background: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
          fontSize: 'var(--text-sm)',
          flexWrap: 'wrap'
        }}>
          <a href="/about" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >About</a>
          <a href="/privacy" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >Privacy Policy</a>
          <a href="/disclosure" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >Affiliate Disclosure</a>
        </div>

        {/* Divider */}
        <div style={{
          width: '60px',
          height: '1px',
          background: '#e5e5e5',
          margin: '0 auto var(--space-5) auto'
        }} />

        {/* BrickLink Attribution (Required) */}
        <div style={{
          marginBottom: 'var(--space-4)',
          lineHeight: '1.7',
          fontSize: 'var(--text-xs)',
          color: '#737373'
        }}>
          <p style={{ margin: 0, marginBottom: 'var(--space-1)' }}>
            Minifigure data provided by <a
              href="https://www.bricklink.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
            >
              BrickLink.com
            </a>
          </p>
          <p style={{ margin: 0 }}>
            The term "BrickLink" is a trademark of the LEGO Group BrickLink. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc.
          </p>
          <p style={{ margin: 0, marginTop: 'var(--space-1)' }}>
            LEGO® is a trademark of the LEGO Group.
          </p>
        </div>

        {/* Copyright & Credit */}
        <div style={{
          fontSize: 'var(--text-xs)',
          color: '#a3a3a3',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: 0, marginBottom: '4px' }}>
            © {new Date().getFullYear()} FigTracker. All rights reserved.
          </p>
          <p style={{ margin: 0 }}>
            Created by <a
              href="https://ericksu.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#a3a3a3', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#a3a3a3'}
              onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
            >
              ES Art & D LLC
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
