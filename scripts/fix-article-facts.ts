/**
 * Correct factual errors in the published articles.
 *
 * Run before translating them: a wrong fact translated into nine languages is
 * nine wrong facts, and they are much harder to find afterwards.
 *
 * Every change below was checked against a primary source -- BrickLink's own
 * fee page, BrickLink/Brickset/BrickEconomy catalogue entries, or this site's
 * own PriceCache -- and the source is named in the note on each edit.
 *
 * Two habits applied throughout:
 *
 * 1. **Ranges, not single numbers, and a stated month.** Minifigure values
 *    move. An undated "$3,000+" reads as a fact forever; "roughly $X-$Y as of
 *    September 2026" ages honestly.
 * 2. **Link to our own item page.** The live price is on it, so the article
 *    degrades gracefully as values drift -- and it is an internal link to a
 *    page we want crawled.
 *
 *   npx tsx --env-file=.env.local scripts/fix-article-facts.ts          # dry run
 *   npx tsx --env-file=.env.local scripts/fix-article-facts.ts --apply
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

interface Fix {
  slug: string;
  blockId: string;
  /** Which field carries the prose: paragraph/heading use `text`, callout uses `content`. */
  field: 'text' | 'content';
  /** Must appear in the current value, or the fix refuses to apply. */
  expect: string;
  replacement: string;
  why: string;
}

const FIXES: Fix[] = [
  // ---------------------------------------------------------------- pricing
  {
    slug: 'how-to-price-lego-minifigures',
    blockId: 'block-47',
    field: 'content',
    // Must be unique to the OLD text. Plain 'sw0209' would also match the
    // replacement, which mentions sw0209 deliberately as the contrast case --
    // so a re-run reported this as still needing a fix when it did not.
    expect: 'Chrome Darth Vader (sw0209) is worth',
    replacement:
      "**Example:** [Chrome Darth Vader (sw0218)](/minifigs/sw0218) — a 2009 promotional figure limited to 10,000 — sells for roughly $300-$600 used and over $1,000 sealed as of September 2026. Regular Darth Vader variants are $5-$25. Note that sw0209 is an ordinary 2008 Vader worth about $20: one wrong character in the ID is a massive pricing error.",
    why:
      'The ID was wrong, in a callout warning about wrong IDs. sw0209 is "Darth Vader (Death Star Torso)", 2008, $22.01 suggested on our own site. Chrome Black Darth Vader is sw0218. The "$3,000+" figure was also inflated -- Brickset has it at ~$580 new / ~$324 used, BrickEconomy ~$520, with sealed polybags reaching ~$1,300.',
  },
  {
    slug: 'how-to-price-lego-minifigures',
    blockId: 'block-44',
    field: 'text',
    expect: '13.25% + PayPal fees',
    replacement:
      "eBay's final value fee is about 13.25% in most categories, and since eBay moved to managed payments that figure already includes payment processing — there is no separate PayPal fee to add. Bricklink charges a tiered commission (3% of the first $500 of an order, 2% of the next $500, 1% above that) and you pay your payment processor separately. Factor these in or you'll lose money.",
    why:
      'eBay has run managed payments since 2021, so "13.25% + PayPal fees" double-counts processing and would make a seller overprice. BrickLink\'s tiers are from their own fee page (help.asp?helpID=38).',
  },

  // ---------------------------------------------------------------- selling
  {
    slug: 'selling-lego-on-bricklink',
    blockId: 'block-102',
    field: 'text',
    expect: '3% on sales for Basic stores, 5% for Featured stores',
    replacement:
      "Bricklink's commission is tiered by order value, not by store type: 3% of the first $500 of an order, 2% of the next $500, and 1% on anything above $1,000. Payment processing is separate and typically adds about 3%. All-in you are usually paying 5-6%, against roughly 13.25% on eBay.",
    why:
      'There is no Basic/Featured fee split in BrickLink\'s published fee structure; it is tiered by order total. Taken from BrickLink\'s own help page rather than a third-party blog, because the blogs disagree (several claim a flat 5%).',
  },

  // ------------------------------------------------------- most valuable
  {
    slug: 'most-valuable-lego-minifigures-2026',
    blockId: 'block-1',
    field: 'text',
    expect: '18,732 LEGO minifigures',
    replacement:
      "After analyzing pricing data from more than 19,000 LEGO minifigures across the entire Bricklink catalog, we've identified the most valuable collectibles on the market today. Whether you're a serious collector, investor, or just curious about LEGO values, this comprehensive guide reveals which minifigs command premium prices and why.",
    why:
      'The catalogue held 18,732 minifigures when this was written in April; it now holds 19,246 and grows twice a month. "More than 19,000" stays true as it grows instead of going stale the next time BrickLink publishes an export.',
  },
  {
    slug: 'most-valuable-lego-minifigures-2026',
    blockId: 'block-18',
    field: 'text',
    expect: '$3,000-$5,000 in mint condition',
    replacement:
      '**[Cloud City Boba Fett (sw0107)](/minifigs/sw0107)** — released in 2003 in set 10123 and often called the holy grail of Star Wars minifigures. Expect roughly $1,300 used and $2,400-$3,000 in mint condition as of September 2026.',
    why:
      'Brickset has it at ~$2,421 new / ~$1,296 used and BrickEconomy at ~$3,008, so the $3,000-$5,000 range overstated the top end and gave no used figure at all. Adding the item number and a link means a reader can check the current price themselves.',
  },
  {
    slug: 'most-valuable-lego-minifigures-2026',
    blockId: 'block-19',
    field: 'text',
    expect: 'Rare variants command $1,500-$2,500',
    replacement:
      '**[Chrome Darth Vader (sw0218)](/minifigs/sw0218)** — a 2009 promotional release limited to 10,000 pieces, and still the only minifigure made with chrome black elements. Roughly $300-$600 used and $1,000-$1,300 sealed as of September 2026.',
    why:
      'The $1,500-$2,500 range was above every source: Brickset ~$580 new / ~$324 used, BrickEconomy ~$520 six-month average, sealed polybags ~$1,200-$1,300 on eBay. The figure also had no item number, which is what led the other article to cite the wrong one.',
  },
  {
    slug: 'most-valuable-lego-minifigures-2026',
    blockId: 'block-20',
    field: 'text',
    expect: '**14k Gold C-3PO** - Only 10,000 produced',
    replacement:
      "**[Chrome Gold C-3PO (sw0158)](/minifigs/sw0158)** — 10,000 were made for the Star Wars 30th anniversary in 2007 and randomly inserted into that year's sets, at roughly 250-to-1 odds. Around $1,200 used and $1,900 new as of September 2026. Do not confuse it with the solid 14k gold C-3PO: only **five** of those exist, made as prizes for a 2007 competition, and they change hands for tens of thousands of dollars.",
    why:
      'This conflated two different figures. The 10,000 production run and the $1,000-$2,000 value belong to the chrome gold C-3PO (sw0158); the 14k solid gold version had five made and is valued far higher. Naming the cheap one "14k Gold" is the single most misleading line in these articles.',
  },
  {
    slug: 'most-valuable-lego-minifigures-2026',
    blockId: 'block-21',
    field: 'text',
    expect: 'regularly sells for $3,000-$5,000',
    replacement:
      '**[Mr. Gold (col161)](/minifigs/col161)** — not Star Wars, but the one to know about. Only 5,000 were made and hidden at random in Collectible Minifigures Series 10 in 2013. Around $1,500 used, and $8,000 or more for a sealed example as of September 2026.',
    why:
      'The 5,000 production figure was right but the value was badly understated for mint examples -- Brickset has new at ~$8,299 and BrickEconomy around $9,000-$9,700, against the article\'s $3,000-$5,000. Used is ~$1,525, so the spread is the story.',
  },
];

async function main() {
  console.log(APPLY ? '\nFIXING ARTICLE FACTS\n' : '\nDRY RUN (pass --apply to write)\n');

  const bySlug = new Map<string, Fix[]>();
  for (const f of FIXES) {
    if (!bySlug.has(f.slug)) bySlug.set(f.slug, []);
    bySlug.get(f.slug)!.push(f);
  }

  let applied = 0;
  let refused = 0;

  for (const [slug, fixes] of bySlug) {
    const [row] = await prisma.$queryRawUnsafe<{ contentBlocks: string }[]>(
      'SELECT contentBlocks FROM Article WHERE slug = ?',
      slug
    );
    if (!row) {
      console.log(`  ${slug}: NOT FOUND`);
      continue;
    }

    const blocks: any[] = JSON.parse(row.contentBlocks);
    console.log(`\n${slug}`);

    for (const fix of fixes) {
      const block = blocks.find((b) => b.id === fix.blockId);
      if (!block) {
        console.log(`  ${fix.blockId}: block missing -- REFUSED`);
        refused++;
        continue;
      }

      const current = String(block[fix.field] ?? '');
      if (!current.includes(fix.expect)) {
        // Either already fixed, or the text moved. Either way, do not guess.
        console.log(`  ${fix.blockId}: expected text not present -- REFUSED (already fixed?)`);
        refused++;
        continue;
      }

      console.log(`  ${fix.blockId}:`);
      console.log(`    why: ${fix.why}`);
      console.log(`    was: ${current.replace(/\s+/g, ' ').slice(0, 150)}`);
      console.log(`    now: ${fix.replacement.replace(/\s+/g, ' ').slice(0, 150)}`);

      block[fix.field] = fix.replacement;
      applied++;
    }

    if (APPLY) {
      await prisma.$executeRawUnsafe(
        'UPDATE Article SET contentBlocks = ? WHERE slug = ?',
        JSON.stringify(blocks),
        slug
      );
    }
  }

  console.log(
    `\n${applied} edits ${APPLY ? 'written' : 'staged'}, ${refused} refused.` +
      (APPLY ? '\n' : '\nNothing written.\n')
  );
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
