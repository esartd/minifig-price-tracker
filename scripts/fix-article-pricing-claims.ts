/**
 * Correct the "free, no subscription" claims now that Premium exists.
 *
 * Five articles told readers the site is free with no subscription required,
 * and the BrickEconomy comparison used that as its closing argument against a
 * paywalled competitor. Premium has since launched at $4.99/month, so every one
 * of those lines was false -- and a reader who clicked "Premium" in the nav
 * immediately after reading "no subscription paywalls" would notice.
 *
 * The replacement is not weaker. Pricing -- the thing people come for -- really
 * is free and needs no account, and Premium only adds seller tooling (deal
 * alerts, bulk listing, Minifig Scan). Saying that precisely is a better
 * argument than "it's all free", because it is one the reader can verify.
 *
 * Claims about what BrickEconomy charges are softened at the same time. We do
 * not control their pricing page and an out-of-date assertion about a
 * competitor is worse than a vague one.
 *
 *   npx tsx --env-file=.env.local scripts/fix-article-pricing-claims.ts          # dry run
 *   npx tsx --env-file=.env.local scripts/fix-article-pricing-claims.ts --apply
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

interface Fix {
  slug: string;
  blockId: string;
  field: 'text' | 'content';
  expect: string;
  replacement: string;
}

const FIXES: Fix[] = [
  {
    slug: 'intobrick-vs-bricklink',
    blockId: 'block-12',
    field: 'text',
    expect: 'IntoBrick is a free LEGO minifigure price tracker',
    replacement:
      'IntoBrick is a LEGO minifigure price tracker built specifically for sellers and collectors who need quick, accurate pricing without the complexity. Looking up prices is free and needs no account.',
  },
  {
    slug: 'intobrick-vs-brickeconomy',
    blockId: 'block-30',
    field: 'text',
    expect: 'Free to Use',
    replacement: 'Free to Look Up Prices',
  },
  {
    slug: 'intobrick-vs-brickeconomy',
    blockId: 'block-31',
    field: 'text',
    expect: 'currently free to use with no subscription required',
    replacement:
      'Looking up any minifigure or set on IntoBrick is free and needs no account. Premium ($4.99/month) adds seller tooling — daily deal alerts, one-step bulk listing, and identifying a minifigure from a photo — but it does not gate the pricing itself. The number you came for is not behind a paywall.',
  },
  {
    slug: 'intobrick-vs-brickeconomy',
    blockId: 'block-45',
    field: 'text',
    expect: 'No subscription paywalls',
    replacement:
      'IntoBrick solves this by blending real sold history with current listings and an eBay cross-check, giving you transparent, honest pricing. No fake appreciation predictions, and no paywall on the price itself — Premium adds seller tools, not access to the data.',
  },
  {
    slug: 'intobrick-vs-brickeconomy',
    blockId: 'block-49',
    field: 'text',
    expect: 'Is IntoBrick free to use?',
    replacement: 'Is IntoBrick free?',
  },
  {
    slug: 'intobrick-vs-brickeconomy',
    blockId: 'block-50',
    field: 'text',
    expect: 'currently free to use with no subscription required',
    replacement:
      'Yes, for what most people need: looking up prices for any minifigure or set is free and needs no account. Premium costs $4.99/month and adds daily deal alerts, one-step bulk listing, and photo identification. Pricing data itself is never gated.',
  },
  {
    slug: 'how-to-price-lego-minifigures',
    blockId: 'block-64',
    field: 'text',
    expect: '**Currently free to use** with no subscription or paywall',
    replacement:
      'Instead of spending 5 minutes per minifig calculating prices, you get an instant suggested price. **Looking up prices is free** and needs no account; Premium ($4.99/month) adds bulk listing and other seller tools.',
  },
  {
    slug: 'selling-lego-on-bricklink',
    blockId: 'block-95',
    field: 'text',
    expect: '**Currently free to use.**',
    replacement:
      'Instead of opening Bricklink price guides for every single item (which takes 2-3 minutes each), IntoBrick gives you accurate prices in seconds. **Looking up prices is free.** Premium ($4.99/month) adds one-step bulk listing if you are moving a lot of inventory.',
  },
  {
    slug: 'how-to-grade-lego-condition',
    blockId: 'block-95',
    field: 'text',
    expect: '**Currently free to use** with no subscription required',
    replacement:
      '**Looking up prices is free** and needs no account. Premium ($4.99/month) adds seller tools on top.',
  },
];

async function main() {
  console.log(APPLY ? '\nFIXING PRICING CLAIMS\n' : '\nDRY RUN (pass --apply to write)\n');

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
      const current = block ? String(block[fix.field] ?? '') : '';

      if (!block || !current.includes(fix.expect)) {
        console.log(`  ${fix.blockId}: expected text not present -- REFUSED`);
        refused++;
        continue;
      }

      console.log(`  ${fix.blockId}: ${current.replace(/\s+/g, ' ').slice(0, 88)}`);
      console.log(`           -> ${fix.replacement.replace(/\s+/g, ' ').slice(0, 88)}`);
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

  console.log(`\n${applied} edits ${APPLY ? 'written' : 'staged'}, ${refused} refused.\n`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
