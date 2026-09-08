'use client';

import Link from 'next/link';
import {
  CameraIcon,
  DocumentTextIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

/**
 * The three things the homepage was not promoting.
 *
 * HomeFeatureDashboard covers the guest sell list and Whatnot search -- both
 * genuinely work with no account, which is why that group sits above this one
 * under the "try it now" heading. What it left out was everything a returning
 * seller actually comes back for. This fills that in without repeating any
 * card that already exists up there.
 *
 * The photo identifier lives HERE, not up there. It was in the "no account
 * needed" group with a comment claiming it "has a free tier" -- it does not:
 * app/api/scan/identify returns PREMIUM_REQUIRED to anyone without a
 * subscription. Inviting a stranger to "try the identifier" under a heading
 * that promises no account is a paywall with extra steps, and the fact that
 * the card also carried a Premium tag does not undo the heading above it.
 *
 * The collection card moved UP into HomeFeatureDashboard, swapping places
 * with the identifier. A guest collection is held in localStorage
 * (lib/guestCollectionStorage.ts) and carries through to the export tool, so
 * it belongs under "no account needed" far better than a Premium-gated
 * feature did.
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
      // Premium, and labelled as such. The CTA says "see how it works" rather
      // than "try it": /identify shows the widget to subscribers and the
      // upgrade teaser to everyone else, so promising a try would be a promise
      // the page cannot keep for most of the people who read it.
      href: '/identify',
      icon: CameraIcon,
      tint: '#f4f1fb',
      iconColor: '#7c3aed',
      premium: true,
      title: t('homeMore.identify.title') || 'Name any minifigure from a photo',
      body:
        t('homeMore.identify.body') ||
        'Point your camera at a minifigure and we tell you which one it is and what it is worth.',
      note: t('homeMore.identify.note') || 'Included with Premium · unlimited scans',
      cta: t('homeMore.identify.cta') || 'See how it works',
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
          {cards.map(({ href, icon: Icon, tint, iconColor, premium, title, body, note, cta }) => (
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ ...ICON_WRAP, background: tint }}>
                  <Icon
                    aria-hidden="true"
                    style={{ width: 'var(--icon-base)', height: 'var(--icon-base)', color: iconColor }}
                  />
                </span>
                {premium && (
                  <span
                    style={{
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#92400e',
                      background: '#fef3c7',
                      borderRadius: '999px',
                    }}
                  >
                    {t('homeDash.premium') || 'Premium'}
                  </span>
                )}
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
