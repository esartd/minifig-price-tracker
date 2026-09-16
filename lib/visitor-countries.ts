import 'server-only';

/**
 * Which countries the site has had visitors from, read from Google Analytics.
 *
 * GA already holds this, going back to launch, so nothing new is tracked to
 * build the map -- no new cookie, no IP logging, no GeoIP database on the VPS.
 * This reads an aggregate that is already collected. Country counts only:
 * never a city, never a session, never anything that narrows to a person.
 *
 * NOT the Realtime API, deliberately. `runRealtimeReport` covers a rolling
 * 30-minute window, which on a site this size shows zero or one dot for most
 * of the day -- an empty map reads worse than no map. All-time is both more
 * impressive and cheaper: it changes slowly, so it caches for hours.
 *
 * Degrades to null rather than throwing. Missing credentials is the NORMAL
 * state on a dev machine and during any window where the service account has
 * not been granted access yet; the page simply renders without the map.
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

export interface CountryVisitors {
  /** ISO 3166-1 alpha-2, matching the keys of WORLD_PATHS. */
  code: string;
  name: string;
  users: number;
}

export interface VisitorCountriesData {
  countries: CountryVisitors[];
  totalCountries: number;
  totalUsers: number;
  fetchedAt: string;
}

/**
 * Cached in module scope for six hours.
 *
 * The GA Data API bills against a per-property token budget that a public page
 * would burn through in an afternoon if every visit queried it. Six hours is
 * chosen because the underlying number -- how many countries have EVER visited
 * -- moves a handful of times a year. There is nothing to see by asking more
 * often.
 *
 * Module scope means one cache per Node process, so a PM2 restart re-fetches.
 * That is fine at one query per process per six hours; a shared cache table
 * would be more machinery than the problem deserves.
 */
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
let cache: { data: VisitorCountriesData; at: number } | null = null;
/** De-duplicates concurrent misses so a cold start fires one query, not fifty. */
let inFlight: Promise<VisitorCountriesData | null> | null = null;

function getClient(): BetaAnalyticsDataClient | null {
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (!raw || !process.env.GA4_PROPERTY_ID) return null;

  try {
    const credentials = JSON.parse(raw);
    return new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        // Stored in .env with literal \n, because a real newline would end the
        // env var at the first line of the key.
        private_key: String(credentials.private_key || '').replace(/\\n/g, '\n'),
      },
    });
  } catch {
    // A malformed key is a config mistake, not a reason to 500 the page.
    console.error('[visitor-countries] GA4_SERVICE_ACCOUNT_JSON is not valid JSON');
    return null;
  }
}

/**
 * Sample data so the map can be looked at on a dev machine, which has no GA
 * credentials and never will. Guarded on NODE_ENV as well as the flag, so
 * setting the variable on the VPS by accident cannot put invented numbers on
 * the live page.
 */
function fakeData(): VisitorCountriesData {
  // Shaped like the real distribution -- a steep head and a long tail of
  // one-visitor countries -- so the banding looks the same locally as it does
  // in production. A flat sample put every country in the top band and made
  // the shading look broken when it was not.
  const codes = [
    'US','SG','GB','DE','NL','FR','CA','SE','PL','AU','IT','ES','BE','CH','AT',
    'DK','NO','FI','IE','PT','CZ','NZ','JP','BR','MX','MY','PH','IN','ZA','AR',
    'CL','KR','TW','TH','ID','VN','TR','GR','RO','HU','IL','AE','SA','UA','HR',
    'BG','SK','SI','EE','LV','LT','RS','IS','LU','MT','CY','CO','PE','UY','CR',
    'PA','EC','DO','GT','KE','NG','EG','MA','PK','BD','LK','NP','KH','QA','KW',
  ];
  const curve = (i: number) => {
    if (i === 0) return 1455;
    if (i === 1) return 1011;
    if (i < 6) return 150 - i * 8;
    if (i < 19) return 95 - (i - 6) * 5;
    if (i < 33) return 29 - (i - 19) * 1.4;
    if (i < 60) return 9 - Math.floor((i - 33) / 5);
    return i % 2 === 0 ? 2 : 1;
  };
  const countries = codes.map((code, i) => ({
    code,
    name: code,
    users: Math.max(1, Math.round(curve(i))),
  }));
  return {
    countries,
    totalCountries: countries.length,
    totalUsers: countries.reduce((s, c) => s + c.users, 0),
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchFromGA(): Promise<VisitorCountriesData | null> {
  if (process.env.NODE_ENV !== 'production' && process.env.GA4_FAKE_COUNTRIES === '1') {
    return fakeData();
  }

  const client = getClient();
  if (!client) return null;

  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      // 2020-01-01 rather than a real launch date: GA clamps a start date that
      // predates the property to the property's own creation, so this means
      // "everything you have" without hard-coding a date that would need
      // finding again.
      dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
      // countryId is the ISO 3166-1 alpha-2 code; `country` is a display name
      // that varies by the property's reporting locale and would not join to
      // the map paths.
      dimensions: [{ name: 'countryId' }, { name: 'country' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 300,
    });

    const countries: CountryVisitors[] = [];
    let totalUsers = 0;

    for (const row of response.rows ?? []) {
      const code = row.dimensionValues?.[0]?.value ?? '';
      const name = row.dimensionValues?.[1]?.value ?? '';
      const users = Number(row.metricValues?.[0]?.value ?? 0);

      // GA returns "(not set)" for traffic it could not place, with a code of
      // "(not set)" rather than a country. It is real traffic but it cannot go
      // on a map, and counting it as a country would inflate the headline.
      if (!code || code.length !== 2 || users <= 0) continue;

      countries.push({ code, name, users });
      totalUsers += users;
    }

    return {
      countries,
      totalCountries: countries.length,
      totalUsers,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[visitor-countries] GA query failed:', error);
    return null;
  }
}

/* ------------------------------------------------------------------------ *
 * US states
 *
 * Only the United States gets a subdivision map, and that is a data decision
 * rather than a design one. Measured across every large-land country:
 *
 *   United States  50/51  98%      Brazil      8/27  30%
 *   Mexico         22/32  69%      India       9/36  25%
 *   Australia       5/8   63%      Argentina   3/24  13%
 *   Canada          8/13  62%      Russia      3/83   4%
 *   China          16/34  47%
 *
 * Land area and visitor spread point in opposite directions, so subdividing
 * the biggest countries is exactly the wrong move. Russia is the proof: the
 * largest shape on the world map, solid blue today, would become three regions
 * out of eighty-three. Splitting it would make the map look emptier, not more
 * detailed.
 *
 * Revisit another country when it passes ~90% of its subdivisions. Rerun the
 * region query and compare against its real subdivision count -- coverage is
 * what decides this, not visitor totals: Mexico has more regions covered than
 * Canada but a median of 2 users in each.
 * ------------------------------------------------------------------------ */

export interface StateVisitors {
  /** Full state name, matching the keys of US_PATHS. */
  name: string;
  users: number;
}

export interface VisitorStatesData {
  states: StateVisitors[];
  totalStates: number;
  totalUsers: number;
  /** The busiest state's count, so the component can scale its shading. */
  maxUsers: number;
}

let stateCache: { data: VisitorStatesData; at: number } | null = null;
let stateInFlight: Promise<VisitorStatesData | null> | null = null;

async function fetchStatesFromGA(): Promise<VisitorStatesData | null> {
  if (process.env.NODE_ENV !== 'production' && process.env.GA4_FAKE_COUNTRIES === '1') {
    const sample = [
      ['California', 174], ['Virginia', 133], ['New York', 118], ['Oregon', 112],
      ['Illinois', 107], ['Florida', 106], ['Colorado', 93], ['Texas', 70],
      ['Iowa', 61], ['Georgia', 55], ['Washington', 55], ['New Jersey', 54],
      ['Massachusetts', 34], ['Utah', 34], ['Arizona', 30], ['Ohio', 22],
      ['Pennsylvania', 20], ['Michigan', 18], ['Minnesota', 15], ['Nevada', 12],
    ] as const;
    const states = sample.map(([name, users]) => ({ name, users }));
    return {
      states,
      totalStates: states.length,
      totalUsers: states.reduce((s, x) => s + x.users, 0),
      maxUsers: 174,
    };
  }

  const client = getClient();
  if (!client) return null;

  try {
    // A second report rather than adding `region` to the country one. Summing
    // totalUsers across (country, region) rows would not give the same country
    // totals -- GA de-duplicates users per row, so anyone who visited from two
    // regions counts twice in the sum. Two queries every six hours is nothing.
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
      dimensions: [{ name: 'country' }, { name: 'region' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 400,
    });

    const states: StateVisitors[] = [];
    let totalUsers = 0;
    let maxUsers = 0;

    for (const row of response.rows ?? []) {
      if ((row.dimensionValues?.[0]?.value ?? '') !== 'United States') continue;
      const name = row.dimensionValues?.[1]?.value ?? '';
      const users = Number(row.metricValues?.[0]?.value ?? 0);
      // GA reports "(not set)" for traffic it could not place to a region.
      if (!name || name === '(not set)' || users <= 0) continue;

      states.push({ name, users });
      totalUsers += users;
      if (users > maxUsers) maxUsers = users;
    }

    return { states, totalStates: states.length, totalUsers, maxUsers };
  } catch (error) {
    console.error('[visitor-countries] GA state query failed:', error);
    return null;
  }
}

export async function getVisitorStates(): Promise<VisitorStatesData | null> {
  if (stateCache && Date.now() - stateCache.at < CACHE_TTL_MS) return stateCache.data;
  if (stateInFlight) return stateInFlight;

  stateInFlight = fetchStatesFromGA()
    .then((data) => {
      if (data) stateCache = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      stateInFlight = null;
    });

  const fresh = await stateInFlight;
  return fresh ?? stateCache?.data ?? null;
}

export async function getVisitorCountries(): Promise<VisitorCountriesData | null> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  if (inFlight) return inFlight;

  inFlight = fetchFromGA()
    .then((data) => {
      if (data) cache = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      inFlight = null;
    });

  // A failed fetch returns null and leaves any existing cache in place, so a
  // transient GA outage shows yesterday's map rather than removing it.
  const fresh = await inFlight;
  return fresh ?? cache?.data ?? null;
}

// ---------------------------------------------------------------------------
// Traffic summary — the top of the admin funnel
// ---------------------------------------------------------------------------

export type TrafficWindow = {
  /** Distinct people, all channels — including whatever is automated. */
  users: number;
  sessions: number;
  pageViews: number;
  /**
   * Sessions arriving from a search engine.
   *
   * The honest denominator for "what share of visitors sign up". Direct
   * traffic on this site is overwhelmingly automated — on 15 September 2026 it
   * was 950 of 1,348 sessions, landing straight on /auth/signin and bouncing
   * at 98%, which is a scanner and not a person. Dividing signups by the
   * all-channel total made a normal conversion rate look like a catastrophe.
   *
   * Organic is not a perfect filter, but a bot that arrives with a Google
   * referrer is rare, and it is far closer to the truth than the total.
   */
  organicSessions: number;
};

export type TrafficSummary = {
  last7Days: TrafficWindow;
  last30Days: TrafficWindow;
  fetchedAt: string;
};

/**
 * Visitors, sessions and page views for the last 7 and 30 days.
 *
 * This is the first stage of the admin funnel (visitors → signups → Premium →
 * affiliate clicks). Without it the funnel has no denominator and the only
 * question it can answer is "how many", never "what share".
 *
 * ## Why this is not a database counter
 *
 * The obvious alternative was to write a `pricing_viewed` row per page view.
 * That is one INSERT for every visit, including every crawler hit — and on
 * 15 September 2026 Googlebot working through ~420,000 URLs took this site
 * down without any help from us. A per-view write would have made that worse
 * and would have counted bots as people besides. GA already has this number,
 * already excludes most bots, and costs nothing per page view.
 *
 * Same six-hour module-scope cache and in-flight de-duplication as
 * getVisitorCountries above, for the same reasons: the GA Data API bills
 * against a per-property token budget, and traffic totals do not move fast
 * enough to be worth asking more often.
 */
const trafficTtlMs = 6 * 60 * 60 * 1000;
let trafficCache: { data: TrafficSummary; at: number } | null = null;
let trafficInFlight: Promise<TrafficSummary | null> | null = null;

async function fetchTrafficFromGA(): Promise<TrafficSummary | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      // Two ranges in one request rather than two requests: GA returns a
      // dateRange dimension to tell them apart, and it is one token instead
      // of two against the same budget.
      dateRanges: [
        { startDate: '7daysAgo', endDate: 'today', name: 'last7' },
        { startDate: '30daysAgo', endDate: 'today', name: 'last30' },
      ],
      // Channel as a dimension so organic can be separated from the rest.
      // GA returns one row per (dateRange, channel) pair.
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    });

    const blank = (): TrafficWindow => ({
      users: 0,
      sessions: 0,
      pageViews: 0,
      organicSessions: 0,
    });
    const windows: Record<string, TrafficWindow> = {
      last7: blank(),
      last30: blank(),
    };

    for (const row of response.rows ?? []) {
      // Requested dimensions come first; GA appends the dateRange name last.
      const channel = row.dimensionValues?.[0]?.value ?? '';
      const range = row.dimensionValues?.[1]?.value ?? 'last7';
      const target = windows[range];
      if (!target) continue;

      const users = Number(row.metricValues?.[0]?.value ?? 0);
      const sessions = Number(row.metricValues?.[1]?.value ?? 0);
      const pageViews = Number(row.metricValues?.[2]?.value ?? 0);

      // Rows are per channel now, so these accumulate rather than assign.
      target.users += users;
      target.sessions += sessions;
      target.pageViews += pageViews;
      if (channel === 'Organic Search') target.organicSessions += sessions;
    }

    return {
      last7Days: windows.last7,
      last30Days: windows.last30,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[traffic] GA fetch failed:', error);
    return null;
  }
}

export async function getTrafficSummary(): Promise<TrafficSummary | null> {
  if (trafficCache && Date.now() - trafficCache.at < trafficTtlMs) {
    return trafficCache.data;
  }
  if (trafficInFlight) return trafficInFlight;

  trafficInFlight = fetchTrafficFromGA()
    .then((data) => {
      if (data) trafficCache = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      trafficInFlight = null;
    });

  // A failed fetch keeps the previous numbers rather than blanking the funnel.
  const fresh = await trafficInFlight;
  return fresh ?? trafficCache?.data ?? null;
}
