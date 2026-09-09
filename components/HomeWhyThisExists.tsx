'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';
import { Section } from '@/lib/design-system';

/**
 * Lighter than the words so they do not compete with the sentence, but not so
 * light that they vanish -- an unquoted version of this line is our
 * accusation rather than a collector's, so the marks have to be legible.
 * #525252 is the site's existing secondary text colour: 7:1 on the tinted
 * ground, and still clearly lighter than the #171717 words. A cooler
 * #94a3b8 looked better and measured 2.3:1, which is not a trade to make on
 * punctuation that changes who is speaking.
 */
const QUOTE_MARK = { color: '#525252', fontWeight: 400 } as const;

/**
 * Quotation marks per locale, because they are not the same characters
 * everywhere and a German page set with English quotes looks translated.
 *
 * German and Polish open low; Swedish uses the right-pointing mark on both
 * sides; French, Spanish, Italian and Portuguese take guillemets; Japanese
 * takes corner brackets. French alone puts a NO-BREAK SPACE inside its
 * guillemets -- it must be no-break, or the mark wraps onto its own line --
 * while Spanish, Italian and Portuguese set the same marks tight.
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
  // French is the only one of the four that sets a space inside the
  // guillemets. Spanish (RAE), Italian and Portuguese set them tight, and
  // « like this » reads as a French page in those languages.
  fr: ['\u00AB\u00A0', '\u00A0\u00BB'],
  es: ['\u00AB', '\u00BB'],
  it: ['\u00AB', '\u00BB'],
  pt: ['\u00AB', '\u00BB'],
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
 * ON THE TINTED BAND, and why it is not the black one it started as.
 *
 * Measured: every section after the hero was rgb(255,255,255) -- five in a
 * row, ~2,400px of it. This section is centred prose among left-aligned card
 * grids, so on white it read as an orphan rather than a change of subject and
 * got skipped. Two earlier attempts failed the same way: a #fafafa box with
 * four paragraphs (a third bordered box in a column of bordered boxes), then
 * a bare centred quote with no signal at all.
 *
 * So it needs its own ground -- but #171717 was the wrong ground. On a page
 * whose hero is a blue gradient over near-white and whose other six sections
 * alternate #ffffff and #fafafa, a black slab is the only heavy thing
 * anywhere and reads as pasted on. Section.bg.statement is a soft cool tint
 * instead: distinct from the neutral #fafafa beside it, still in the same
 * light family as the rest of the page, and dark-on-light so the #3b82f6
 * accent behaves here exactly as it does everywhere else.
 *
 * Two type details that are easy to undo by accident:
 *
 * - The quote is var(--text-2xl) (40px), NOT --text-3xl. It was 3xl at first,
 *   which is 56px -- the exact size of the hero h1. Two 56px lines on one
 *   page means neither is the headline, and it was a large part of why this
 *   section felt like too much. 40px sits deliberately between the hero
 *   (56px) and the section headings (30px).
 * - Weight 500, not 600. Large-and-light reads as speech; large-and-bold
 *   reads as a headline, which is what it looked like sitting above a real
 *   one.
 *
 * Padding comes from Section.paddingFeature. This is the one section allowed
 * more air than its neighbours' 80px; the first version had 16px/56px, less
 * air than the card grids around it.
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
        padding: Section.paddingFeature,
        background: Section.bg.statement,
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
            fontSize: 'var(--text-2xl)',
            fontWeight: 500,
            color: '#171717',
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
            color: '#525252',
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
            color: '#737373',
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
            borderTop: '1px solid #d7e0ee',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            lineHeight: 1.35,
            color: '#171717',
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
              color: '#3b82f6',
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
