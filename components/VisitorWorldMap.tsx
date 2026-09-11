import { getVisitorCountries, getVisitorStates } from '@/lib/visitor-countries';
import { WORLD_PATHS, US_STATE_PATHS, WORLD_NAMES, WORLD_VIEWBOX } from '@/lib/world-map-paths';
import MapHoverLabel from '@/components/MapHoverLabel';
import { getTranslations, type Locale } from '@/lib/i18n-subdomain';

/**
 * World map with every country IntoBrick has had a visitor from filled in
 * brand blue.
 *
 * A SERVER component on purpose. lib/world-map-paths.ts is 139KB of SVG path
 * data; imported into a client component that is 139KB of JavaScript shipped
 * to every visitor of this page. Rendered here it is just markup in the HTML
 * response, gzipped by nginx along with everything else, and costs the browser
 * no parse, no hydration and no bundle. The map has no interactivity to lose
 * by it -- it is a picture.
 *
 * Renders nothing at all when GA credentials are absent or the query fails.
 * That is the normal state on a dev machine, and a page that silently omits
 * one section beats a page that 500s because an external API had a bad minute.
 */

const BRAND_BLUE = '#3b82f6';
const UNVISITED = '#eef1f5';
const BORDER = '#ffffff';

/**
 * One shading scale, shared by countries and US states.
 *
 * The map was binary at first -- visited or not -- because the range is brutal:
 * 1,455 users in the US against 1 in thirty-nine countries. A naive linear
 * ramp over that makes the US solid and everything else indistinguishable from
 * empty.
 *
 * Roughly-logarithmic bands fix it, and the real distribution bears it out:
 *
 *   100+     6 countries
 *   30-99   13
 *   10-29   14
 *   3-9     27
 *   1-2     39
 *
 * Fixed thresholds rather than quantiles, so a band means the same thing
 * between refreshes and a country does not change colour because its
 * neighbours moved.
 *
 * The palest band is deliberately a clear blue, not a near-grey: thirty-nine
 * countries live there, and if it reads as "empty" the map loses a third of
 * its coverage. UNVISITED stays neutral grey so the difference between "one
 * visitor" and "none" is a difference in hue, not just lightness.
 */
const BANDS: { min: number; fill: string; label: string }[] = [
  { min: 100, fill: '#1f5fc0', label: '100+' },
  { min: 30, fill: BRAND_BLUE, label: '30–99' },
  { min: 10, fill: '#7fb0f2', label: '10–29' },
  { min: 3, fill: '#aecdf8', label: '3–9' },
  { min: 1, fill: '#d8e7fd', label: '1–2' },
];

function fillFor(users: number): string {
  if (users <= 0) return UNVISITED;
  return (BANDS.find((b) => users >= b.min) ?? BANDS[BANDS.length - 1]).fill;
}

export default async function VisitorWorldMap({ locale }: { locale: Locale }) {
  const [data, stateData] = await Promise.all([getVisitorCountries(), getVisitorStates()]);
  if (!data || data.totalCountries === 0) return null;

  const t = await getTranslations(locale);
  const countryUsers = new Map(data.countries.map((c) => [c.code, c.users]));
  const stateUsers = new Map((stateData?.states ?? []).map((s) => [s.name, s.users]));
  // Hover labels, in the reader's language. Falls back to English for a locale
  // the name data does not cover, and to the country code itself rather than
  // an empty tooltip.
  const names = WORLD_NAMES[locale] || WORLD_NAMES.en;

  // "Visitors", not "Collectors". This said "Collectors in 98 countries" and
  // that was an overclaim: the number is GA totalUsers -- anyone who loaded a
  // page, crawlers included -- while a collector is someone with an actual
  // collection, of which there are around sixty. Nothing here can tell you
  // which country a registered collector is in; GA only knows page views, and
  // the account records have no country on them.
  //
  // The heading counts what GA reports; the map draws what Natural Earth 110m
  // has a shape for. Those differ slightly -- Hong Kong, Singapore, Malta and
  // friends are either absent from a 110m world or smaller than a pixel at
  // this size. The GA number is the true claim and stays in the heading; the
  // map is the illustration, and nobody counts 45 shapes to check.
  const heading = (
    t.collectors?.map?.title || 'Visitors from {count} countries'
  ).replace('{count}', String(data.totalCountries));
  const sub = t.collectors?.map?.subtitle || 'Everywhere IntoBrick has been opened';

  // The alt text carries the same fact as the heading, because a screen reader
  // gets nothing from 174 <path> elements.
  const label = heading;
  const legendLabel = t.collectors?.map?.legend || 'Visitors';
  const noneLabel = t.collectors?.map?.none || 'none';

  return (
    <section style={{ marginBottom: '56px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            margin: '0 0 4px',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: '#171717',
            letterSpacing: '-0.01em',
          }}
        >
          {heading}
        </h2>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#737373' }}>{sub}</p>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        <MapHoverLabel>
        <svg
          viewBox={WORLD_VIEWBOX}
          role="img"
          aria-label={label}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {Object.entries(WORLD_PATHS).map(([code, d]) => (
            <path
              key={code}
              d={d}
              data-name={names[code] || code}
              aria-label={names[code] || code}
              fill={fillFor(countryUsers.get(code) ?? 0)}
              stroke={BORDER}
              // Hairline separators so two adjacent blue countries still read
              // as two countries rather than one continent-shaped blob.
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
          ))}

          {/* The US, drawn as states. WORLD_PATHS has no US country shape --
              these replace it, in the same projection, so they sit exactly
              where the outline was, and they use the same BANDS as every
              country so one legend covers the whole map. Only the US is split:
              of the large-land countries, it is the only one whose
              subdivisions are nearly all covered (50 of 51). Russia manages 3
              of 83, so splitting it would empty out the largest shape on the
              map. Revisit another country at ~90%. */}
          {Object.entries(US_STATE_PATHS).map(([name, d]) => {
            const users = stateUsers.get(name) ?? 0;
            return (
              <path
                key={name}
                d={d}
                data-name={name}
                aria-label={name}
                fill={fillFor(users)}
                stroke={BORDER}
                strokeWidth={0.4}
                strokeLinejoin="round"
              />
            );
          })}
        </svg>
        </MapHoverLabel>

        {/* A legend is not optional once the map shades. Without it a reader
            cannot tell whether pale blue means "few" or "not sure", and the
            grey/blue distinction at the bottom end carries real information. */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px 16px',
            marginTop: '14px',
            paddingTop: '14px',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>{legendLabel}</span>
          {[...BANDS].reverse().map((b) => (
            <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <i
                aria-hidden="true"
                style={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '3px',
                  background: b.fill,
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>{b.label}</span>
            </span>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i
              aria-hidden="true"
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '3px',
                background: UNVISITED,
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>{noneLabel}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
