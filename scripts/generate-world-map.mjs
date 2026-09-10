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
 * Equirectangular projection: a plain flat rectangle, longitude straight to x
 * and latitude straight to y. Natural Earth 1 was here first and looked like a
 * globe someone had flattened -- curved top and bottom edges, tapering sides.
 * Handsome in an atlas, but on a page of rectangular cards it read as an odd
 * bulging blob rather than a map.
 *
 * Not Mercator, which is the other obvious flat option and the wrong one: it
 * inflates high latitudes so badly that Greenland outranks Africa. On a map
 * whose whole job is "look how many places our visitors are", a projection
 * that lies about size is a bad start. Equirectangular stretches the poles
 * too, but far less, and it gives the clean rectangle this layout wants.
 *
 * 110m is the coarsest Natural Earth resolution and the right one here. The
 * map renders about 900px wide; 50m would quadruple the file for detail no one
 * can see at that size.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countries from 'i18n-iso-countries';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-110m.json');

const WIDTH = 900;
// Equirectangular is exactly 2:1 -- 360 degrees of longitude over 180 of
// latitude -- so the viewBox matches and there is no letterboxing.
const HEIGHT = 450;

const geo = feature(topo, topo.objects.countries);

const projection = geoEquirectangular().fitSize([WIDTH, HEIGHT], geo);
// 2 decimal places: at 900px wide, a hundredth of a pixel is invisible, and
// full float precision triples the file size for nothing.
const toPath = geoPath(projection).pointRadius(2);

const paths = {};
const skipped = [];

for (const f of geo.features) {
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

const out = `/**
 * GENERATED FILE -- do not edit by hand.
 * Run \`node scripts/generate-world-map.mjs\` to rebuild.
 *
 * One SVG path per country, keyed by ISO 3166-1 alpha-2 (what the GA4 Data
 * API's \`countryId\` dimension returns). Equirectangular projection fitted to
 * a ${WIDTH}x${HEIGHT} viewBox, from Natural Earth 110m data (public domain).
 */

export const WORLD_VIEWBOX = '0 0 ${WIDTH} ${HEIGHT}';

export const WORLD_PATHS: Record<string, string> = ${JSON.stringify(paths, null, 0)};
`;

writeFileSync(new URL('../lib/world-map-paths.ts', import.meta.url), out);

const bytes = Buffer.byteLength(out);
console.log(`lib/world-map-paths.ts written`);
console.log(`  countries with an alpha-2 code: ${Object.keys(paths).length}`);
console.log(`  skipped (no numeric code): ${skipped.join(', ') || 'none'}`);
console.log(`  size: ${(bytes / 1024).toFixed(0)} KB`);
