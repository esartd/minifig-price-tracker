/**
 * Generates lib/world-map-paths.ts -- one SVG path per country, keyed by the
 * ISO 3166-1 alpha-2 code that the GA4 Data API's `countryId` dimension
 * returns.
 *
 * Run once, commit the output, done:
 *
 *   node scripts/generate-world-map.mjs
 *
 * Why generate instead of rendering a map at runtime: every React map library
 * wants a projection, a topojson file and a peer-dependency dance at runtime,
 * for a picture that never changes. Country borders are not a live dataset --
 * they change every few years, not every request. So the projection runs once
 * here, on a build machine, and the site ships a flat object of path strings
 * with no map dependency at all. d3-geo, topojson-client, world-atlas and
 * i18n-iso-countries are all devDependencies and never reach the bundle.
 *
 * Miller cylindrical: rectangular, and it keeps country shapes recognisable.
 * Two projections were tried and rejected first, for opposite reasons:
 *
 * - Natural Earth 1 curved the top and bottom edges and tapered the sides.
 *   Handsome in an atlas; against a page of rectangular cards it read as a
 *   bulging blob rather than a map.
 * - Equirectangular is a clean rectangle but draws one degree of longitude at
 *   the same width everywhere, while on the globe a degree narrows towards the
 *   poles. At 40 north -- the United States, Europe, Japan, most of the
 *   traffic -- a degree is only about 70% as wide as at the equator, so those
 *   countries came out stretched sideways. The USA looked squashed flat.
 *
 * Miller compresses latitude before projecting, which restores the proportions
 * at those latitudes without Mercator's blow-up: Mercator is the other obvious
 * rectangle and inflates the poles so hard that Greenland outranks Africa.
 *
 * 110m is the coarsest Natural Earth resolution and the right one here. The
 * map renders about 900px wide; 50m would quadruple the file for detail no one
 * can see at that size.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoPath } from 'd3-geo';
import { geoMiller } from 'd3-geo-projection';
import { feature } from 'topojson-client';
import countries from 'i18n-iso-countries';

const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'ja', 'nl', 'pl', 'pt', 'sv'];

const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-110m.json');
for (const l of LOCALES) countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`));

/**
 * The name to show when someone hovers a country, per locale.
 *
 * i18n-iso-countries has two registers and neither is right on its own. The
 * default is formal -- Dutch returns "Bondsrepubliek Duitsland" for Germany --
 * while `alias` is short but sometimes worse: English KR becomes "Korea,
 * Republic of" where the default is the perfectly good "South Korea".
 *
 * So: take the alias when it is shorter, which fixes the formal-name cases,
 * and ignore it below four characters, which is what stops GB collapsing from
 * "United Kingdom" to "UK".
 */
function displayName(alpha2, locale) {
  const full = countries.getName(alpha2, locale) || '';
  const alias = countries.getName(alpha2, locale, { select: 'alias' }) || '';
  if (alias && alias.length > 3 && alias.length <= full.length) return alias;
  return full;
}
const usTopo = require('us-atlas/states-10m.json');

const WIDTH = 900;
// With Antarctica gone the remaining land is close to 2:1. fitSize letterboxes
// into whatever box it is given, so this only has to be near -- too tall and
// the map floats in vertical whitespace.
const HEIGHT = 450;

const all = feature(topo, topo.objects.countries);
const usStates = feature(usTopo, usTopo.objects.states);

/**
 * Antarctica is dropped, not just left unfilled.
 *
 * Under Miller it is a 900px-wide white band across the bottom of the map --
 * about a fifth of the height -- for a continent that will never appear in a
 * visitor report. Keeping it meant the map either wasted that space or shrank
 * the inhabited world to make room for it. Removing it before fitSize lets the
 * projection scale the parts anyone will actually look at.
 */
const geo = {
  ...all,
  features: all.features.filter((f) => f.properties?.name !== 'Antarctica'),
};

/**
 * The United States is drawn as fifty-one state shapes instead of one country
 * shape, in this same projection, so they land exactly where the country
 * outline was. The map stays a single world map -- the US just has internal
 * detail nowhere else has.
 *
 * Only the US, and that is a data decision. Coverage of subdivisions, measured
 * against real GA numbers:
 *
 *   United States  50/51  98%      Brazil      8/27  30%
 *   Mexico         22/32  69%      India       9/36  25%
 *   Australia       5/8   63%      Argentina   3/24  13%
 *   Canada          8/13  62%      Russia      3/83   4%
 *   China          16/34  47%
 *
 * Land area and visitor spread point opposite ways, so subdividing the biggest
 * countries is the wrong move. Russia is the proof: largest shape on the map,
 * solid today, would become three regions out of eighty-three. Revisit another
 * country when it passes ~90%.
 *
 * Note this projection places Alaska and Hawaii where they actually are, far
 * from the lower 48. That is correct for a world map -- the alternative,
 * d3's geoAlbersUsa, composites them into insets at the bottom left, which is
 * right for a standalone US map and nonsense inside a world one.
 */
const US_NUMERIC = '840';

const projection = geoMiller().fitSize([WIDTH, HEIGHT], geo);
// 2 decimal places: at 900px wide, a hundredth of a pixel is invisible, and
// full float precision triples the file size for nothing.
const toPath = geoPath(projection).pointRadius(2);

const paths = {};
const skipped = [];

for (const f of geo.features) {
  // Skipped because the fifty-one state shapes below cover the same ground.
  if (String(f.id).padStart(3, '0') === US_NUMERIC) continue;

  // world-atlas ids are ISO 3166-1 numeric; GA4 speaks alpha-2.
  const alpha2 = countries.numericToAlpha2(String(f.id).padStart(3, '0'));
  const name = f.properties?.name ?? String(f.id);

  if (!alpha2) {
    // Kosovo (-99) and a few disputed entries have no assigned numeric code.
    // They are drawn as part of the base outline below but cannot be lit up,
    // which is correct: GA cannot report a country code that does not exist.
    skipped.push(name);
    continue;
  }

  const d = toPath(f);
  if (!d) continue;
  paths[alpha2] = d.replace(/(\d+\.\d{2})\d+/g, '$1');
}

/**
 * The five inhabited territories are excluded. GA reports Puerto Rico, Guam,
 * the US Virgin Islands, American Samoa and the Northern Marianas as their own
 * COUNTRIES, not as US regions -- so they are already drawn by the country
 * layer above, and including them here drew Puerto Rico twice, once from each
 * layer. The country layer is the correct one because it is the one GA can
 * actually light up.
 */
const US_TERRITORIES = new Set([
  'Puerto Rico',
  'Guam',
  'United States Virgin Islands',
  'American Samoa',
  'Commonwealth of the Northern Mariana Islands',
]);

const statePaths = {};
for (const f of usStates.features) {
  if (US_TERRITORIES.has(f.properties.name)) continue;
  const d = toPath(f);
  if (!d) continue;
  statePaths[f.properties.name] = d.replace(/(\d+\.\d{2})\d+/g, '$1');
}

const names = {};
for (const l of LOCALES) {
  names[l] = {};
  for (const alpha2 of Object.keys(paths)) {
    const n = displayName(alpha2, l);
    // Fall back to English rather than emitting an empty tooltip.
    names[l][alpha2] = n || displayName(alpha2, 'en') || alpha2;
  }
}

const out = `/**
 * GENERATED FILE -- do not edit by hand.
 * Run \`node scripts/generate-world-map.mjs\` to rebuild.
 *
 * One SVG path per country, keyed by ISO 3166-1 alpha-2 (what the GA4 Data
 * API's \`countryId\` dimension returns). Miller cylindrical projection fitted to
 * a ${WIDTH}x${HEIGHT} viewBox, from Natural Earth 110m data (public domain).
 */

export const WORLD_VIEWBOX = '0 0 ${WIDTH} ${HEIGHT}';

export const WORLD_PATHS: Record<string, string> = ${JSON.stringify(paths, null, 0)};

/**
 * US states, in the SAME projection, replacing the US country shape which is
 * deliberately absent from WORLD_PATHS above. Keyed by the full state name the
 * GA4 \`region\` dimension returns ("California", "District of Columbia").
 */
export const US_STATE_PATHS: Record<string, string> = ${JSON.stringify(statePaths, null, 0)};

/**
 * Country names for hover labels, keyed by locale then by ISO alpha-2.
 *
 * All ten locales ship in this file, but only one is ever read: the map is a
 * server component, so the chosen locale's names are written straight into the
 * HTML and the other nine never leave the server. US state names are not here
 * -- they are the keys of US_STATE_PATHS, and i18n-iso-countries has no
 * subdivision data, so those stay English.
 */
export const WORLD_NAMES: Record<string, Record<string, string>> = ${JSON.stringify(names, null, 0)};
`;

writeFileSync(new URL('../lib/world-map-paths.ts', import.meta.url), out);

const bytes = Buffer.byteLength(out);
console.log(`lib/world-map-paths.ts written`);
console.log(`  countries with an alpha-2 code: ${Object.keys(paths).length}`);
console.log(`  skipped (no numeric code): ${skipped.join(', ') || 'none'}`);
console.log(`  US states drawn in place of the US country shape: ${Object.keys(statePaths).length}`);
console.log(`  US country shape present in WORLD_PATHS: ${'US' in paths}`);
console.log(`  localised names: ${LOCALES.length} locales x ${Object.keys(names.en).length} countries`);
console.log(`  size: ${(bytes / 1024).toFixed(0)} KB`);
