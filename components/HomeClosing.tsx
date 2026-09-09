'use client';

import { useState } from 'react';
import HeaderSearch from '@/components/HeaderSearch';
import { useTranslation } from './TranslationProvider';
import { Section } from '@/lib/design-system';

/**
 * The last thing on the homepage: one line and a search box.
 *
 * Before this, the page ended on RecommendedSets -- a 1,274px grid of set
 * cards, the tallest section on the page and the last. Anyone who scrolled
 * that far simply ran out of page, with nothing asking them to do the one
 * thing the site is for. Every section above it either explains or browses;
 * none of them close.
 *
 * It is a search box rather than a button because search IS the product. The
 * hero opens with one, so the page now opens and closes on the same action,
 * and a visitor who has just scrolled 5,000px does not have to scroll back up
 * to use it.
 *
 * Same component as the hero's and the header's, deliberately -- it inherits
 * the autocomplete, the keyboard handling and the screen-reader wiring rather
 * than being a third, worse implementation of all three.
 *
 * Tone: Section.bg.statement, the same tint as the "why this exists" band.
 * That is what makes the page read as bookended -- the two sections that ask
 * something of the reader share a ground, and the six that inform alternate
 * white and #fafafa between them. It also sits outside .home-bands in
 * app/page.tsx, so it takes no part in that alternation.
 */
export default function HomeClosing() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  return (
    <section
      style={{
        padding: Section.paddingFeature,
        background: Section.bg.statement,
      }}
    >
      <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: '#171717',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textWrap: 'balance',
          }}
        >
          {t('homepage.closing.title') || 'Price your first minifigure'}
        </h2>

        <p
          style={{
            margin: '0 auto 28px',
            maxWidth: '46ch',
            fontSize: 'var(--text-base)',
            lineHeight: 1.6,
            color: '#525252',
            textWrap: 'pretty',
          }}
        >
          {t('homepage.closing.subtitle') ||
            'One number, in a couple of seconds. No account, nothing to install.'}
        </p>

        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <HeaderSearch value={query} onValueChange={setQuery} variant="hero" />
        </div>
      </div>
    </section>
  );
}
