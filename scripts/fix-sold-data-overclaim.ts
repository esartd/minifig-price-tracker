/**
 * Corrects an overclaim in the published `figtracker-vs-brickeconomy` article.
 *
 * The article previously implied FigTracker's suggested price is built
 * primarily from "real sold data / actual transactions," contrasted with
 * BrickEconomy's "listing prices." Per PRICING_SYSTEM.md, the actual formula
 * is SUGGESTED = BL_component * 0.95 + eBay_component * 0.05, where
 * BL_component averages three things (sold avg, current stock avg, current
 * lowest) -- so real sold data is only ~1 of the several inputs, not the
 * primary basis. This script rewords the specific overclaiming blocks to
 * accurately describe the blended, multi-signal approach, and links out to
 * the new /how-we-calculate-prices page for the full breakdown.
 *
 * Follows the same read-modify-write pattern as scripts/fix-pricing-claim.ts.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

const REPLACEMENTS: Array<{ match: string; replacement: string }> = [
  {
    match: 'Uses real BrickLink sold data',
    replacement: 'Blends real sold data with current listings',
  },
  {
    match: "You want **real sold data**, not optimistic listing prices",
    replacement: "You want a price built from more than just optimistic listing prices",
  },
  {
    match: 'FigTracker solves this by pulling **real BrickLink sold data** and giving you transparent, honest pricing. No fake appreciation predictions. No subscription paywalls. Just fast, accurate market data you can trust.',
    replacement: "FigTracker solves this by blending real sold history with current listings and an eBay cross-check, giving you transparent, honest pricing. No fake appreciation predictions. No subscription paywalls. Just fast, accurate market data you can trust. [See exactly how the formula works](/how-we-calculate-prices).",
  },
  {
    match: 'We pull data directly from the BrickLink API, including both current marketplace listings (stock) and historical sales (sold). This gives you real transaction data, not just asking prices.',
    replacement: "We pull data directly from the BrickLink API, including both current marketplace listings (stock) and historical sales (sold), then blend in an eBay cross-check. The result reflects more than just asking prices. [See our full pricing breakdown](/how-we-calculate-prices) for exactly how it works.",
  },
  {
    match: 'For minifigure pricing, yes. FigTracker uses real BrickLink sold data (actual transactions) while BrickEconomy relies more on listing prices (asking prices). For sellers who need to know what items will *actually* sell for, FigTracker provides more realistic pricing.',
    replacement: "FigTracker computes a single blended price from sold history, current listings, and an eBay cross-check, rather than relying on one signal the way a listings-only price would. For sellers who need a realistic number to work from, that blended approach can be more useful. [See our full pricing breakdown](/how-we-calculate-prices) for exactly how it works.",
  },
];

const DESCRIPTION_REPLACEMENTS: Record<string, { match: string; replacement: string }> = {
  en: {
    match: 'Learn why FigTracker uses real sold data instead of listing prices',
    replacement: 'Learn how FigTracker blends sold history with current listings',
  },
  de: {
    match: 'Erfahren Sie, warum FigTracker echte Verkaufsdaten verwendet.',
    replacement: 'Erfahren Sie, wie FigTracker echte Verkaufsdaten mit aktuellen Angeboten kombiniert.',
  },
};

async function main() {
  console.log('📝 Correcting sold-data overclaim in BrickEconomy article...\n');

  const slug = 'figtracker-vs-brickeconomy';
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article) {
    console.error('❌ Article not found -- nothing to fix.');
    process.exit(1);
  }

  const contentBlocks = JSON.parse(article.contentBlocks as string);
  let blockMatches = 0;

  const updatedBlocks = contentBlocks.map((block: any) => {
    let changed = { ...block };
    let didChange = false;

    // Comparison block: pros list
    if (block.type === 'comparison' && Array.isArray(block.items)) {
      changed.items = block.items.map((item: any) => {
        if (!Array.isArray(item.pros)) return item;
        const newPros = item.pros.map((p: string) => {
          const hit = REPLACEMENTS.find(r => p === r.match);
          if (hit) { didChange = true; blockMatches++; return hit.replacement; }
          return p;
        });
        return { ...item, pros: newPros };
      });
    }

    // List block: bullet items
    if (block.type === 'list' && Array.isArray(block.items)) {
      changed.items = block.items.map((li: string) => {
        const hit = REPLACEMENTS.find(r => li === r.match);
        if (hit) { didChange = true; blockMatches++; return hit.replacement; }
        return li;
      });
    }

    // Paragraph blocks
    if (block.type === 'paragraph' && typeof block.text === 'string') {
      const hit = REPLACEMENTS.find(r => block.text === r.match);
      if (hit) { didChange = true; blockMatches++; changed.text = hit.replacement; }
    }

    if (didChange) {
      console.log(`  ✓ Updated block ${block.id} (${block.type})`);
    }
    return changed;
  });

  if (blockMatches === 0) {
    console.warn('⚠️  No matching blocks found -- the article text may have already changed since this script was written. Inspect contentBlocks manually before re-running.');
  }

  // Fix the meta description(s) inside the translations array too
  const translations = JSON.parse(article.translations as string);
  let descMatches = 0;
  const updatedTranslations = translations.map((tr: any) => {
    const fix = DESCRIPTION_REPLACEMENTS[tr.locale];
    if (fix && tr.description?.includes(fix.match)) {
      descMatches++;
      return { ...tr, description: tr.description.replace(fix.match, fix.replacement) };
    }
    return tr;
  });

  if (blockMatches === 0 && descMatches === 0) {
    console.log('\nNo changes made. Exiting without writing.');
    return;
  }

  await prisma.article.update({
    where: { slug },
    data: {
      contentBlocks: JSON.stringify(updatedBlocks),
      translations: JSON.stringify(updatedTranslations),
    },
  });

  console.log(`\n✅ Done. ${blockMatches} content block(s) and ${descMatches} description(s) updated.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
