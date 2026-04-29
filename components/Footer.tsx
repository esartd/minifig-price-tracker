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
          <a href="/guides" style={{
            color: '#525252',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
          >{t('footer.guides')}</a>
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

        {/* BrickLink Attribution (Required) */}
        <div style={{
          marginBottom: 'var(--space-4)',
          lineHeight: '1.7',
          fontSize: 'var(--text-xs)',
          color: '#737373'
        }}>
          <p style={{ margin: 0, marginBottom: 'var(--space-1)' }}>
            {t('footer.dataProvidedBy')}{' '}
            <a
              href="https://www.bricklink.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
            >
              BrickLink.com
            </a>
          </p>
          <p style={{ margin: 0 }}>
            {t('footer.bricklinkTrademark')}
          </p>
          <p style={{ margin: 0, marginTop: 'var(--space-1)' }}>
            {t('footer.legoTrademark')}
          </p>
        </div>

        {/* Copyright & Credit */}
        <div style={{
          fontSize: 'var(--text-xs)',
          color: '#a3a3a3',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: 0, marginBottom: '4px' }}>
            © {new Date().getFullYear()} FigTracker. {t('footer.allRightsReserved')}
          </p>
          <p style={{ margin: 0 }}>
            {t('footer.createdBy')}{' '}
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
