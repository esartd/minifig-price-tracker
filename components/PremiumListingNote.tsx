'use client';

import Link from 'next/link';
import { BoltIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * The Premium note on minifig and set detail pages, shown where the instant
 * listing generator would be for a subscriber.
 *
 * This replaced <UpgradeTeaser /> here, which was a bordered white card
 * carrying "This is a Premium feature" and an Upgrade button. Two problems,
 * and only one of them was cosmetic:
 *
 * 1. It read as a lock on the buttons above it. The card was a sibling of the
 *    "Add this minifigure to your collection" block, rendered on the SAME
 *    condition, separated by nothing but 24px of margin, in the same treatment
 *    as every functional card on the page. Nothing told the reader it belonged
 *    to a different feature, so they attached it to the nearest heading -- and
 *    concluded that adding to a collection was paid.
 *
 * 2. Its copy was not true. Listing generation is NOT Premium-only: press
 *    "+ To sell" and the collection-backed ListingGeneratorForm appears with no
 *    premium check at all. Premium removes the collection STEP, nothing more.
 *    The page was claiming a gate that does not exist, directly beneath the
 *    buttons that perform the free version of the same job.
 *
 * So this is deliberately not a card and deliberately has no button. A rule
 * ends the collection section above it, and what follows is one line of grey
 * text with an inline link. Something with no control in it cannot be mistaken
 * for a control on the task above, and it stops competing with the four
 * affiliate buttons below.
 *
 * UpgradeTeaser still exists and is still correct on /identify, where the AI
 * identifier genuinely is subscriber-only and the card is the whole page.
 */
export default function PremiumListingNote() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        marginTop: '24px',
        paddingTop: '20px',
        // The load-bearing line. This is what ends the "add to your collection"
        // section; without it the note reads as a caption on those buttons.
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      <BoltIcon
        aria-hidden="true"
        style={{ width: '18px', height: '18px', color: '#a3a3a3', flexShrink: 0, marginTop: '2px' }}
      />
      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-sm)',
          lineHeight: 1.6,
          color: '#737373',
        }}
      >
        {t('premium.listingNote.body') ||
          'Selling this one? Premium generates the listing straight from this page, skipping the collection step.'}{' '}
        <Link
          href="/premium"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            // Keeps "See Premium →" from breaking across two lines, which on a
            // 375px screen leaves a lone arrow on its own line.
            whiteSpace: 'nowrap',
          }}
        >
          {t('premium.listingNote.cta') || 'See Premium'} →
        </Link>
      </p>
    </div>
  );
}
