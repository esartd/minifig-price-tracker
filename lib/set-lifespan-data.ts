/**
 * Empirical LEGO set lifespan data derived from historical retirement patterns.
 *
 * Sources: BrickSet retirement tracking, LEGO announcements, collector community data.
 * Key findings:
 * - Price is the #1 predictor of lifespan (expensive sets = longer shelf life)
 * - Licensed themes (Star Wars, Marvel, HP) retire faster due to licensing windows
 * - Adult-targeted lines (Icons, Architecture) have the longest lifespans
 * - Seasonal sets retire within 1 year almost universally
 * - UCS / Modular Buildings are outliers — routinely 4–6 years
 */

export interface LifespanTier {
  maxPrice: number;  // Inclusive upper bound (Infinity for the last tier)
  years: number;
}

export interface ThemeLifespan {
  // Theme name patterns to match against (case-insensitive, substring match)
  patterns: string[];
  tiers: LifespanTier[];
  // Optional override for sub-themes (checked before parent)
  subThemes?: {
    patterns: string[];
    tiers: LifespanTier[];
  }[];
}

// Ordered from most specific to most general — first match wins
export const THEME_LIFESPANS: ThemeLifespan[] = [
  // ─── Seasonal (fastest retirement ~1 year) ───────────────────────────────
  {
    patterns: ['holiday', 'seasonal', 'christmas', 'halloween', 'easter', 'valentines'],
    tiers: [
      { maxPrice: 200, years: 1 },
      { maxPrice: Infinity, years: 1.5 },
    ],
  },

  // ─── BrickHeadz (~1.5 years) ─────────────────────────────────────────────
  {
    patterns: ['brickheadz'],
    tiers: [
      { maxPrice: Infinity, years: 1.5 },
    ],
  },

  // ─── Star Wars (sub-theme splits: UCS/MBS vs playsets) ───────────────────
  {
    patterns: ['star wars'],
    subThemes: [
      {
        // UCS = Ultimate Collector Series, MBS = Master Builder Series
        patterns: ['ultimate collector', 'ucs', 'master builder'],
        tiers: [
          { maxPrice: 200, years: 3 },
          { maxPrice: 400, years: 4 },
          { maxPrice: Infinity, years: 5.5 }, // Millennium Falcon, Death Star etc
        ],
      },
    ],
    // Regular Star Wars playsets
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: 250, years: 2.5 },
      { maxPrice: Infinity, years: 3 },
    ],
  },

  // ─── Icons / Creator Expert (adult premium, long-lived) ──────────────────
  {
    patterns: ['icons', 'creator expert'],
    subThemes: [
      {
        // Modular Buildings are the longest-lived sets LEGO makes
        patterns: ['modular'],
        tiers: [
          { maxPrice: Infinity, years: 6 },
        ],
      },
      {
        patterns: ['botanical'],
        tiers: [
          { maxPrice: 100, years: 2.5 },
          { maxPrice: Infinity, years: 3.5 },
        ],
      },
    ],
    tiers: [
      { maxPrice: 100, years: 2.5 },
      { maxPrice: 200, years: 3 },
      { maxPrice: 350, years: 4 },
      { maxPrice: Infinity, years: 5 },
    ],
  },

  // ─── Architecture (premium adult, very long-lived) ────────────────────────
  {
    patterns: ['architecture'],
    tiers: [
      { maxPrice: 100, years: 3 },
      { maxPrice: 200, years: 4 },
      { maxPrice: Infinity, years: 5 },
    ],
  },

  // ─── Ideas (varies: some are 1 year, popular ones 3+) ────────────────────
  {
    patterns: ['ideas'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: 200, years: 2.5 },
      { maxPrice: Infinity, years: 3 },
    ],
  },

  // ─── Technic ─────────────────────────────────────────────────────────────
  {
    patterns: ['technic'],
    tiers: [
      { maxPrice: 50, years: 2 },
      { maxPrice: 100, years: 2 },
      { maxPrice: 200, years: 2.5 },
      { maxPrice: 350, years: 3 },
      { maxPrice: Infinity, years: 4 }, // Flagship sets like Bugatti, Cat bulldozer
    ],
  },

  // ─── Marvel / DC / Super Heroes ──────────────────────────────────────────
  {
    patterns: ['marvel', 'dc', 'super heroes'],
    subThemes: [
      {
        // Mechs and large sets are tied to movie waves — shorter
        patterns: ['mech', 'mech armor'],
        tiers: [
          { maxPrice: Infinity, years: 1.5 },
        ],
      },
    ],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: 200, years: 2 },
      { maxPrice: Infinity, years: 2.5 },
    ],
  },

  // ─── Harry Potter ────────────────────────────────────────────────────────
  {
    patterns: ['harry potter', 'wizarding world'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: 200, years: 2.5 },
      { maxPrice: Infinity, years: 3 },
    ],
  },

  // ─── Disney ──────────────────────────────────────────────────────────────
  {
    patterns: ['disney'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: 200, years: 2.5 },
      { maxPrice: Infinity, years: 3 },
    ],
  },

  // ─── Jurassic World / Jurassic Park ──────────────────────────────────────
  {
    patterns: ['jurassic'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: Infinity, years: 2 },
    ],
  },

  // ─── City / Town ─────────────────────────────────────────────────────────
  {
    patterns: ['city', 'town'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: Infinity, years: 2.5 },
    ],
  },

  // ─── NINJAGO ─────────────────────────────────────────────────────────────
  {
    patterns: ['ninjago'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: Infinity, years: 2 },
    ],
  },

  // ─── Friends ─────────────────────────────────────────────────────────────
  {
    patterns: ['friends'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: Infinity, years: 2 },
    ],
  },

  // ─── Creator (3-in-1) ────────────────────────────────────────────────────
  {
    patterns: ['creator'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: 100, years: 2 },
      { maxPrice: Infinity, years: 2 },
    ],
  },

  // ─── Speed Champions ─────────────────────────────────────────────────────
  {
    patterns: ['speed champions'],
    tiers: [
      { maxPrice: 50, years: 2 },
      { maxPrice: Infinity, years: 2.5 },
    ],
  },

  // ─── Minecraft ───────────────────────────────────────────────────────────
  {
    patterns: ['minecraft'],
    tiers: [
      { maxPrice: 50, years: 1.5 },
      { maxPrice: Infinity, years: 2 },
    ],
  },

  // ─── DUPLO ───────────────────────────────────────────────────────────────
  {
    patterns: ['duplo'],
    tiers: [
      { maxPrice: 50, years: 2 },
      { maxPrice: 100, years: 2.5 },
      { maxPrice: Infinity, years: 3 },
    ],
  },

  // ─── Botanical Collection ────────────────────────────────────────────────
  {
    patterns: ['botanical'],
    tiers: [
      { maxPrice: 100, years: 2.5 },
      { maxPrice: Infinity, years: 3.5 },
    ],
  },

  // ─── Art ─────────────────────────────────────────────────────────────────
  {
    patterns: ['art'],
    tiers: [
      { maxPrice: Infinity, years: 3 },
    ],
  },
];

// Default when no theme matches
export const DEFAULT_LIFESPAN_TIERS: LifespanTier[] = [
  { maxPrice: 50, years: 1.5 },
  { maxPrice: 100, years: 2 },
  { maxPrice: 200, years: 2.5 },
  { maxPrice: 350, years: 3 },
  { maxPrice: Infinity, years: 4 },
];

/**
 * Look up expected lifespan in years for a set given its theme and estimated price.
 * @param categoryName - BrickLink category (e.g., "Star Wars / Ultimate Collector Series")
 * @param price - Secondary market price estimate (0 = unknown)
 */
export function getExpectedLifespan(categoryName: string, price: number = 0): number {
  const lower = categoryName.toLowerCase();
  const parts = lower.split(' / ');
  const parentTheme = parts[0].trim();
  const subTheme = parts[1]?.trim() ?? '';

  for (const entry of THEME_LIFESPANS) {
    const matchesParent = entry.patterns.some(p => parentTheme.includes(p));
    if (!matchesParent) continue;

    // Check sub-themes first (more specific)
    if (entry.subThemes && subTheme) {
      for (const sub of entry.subThemes) {
        if (sub.patterns.some(p => subTheme.includes(p) || lower.includes(p))) {
          return lookupTier(sub.tiers, price);
        }
      }
    }

    return lookupTier(entry.tiers, price);
  }

  return lookupTier(DEFAULT_LIFESPAN_TIERS, price);
}

function lookupTier(tiers: LifespanTier[], price: number): number {
  for (const tier of tiers) {
    if (price <= tier.maxPrice) return tier.years;
  }
  return tiers[tiers.length - 1].years;
}
