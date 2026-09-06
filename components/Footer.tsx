'use client';

import { useTranslation } from './TranslationProvider';

/**
 * One link. Every link in here used to repeat the same style object and the
 * same pair of mouse handlers inline -- twenty-odd copies, which is most of
 * why the column contents were hard to read and harder to rebalance.
 */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        color: '#525252',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#525252')}
    >
      {children}
    </a>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '16px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
    </div>
  );
}

/** Legal links in the bottom bar, separated by a middot. */
function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        color: '#737373',
        textDecoration: 'none',
        fontSize: '11px',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#737373')}
    >
      {children}
    </a>
  );
}

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
    <footer
      style={{
        background: '#f5f5f5',
        borderTop: '1px solid #d4d4d4',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Brand block plus four evenly weighted link groups. The previous
            layout put 13 links under "Resources" and 3 under "Account & Legal",
            with a bare paragraph as a fourth column -- auto-fit stretched all
            four to the tallest, so three of them sat on top of large voids.
            Grouping by purpose gets them to 6 / 4 / 4 / 5. */}
        <div className="footer-grid">
          <div>
            <p
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#171717',
                margin: '0 0 12px',
                letterSpacing: '-0.01em',
              }}
            >
              FigTracker
            </p>
            <p style={{ fontSize: '14px', color: '#525252', lineHeight: '1.6', margin: 0 }}>
              {t('footer.aboutDescription') ||
                'FigTracker gives you one suggested price for any LEGO minifigure or set, so you can list faster and sell with confidence.'}
            </p>
          </div>

          <FooterColumn title={t('footer.browse') || 'Browse'}>
            {popularThemes.map((theme) => (
              <FooterLink key={theme.slug} href={`/themes/${theme.slug}`}>
                {theme.name}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* The four export tools were previously labelled with their meta
              titles ("Whatnot CSV Export for LEGO Sellers"), which wrapped to
              two lines each. Those stay as page titles; the anchor text here is
              short and still carries the keyword. They are also the only
              internal links to these SEO landing pages, so none may be dropped
              -- that is exactly how /leaderboards ended up orphaned. */}
          <FooterColumn title={t('footer.sell') || 'Sell'}>
            <FooterLink href="/whatnot-export">
              {t('footer.tools.whatnotExport') || 'Whatnot Export'}
            </FooterLink>
            <FooterLink href="/bricklink-export">
              {t('footer.tools.bricklinkExport') || 'BrickLink Export'}
            </FooterLink>
            <FooterLink href="/ebay-export">
              {t('footer.tools.ebayExport') || 'eBay Export'}
            </FooterLink>
            <FooterLink href="/listing-generator">
              {t('footer.tools.listingGenerator') || 'Listing Generator'}
            </FooterLink>
          </FooterColumn>

          <FooterColumn title={t('footer.explore') || 'Explore'}>
            <FooterLink href="/identify">{t('navigation.identify') || 'AI Identify'}</FooterLink>
            <FooterLink href="/marketplace">
              {t('marketplace.navLabel') || 'Whatnot Marketplace'}
            </FooterLink>
            <FooterLink href="/retiring-soon">
              {t('navigation.retiringSoon') || 'Retiring Soon'}
            </FooterLink>
            <FooterLink href="/collectors">
              {t('collectors.directory.badge') || 'Collectors'}
            </FooterLink>
          </FooterColumn>

          <FooterColumn title={t('footer.company') || 'Company'}>
            <FooterLink href="/about">{t('navigation.about') || 'About'}</FooterLink>
            <FooterLink href="/faq">{t('footer.faq') || 'FAQ'}</FooterLink>
            <FooterLink href="/articles">
              {t('footer.articles') || t('footer.guides') || 'Articles'}
            </FooterLink>
            <FooterLink href="/premium">{t('navigation.premium') || 'Premium'}</FooterLink>
            <FooterLink href="/support">{t('footer.supportUs') || 'Support Us'}</FooterLink>
          </FooterColumn>
        </div>

        {/* Bottom bar. Contact, Privacy and Disclosure moved here from the grid:
            they are the same category of content as the disclosures already
            sitting in this row, and they were never enough to fill a column. */}
        <div style={{ paddingTop: '32px', borderTop: '1px solid #d4d4d4' }}>
          <div
            style={{
              fontSize: '11px',
              color: '#737373',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}
          >
            <p style={{ margin: '0 0 8px 0' }}>
              {t('footer.affiliateDisclosure') ||
                'As an Amazon Associate, LEGO Affiliate, eBay Partner, and Whatnot Affiliate, FigTracker earns from qualifying purchases.'}
            </p>
            <p style={{ margin: 0 }}>
              {t('footer.bricklinkDisclosure') ||
                'Minifigure data provided by BrickLink.com. The term "BrickLink" is a trademark of the LEGO Group. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc.'}
            </p>
          </div>

          <div className="footer-bottom-row">
            <p style={{ margin: 0, fontSize: '11px', color: '#a3a3a3' }}>
              {(t('footer.copyright') || '© {year} FigTracker. All rights reserved.').replace(
                '{year}',
                new Date().getFullYear().toString()
              )}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <LegalLink href="mailto:hello@ericksu.com">
                {t('footer.contact') || 'Contact'}
              </LegalLink>
              <span style={{ color: '#d4d4d4', fontSize: '11px' }}>·</span>
              <LegalLink href="/privacy">{t('footer.privacy') || 'Privacy'}</LegalLink>
              <span style={{ color: '#d4d4d4', fontSize: '11px' }}>·</span>
              <LegalLink href="/disclosure">{t('footer.disclosure') || 'Disclosure'}</LegalLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
