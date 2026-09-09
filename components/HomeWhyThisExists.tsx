'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

/**
 * Lighter than the words so they do not compete with the sentence, but not so
 * light that they vanish -- at #d4d4d4 they were invisible at a glance, and an
 * unquoted version of this line is our accusation rather than a collector's.
 */
const QUOTE_MARK = { color: '#a3a3a3', fontWeight: 400 } as const;

/**
 * Quotation marks per locale, because they are not the same characters
 * everywhere and a German page set with English quotes looks translated.
 *
 * German and Polish open low; Swedish uses the right-pointing mark on both
 * sides; French, Spanish, Italian and Portuguese take guillemets; Japanese
 * takes corner brackets. The inner NO-BREAK SPACE on the guillemet locales is
 * the French typographic rule and is deliberate -- a normal space there lets
 * the mark wrap onto its own line.
 *
 * The marks live here rather than inside the translated string so that a
 * translator cannot accidentally ship the sentence unquoted, which would turn
 * a collector's complaint into our own accusation.
 */
const QUOTES: Record<string, [string, string]> = {
  en: ['\u201C', '\u201D'],
  de: ['\u201E', '\u201C'],
  pl: ['\u201E', '\u201D'],
  sv: ['\u201D', '\u201D'],
  nl: ['\u201C', '\u201D'],
  fr: ['\u00AB\u00A0', '\u00A0\u00BB'],
  es: ['\u00AB\u00A0', '\u00A0\u00BB'],
  it: ['\u00AB\u00A0', '\u00A0\u00BB'],
  pt: ['\u00AB\u00A0', '\u00A0\u00BB'],
  ja: ['\u300C', '\u300D'],
};

/**
 * Why IntoBrick exists, as a pull quote rather than a paragraph.
 *
 * The most differentiating thing about this product -- that LEGO price guides
 * are widely felt to read high, and that this one is built to be listable --
 * was nowhere on the site. The homepage sold features; /about blamed
 * BrickLink for showing 24 confusing numbers, which is a usability complaint
 * and not the actual reason any of this was built.
 *
 * The beats come from a social post of Erick's that performed well, and the
 * order is why it worked: the complaint (quoted, and belonging to collectors
 * rather than to us) -> why it matters -> the mechanism -> confidence.
 *
 * ON THE DARK BAND, which is the only non-white section on the page.
 *
 * Measured: every section after the hero was rgb(255,255,255) -- five in a
 * row. This one is centred prose and the other four are left-aligned card
 * grids, so on white it read as an orphan rather than as a change of subject,
 * and it got skipped. Two earlier attempts failed for the same reason: a
 * #fafafa box with four paragraphs (a third bordered box in a column of
 * bordered boxes), then a bare centred quote (no signal at all).
 *
 * A full-bleed band fixes it because the tone change IS the signal -- the
 * same move Stripe makes for its one mid-page statement, and the reason
 * Linear alternates section tone at all. #171717 is not a new colour: it is
 * the site's existing text colour, so the page gains a register without
 * gaining a palette.
 *
 * Two details that follow from the dark ground and will look arbitrary:
 *
 * - The link is #60a5fa, not the site accent #3b82f6. The accent hits about
 *   3.6:1 on #171717, under the 4.5:1 body-text floor; #60a5fa clears 6.5:1.
 *   Use the accent anywhere on white, never here.
 * - The greys are #d4d4d4 (subline) and #a3a3a3 (method and the quote
 *   marks), NOT the #525252/#737373 this file used on white. On #171717
 *   those land at 2.2:1 and 3.5:1 -- under the 4.5:1 body floor, so the
 *   mechanism line was the least legible text in the section that exists to
 *   make the mechanism legible. Hierarchy still reads, because the quote
 *   above them is pure white.
 * - The quote is weight 500, not 600. Large-and-light reads as speech;
 *   large-and-bold reads as a headline, which is what the previous version
 *   looked like and part of why it sat oddly above a real headline.
 *
 * Padding is clamp(72px, 10vw, 112px). Linear runs 128px on sections this
 * important and the old 16px/56px here was the tightest on the page -- the
 * statement had less air than the card grids around it.
 *
 * TWO THINGS HERE ARE LOAD-BEARING AND WILL LOOK LIKE TIMIDITY.
 *
 * 1. No competitor is named. BrickEconomy is named on
 *    /how-we-calculate-prices and in the figtracker-vs-brickeconomy article,
 *    which is where a rival's name earns its keep -- it catches people already
 *    searching for an alternative. On the homepage it would teach every other
 *    visitor that a bigger rival exists. Unnamed, the opening line is reported
 *    sentiment about a category; named, it becomes a factual assertion about
 *    one company's methodology, which would need published data behind it.
 *
 * 2. The opening line is a QUOTATION, and the line under it says whose. Strip
 *    either and the same words become our own accusation, which is precisely
 *    what this framing exists to avoid. The quote marks are rendered in a
 *    lighter grey than the words so the sentence still reads cleanly -- they
 *    are punctuation carrying meaning, not decoration to drop.
 *
 * On the copy: "weights" is not marketing garnish, it is what the formula
 * does (lib/pricing-orchestrator.ts:8-12 -- three BrickLink signals averaged,
 * then weighted 95/5 against eBay). What it deliberately does NOT say is that
 * the price is what things "actually sold for": two of those three signals are
 * asking prices, so that would be the same overclaim this section exists to
 * complain about. It also avoids "cheaper" -- lower is not the selling point
 * and invites a race to the bottom. Listable is the point.
 */
export default function HomeWhyThisExists() {
  const { t, locale } = useTranslation();

  const quote = t('homepage.whyThisExists.complaint') || 'The prices are too high.';
  const [openQuote, closeQuote] = QUOTES[locale] || QUOTES.en;

  return (
    <section
      style={{
        // Full-bleed band. The tone change is what tells a reader this is a
        // different kind of content from the card grids above and below it.
        padding: 'clamp(72px, 10vw, 112px) 20px',
        background: '#171717',
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* The complaint. Weight 500 and large: speech, not a headline. */}
        <p
          style={{
            margin: '0 0 20px',
            fontSize: 'var(--text-3xl)',
            fontWeight: 500,
            color: '#ffffff',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            textWrap: 'balance',
          }}
        >
          <span style={QUOTE_MARK}>{openQuote}</span>
          {quote}
          <span style={QUOTE_MARK}>{closeQuote}</span>
        </p>

        {/* Whose complaint, and why it matters. */}
        <p
          style={{
            margin: '0 auto 14px',
            maxWidth: '54ch',
            fontSize: 'var(--text-lg)',
            lineHeight: 1.6,
            color: '#d4d4d4',
            textWrap: 'pretty',
          }}
        >
          {t('homepage.whyThisExists.subline') ||
            'The most common complaint about LEGO price guides — a valuation that looks great until you list at it.'}
        </p>

        {/* The mechanism, named. A vague promise of honesty differentiates
            nothing and cannot be checked. */}
        <p
          style={{
            margin: '0 auto 32px',
            maxWidth: '54ch',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.65,
            color: '#a3a3a3',
            textWrap: 'pretty',
          }}
        >
          {t('homepage.whyThisExists.method') ||
            'IntoBrick weights sold history, live listings and the current lowest into one number. No growth projections, no future value.'}
        </p>

        {/* The close. Shortest line in the band on purpose, and the only one
            that gets a rule above it. */}
        <p
          style={{
            display: 'inline-block',
            margin: '0 0 24px',
            paddingTop: '28px',
            borderTop: '1px solid #404040',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            lineHeight: 1.35,
            color: '#ffffff',
            letterSpacing: '-0.015em',
          }}
        >
          {t('homepage.whyThisExists.close') || 'Priced to list, not to admire.'}
        </p>

        <div>
          <Link
            href="/how-we-calculate-prices"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              // Not the #3b82f6 accent: it fails contrast on this ground.
              color: '#60a5fa',
              textDecoration: 'none',
            }}
          >
            {t('homepage.whyThisExists.link') || 'How we calculate prices'}
            <ArrowRightIcon style={{ width: '16px', height: '16px' }} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
