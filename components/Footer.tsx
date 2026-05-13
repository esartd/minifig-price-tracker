'use client';

import { useTranslation } from './TranslationProvider';

export default function Footer() {
  const { t } = useTranslation();
  const popularThemes = [
    { name: 'Star Wars', slug: 'star-wars' },
    { name: 'Harry Potter', slug: 'harry-potter' },
    { name: 'Super Heroes', slug: 'super-heroes' },
    { name: 'DC Comics Super Heroes', slug: 'dc-comics-super-heroes' },
    { name: 'City', slug: 'city' },
    { name: 'Ninjago', slug: 'ninjago' },
  ];

  return (
    <footer style={{
      padding: 'var(--space-6) var(--space-4)',
      fontSize: 'var(--text-sm)',
      color: '#737373',
      borderTop: '1px solid #e5e5e5',
      background: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Popular Themes - New Section */}
        <div style={{
          marginBottom: 'var(--space-6)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#a3a3a3',
            marginBottom: 'var(--space-3)'
          }}>
            {t('navigation.popularThemes')}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap'
          }}>
            {popularThemes.map((theme) => (
              <a
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                style={{
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-sm)',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >
                {theme.name}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
          fontSize: 'var(--text-sm)',
          flexWrap: 'wrap',
          textAlign: 'center'
        }}>
          <a href="/about" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('navigation.about')}</a>
          <a href="/faq" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('footer.faq')}</a>
          <a href="/articles" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('footer.articles') || t('footer.guides')}</a>
          <a href="/support" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('footer.supportUs')}</a>
          <a href="mailto:hello@ericksu.com" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('footer.contact')}</a>
          <a href="/privacy" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('footer.privacy')}</a>
          <a href="/disclosure" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('footer.disclosure')}</a>
        </div>

        {/* Divider */}
        <div style={{
          width: '60px',
          height: '1px',
          background: '#e5e5e5',
          margin: '0 auto var(--space-5) auto'
        }} />

        {/* Affiliate Disclosure - Prominent */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '8px',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-5)',
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: '#1e40af',
          lineHeight: '1.6'
        }}>
          <strong>Affiliate Disclosure:</strong> As an Amazon Associate and BrickLink/eBay Partner, FigTracker earns from qualifying purchases.{' '}
          <a href="/disclosure" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: '500' }}>
            Learn more
          </a>
        </div>

        {/* Legal & Attribution - Center Aligned */}
        <div style={{
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: '#737373',
          lineHeight: '1.7'
        }}>
          <p style={{ margin: 0, marginBottom: 'var(--space-4)' }}>
            {t('footer.dataProvidedBy')}{' '}
            <a
              href="https://www.bricklink.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
            >
              BrickLink.com
            </a>
            . {t('footer.bricklinkTrademark')} {t('footer.legoTrademark')}
          </p>
          <p style={{ margin: 0, color: '#a3a3a3' }}>
            © {new Date().getFullYear()} FigTracker. {t('footer.allRightsReserved')} {t('footer.createdBy')}{' '}
            <a
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
