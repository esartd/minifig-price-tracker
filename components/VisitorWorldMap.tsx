import { getVisitorCountries } from '@/lib/visitor-countries';
import { WORLD_PATHS, WORLD_VIEWBOX } from '@/lib/world-map-paths';
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

export default async function VisitorWorldMap({ locale }: { locale: Locale }) {
  const data = await getVisitorCountries();
  if (!data || data.totalCountries === 0) return null;

  const t = await getTranslations(locale);
  const visited = new Set(data.countries.map((c) => c.code));

  // The heading counts what GA reports; the map draws what Natural Earth 110m
  // has a shape for. Those differ slightly -- Hong Kong, Singapore, Malta and
  // friends are either absent from a 110m world or smaller than a pixel at
  // this size. The GA number is the true claim and stays in the heading; the
  // map is the illustration, and nobody counts 45 shapes to check.
  const heading = (
    t.collectors?.map?.title || 'Collectors in {count} countries'
  ).replace('{count}', String(data.totalCountries));
  const sub = t.collectors?.map?.subtitle || 'Everywhere IntoBrick has been used';

  // The alt text carries the same fact as the heading, because a screen reader
  // gets nothing from 174 <path> elements.
  const label = heading;

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
              fill={visited.has(code) ? BRAND_BLUE : UNVISITED}
              stroke={BORDER}
              // Hairline separators so two adjacent blue countries still read
              // as two countries rather than one continent-shaped blob.
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
