'use client';

import Link from 'next/link';
import {
  DocumentTextIcon,
  RectangleStackIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

/**
 * The three things the homepage was not promoting.
 *
 * HomeFeatureDashboard already covers the guest sell list, Whatnot search and
 * the photo identifier -- all of which work without an account, which is why
 * it sits above this under the "try it now" heading. What it left out was
 * everything a returning seller actually comes back for. This fills that in
 * without repeating any card that already exists up there.
 *
 * Price alerts deliberately do NOT get their own card. They are a feature of
 * tracking a collection rather than a separate reason to visit, so they read
 * as a supporting line on the collection card. A fourth equal-weight tile
 * would have meant four things competing and none standing out.
 */

const CARD = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
  padding: '24px',
  background: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '12px',
  textDecoration: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
};

const ICON_WRAP = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  flexShrink: 0,
};

const TITLE = {
  margin: 0,
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  color: '#171717',
  letterSpacing: '-0.01em',
};

const BODY = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  lineHeight: 1.6,
  color: '#525252',
};

const NOTE = {
  margin: 0,
  fontSize: 'var(--text-xs)',
  color: '#737373',
};

const CTA = {
  marginTop: 'auto',
  paddingTop: '4px',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: '#3b82f6',
};

export default function HomeMoreFeatures() {
  const { t } = useTranslation();

  const cards = [
    {
      href: '/listing-generator',
      icon: DocumentTextIcon,
      tint: '#eef2ff',
      iconColor: '#4f46e5',
      title: t('homeMore.listing.title') || 'Write the listing for me',
      body:
        t('homeMore.listing.body') ||
        'Pick a minifigure and get a finished listing for eBay, Facebook, BrickLink or Vinted — each one written the way that platform expects.',
      note: null,
      cta: t('homeMore.listing.cta') || 'Open the listing generator',
    },
    {
      href: '/collection',
      icon: RectangleStackIcon,
      tint: '#ecfdf5',
      iconColor: '#059669',
      // Deliberately not "price everything at once". That framing put this
      // card next to the dashboard's "Sell 20 figures without typing 20
      // listings" and both read as the same bulk promise. This one is about
      // knowing what things are worth over time; that one is about shifting
      // stock. Keep the two distinct.
      title: t('homeMore.collection.title') || 'Know what your collection is worth',
      body:
        t('homeMore.collection.body') ||
        'Add your minifigures and sets once and we keep a running total, so you always know where you stand without looking anything up.',
      note:
        t('homeMore.collection.note') ||
        'Set a price alert on any item and we will tell you when it moves.',
      cta: t('homeMore.collection.cta') || 'Start a collection',
    },
    {
      // /retiring-soon, not /deals -- app/deals has no page.tsx, only a
      // one-off campaign folder, so /deals is a 404.
      href: '/retiring-soon',
      icon: TagIcon,
      tint: '#fff7ed',
      iconColor: '#ea580c',
      title: t('homeMore.deals.title') || 'Catch sets before they retire',
      body:
        t('homeMore.deals.body') ||
        'We work out which sets are closest to leaving production, from their age and how their price has been moving.',
      note: null,
      cta: t('homeMore.deals.cta') || 'See what is retiring',
    },
  ];

  return (
    <section style={{ padding: '8px 20px 56px', background: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            margin: '0 0 20px',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: '#171717',
            letterSpacing: '-0.01em',
          }}
        >
          {t('homeGroups.more') || 'More ways to use IntoBrick'}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
          }}
        >
          {cards.map(({ href, icon: Icon, tint, iconColor, title, body, note, cta }) => (
            <Link
              key={href}
              href={href}
              style={CARD}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4d4d4';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ ...ICON_WRAP, background: tint }}>
                <Icon
                  aria-hidden="true"
                  style={{ width: 'var(--icon-base)', height: 'var(--icon-base)', color: iconColor }}
                />
              </span>
              <p style={TITLE}>{title}</p>
              <p style={BODY}>{body}</p>
              {note && <p style={NOTE}>{note}</p>}
              <span style={CTA}>{cta} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
