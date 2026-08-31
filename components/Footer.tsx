'use client';

import { useTranslation } from './TranslationProvider';

export default function Footer() {
  const { t } = useTranslation();
  const popularThemes = [
    { name: t('themes.names.starWars') || 'Star Wars', slug: 'star-wars' },
    { name: t('themes.names.harryPotter') || 'Harry Potter', slug: 'harry-potter' },
    { name: t('themes.names.superHeroes') || 'Super Heroes', slug: 'super-heroes' },
    { name: t('themes.names.city') || 'City', slug: 'city' },
    { name: t('themes.names.ninjago') || 'Ninjago', slug: 'ninjago' },
    { name: t('themes.names.friends') || 'Friends', slug: 'friends' },
  ];

  return (
    <footer style={{
      background: '#f5f5f5',
      borderTop: '1px solid #d4d4d4',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Main Navigation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>

          {/* Browse */}
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {t('footer.browse') || 'Browse'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {popularThemes.map((theme) => (
                <a
                  key={theme.slug}
                  href={`/themes/${theme.slug}`}
                  style={{
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
                >
                  {theme.name}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {t('footer.resources') || 'Resources'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="/collectors" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('collectors.directory.badge') || 'Collectors'}</a>
              <a href="/about" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('navigation.about')}</a>
              <a href="/faq" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('footer.faq')}</a>
              <a href="/articles" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('footer.articles') || t('footer.guides')}</a>
              <a href="/retiring-soon" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('navigation.retiringSoon') || 'Retiring Soon'}</a>
              <a href="/identify" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('navigation.identify') || 'AI Identify'}</a>
              {/* Both selling tools had no internal links anywhere, which
                  undercut the SEO landing pages they were built to be. The
                  in-app entry points stay on the collection pages, where the
                  thought "I want to sell these" actually happens. */}
              <a href="/whatnot-export" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('whatnotExport.meta.title') || 'Whatnot CSV Export'}</a>
              <a href="/bricklink-export" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('bricklinkExport.meta.title') || 'BrickLink Export'}</a>
              <a href="/listing-generator" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('listingGenerator.meta.title') || 'Listing Generator'}</a>
              <a href="/support" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('footer.supportUs')}</a>
              <a href="/premium" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('navigation.premium') || 'Premium'}</a>
            </div>
          </div>

          {/* Account & Legal */}
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {t('footer.accountLegal') || 'Account & Legal'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="mailto:hello@ericksu.com" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('footer.contact')}</a>
              <a href="/privacy" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('footer.privacy')}</a>
              <a href="/disclosure" style={{ color: '#525252', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
              >{t('footer.disclosure')}</a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {t('footer.aboutFigTracker') || 'About FigTracker'}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#525252',
              lineHeight: '1.5',
              margin: 0
            }}>
              {t('footer.aboutDescription') || 'FigTracker gives you one suggested price for any LEGO minifigure or set, so you can list faster and sell with confidence.'}
            </p>
          </div>

        </div>

        {/* Bottom Legal Section */}
        <div style={{
          paddingTop: '32px',
          borderTop: '1px solid #d4d4d4'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#737373',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              {t('footer.affiliateDisclosure') || 'As an Amazon Associate, LEGO Affiliate, and eBay Partner, FigTracker earns from qualifying purchases.'}
            </p>
            <p style={{ margin: 0 }}>
              {t('footer.bricklinkDisclosure') || 'Minifigure data provided by BrickLink.com. The term "BrickLink" is a trademark of the LEGO Group. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc.'}
            </p>
          </div>
          <p style={{
            margin: 0,
            fontSize: '11px',
            color: '#a3a3a3'
          }}>
            {(t('footer.copyright') || '© {year} FigTracker. All rights reserved.').replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
