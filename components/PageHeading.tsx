import type { CSSProperties, ReactNode } from 'react';

/**
 * The standard page heading band: title, optional subtitle, consistent space
 * above and below.
 *
 * Every page used to hand-roll this, and no two agreed. Measured across
 * thirteen page types on production in September 2026:
 *
 *   sizes    36, 40, 48, 56, 72 px
 *   weights  600, 700, 800
 *   gaps     24, 32, 48, 64, 92, 118, 140, 169, 244, 273 px  (nav to h1)
 *
 * The type scale in globals.css already said which token a page heading should
 * use -- `--text-2xl`, commented "H1: page headings" -- but most pages reached
 * for `--text-3xl`, the hero token, so ordinary browse pages shouted as loudly
 * as the marketing pages.
 *
 * Marketing heroes (/about, /premium, /support) and the dark hand-rolled hero
 * on /collectors are deliberately NOT this component. They are a different
 * thing -- centred, full-bleed, generous top space -- and flattening them into
 * this band would be unifying two things that were never the same.
 */

// Space above the title and below the block. One number each, used by every
// page, so "consistent spacing" is a fact about the code rather than a thing
// that has to be re-measured. 32px is the 8px grid's x4 step.
const SPACE_ABOVE = 32;
const SPACE_BELOW = 32;

export interface PageHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Centred for pages whose content below is also centred (e.g. /retiring-soon). */
  align?: 'left' | 'center';
  /**
   * Rendered under the subtitle, inside the same band and on the same left
   * edge -- badges, a count, a "last updated" line.
   */
  children?: ReactNode;
  /** Matches the page's own content column when it is not the usual 1200px. */
  maxWidth?: number;
  style?: CSSProperties;
}

export default function PageHeading({
  title,
  subtitle,
  align = 'left',
  children,
  maxWidth = 1200,
  style,
}: PageHeadingProps) {
  return (
    <div
      style={{
        // The horizontal gutter goes on this full-width wrapper, never on the
        // inner column -- putting it inside leaves the column aligned but
        // pushes its contents 16px in, which is exactly how /deals ended up
        // with its headings a visible step right of its cards.
        padding: `${SPACE_ABOVE}px 16px ${SPACE_BELOW}px`,
        ...style,
      }}
    >
      <div style={{ maxWidth: `${maxWidth}px`, margin: '0 auto', textAlign: align }}>
        <h1
          style={{
            // The token whose own comment reads "H1: page headings".
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: '#171717',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: '#737373',
              lineHeight: 1.6,
              margin: '8px 0 0',
              // Long subtitles set to the full 1200px column are a chore to
              // read; capping the measure keeps them to a comfortable line.
              maxWidth: '68ch',
              ...(align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : null),
            }}
          >
            {subtitle}
          </p>
        )}

        {children && <div style={{ marginTop: '16px' }}>{children}</div>}
      </div>
    </div>
  );
}
