import { PrismaClient } from '@prisma/client-hostinger';
import { ArticleBlock } from '../types/article';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

const slug = 'how-to-price-lego-minifigures';

// English content
const contentBlocksEN: ArticleBlock[] = [
  {
    id: 'block-1',
    type: 'paragraph',
    text: 'Pricing LEGO minifigures can feel overwhelming. You check Bricklink and see multiple numbers: quantity-weighted average, simple average, minimum price, maximum price. Which one do you use? How do you factor in condition? What about rare variants?',
  },
  {
    id: 'block-2',
    type: 'paragraph',
    text: 'Whether you\'re selling your childhood collection on eBay, listing inventory on Bricklink, or just curious about your minifigures\' value, understanding how to price correctly is essential. Price too high and nothing sells. Price too low and you leave money on the table.',
  },
  {
    id: 'block-3',
    type: 'paragraph',
    text: 'This guide breaks down everything you need to know about LEGO minifigure pricing, from understanding marketplace data to making smart pricing decisions.',
  },
  {
    id: 'block-4',
    type: 'heading',
    level: 2,
    text: 'Understanding Bricklink Price Data',
  },
  {
    id: 'block-5',
    type: 'paragraph',
    text: 'Bricklink is the gold standard for LEGO pricing data. It\'s the world\'s largest LEGO marketplace with millions of transactions. When you look up a minifigure on Bricklink, you\'ll see several price metrics:',
  },
  {
    id: 'block-6',
    type: 'heading',
    level: 3,
    text: 'Quantity-Weighted Average',
  },
  {
    id: 'block-7',
    type: 'paragraph',
    text: 'This calculates the average price based on how many units sold at each price point. If 10 minifigs sold at $5 and 2 sold at $20, the weighted average gives more weight to the $5 price since more units moved at that price.',
  },
  {
    id: 'block-8',
    type: 'callout',
    calloutType: 'info',
    content: '**Why it matters:** Quantity-weighted average represents real market behavior. It shows what price point actually moves inventory.',
  },
  {
    id: 'block-9',
    type: 'heading',
    level: 3,
    text: 'Simple Average (Mean Price)',
  },
  {
    id: 'block-10',
    type: 'paragraph',
    text: 'This adds all sale prices and divides by the number of transactions. Every sale counts equally, regardless of quantity. A $100 sale of 1 minifig has the same weight as a $5 sale of 1 minifig.',
  },
  {
    id: 'block-11',
    type: 'paragraph',
    text: 'Simple averages tend to be higher than quantity-weighted averages because outlier high prices (collectors paying premium for rare variants) pull the average up.',
  },
  {
    id: 'block-12',
    type: 'heading',
    level: 3,
    text: 'Minimum & Maximum Prices',
  },
  {
    id: 'block-13',
    type: 'paragraph',
    text: 'These show the lowest and highest recent sale prices. Useful for understanding the price range, but extreme outliers (damaged items, rare variants, or errors) can skew these numbers.',
  },
  {
    id: 'block-14',
    type: 'heading',
    level: 3,
    text: 'Current Listings vs Recent Sales',
  },
  {
    id: 'block-15',
    type: 'paragraph',
    text: 'This is crucial: **listing prices show what sellers hope to get, not what buyers actually pay.** Always prioritize recent sales data over current listings.',
  },
  {
    id: 'block-16',
    type: 'callout',
    calloutType: 'warning',
    content: '**Common mistake:** Pricing based on the highest current listing. Just because someone listed a minifig at $50 doesn\'t mean it will sell at $50. Check what actually sold recently.',
  },
  {
    id: 'block-17',
    type: 'heading',
    level: 2,
    text: 'The Condition Factor: New vs Used',
  },
  {
    id: 'block-18',
    type: 'paragraph',
    text: 'Condition dramatically affects minifigure value. Bricklink uses two main categories:',
  },
  {
    id: 'block-19',
    type: 'heading',
    level: 3,
    text: 'New Condition',
  },
  {
    id: 'block-20',
    type: 'list',
    listType: 'unordered',
    items: [
      'Never assembled or played with',
      'Still in original packaging (if applicable)',
      'No marks, scratches, or discoloration',
      'Typically 20-40% more expensive than used',
    ],
  },
  {
    id: 'block-21',
    type: 'heading',
    level: 3,
    text: 'Used Condition',
  },
  {
    id: 'block-22',
    type: 'list',
    listType: 'unordered',
    items: [
      'Has been assembled or handled',
      'May have minor wear (bite marks, scratches, fading)',
      'Complete with all accessories and correct parts',
      'The majority of marketplace transactions',
    ],
  },
  {
    id: 'block-23',
    type: 'callout',
    calloutType: 'info',
    content: '**Pro tip:** Most sellers overprice used minifigs by using "new" pricing as reference. Check the used sales data specifically for accurate pricing.',
  },
  {
    id: 'block-24',
    type: 'heading',
    level: 2,
    text: 'How to Price: Step-by-Step',
  },
  {
    id: 'block-25',
    type: 'paragraph',
    text: 'Here\'s the practical process experienced sellers use:',
  },
  {
    id: 'block-26',
    type: 'heading',
    level: 3,
    text: 'Step 1: Find the Minifigure ID',
  },
  {
    id: 'block-27',
    type: 'paragraph',
    text: 'Every LEGO minifigure has a unique ID (e.g., "sw1219" for Mace Windu). You can find it on Bricklink by searching the set number or character name, or use FigTracker\'s search to identify it quickly.',
  },
  {
    id: 'block-28',
    type: 'heading',
    level: 3,
    text: 'Step 2: Check Recent Sales Data',
  },
  {
    id: 'block-29',
    type: 'paragraph',
    text: 'On Bricklink, go to the minifigure page and click "Price Guide." Look at the last 6 months of sales for your condition (new or used). Focus on:',
  },
  {
    id: 'block-30',
    type: 'list',
    listType: 'unordered',
    items: [
      'Quantity-weighted average (your baseline)',
      'Number of sales (more sales = more reliable data)',
      'Price trend (increasing or decreasing?)',
    ],
  },
  {
    id: 'block-30a',
    type: 'callout',
    calloutType: 'info',
    content: '**Time-saver:** This manual process takes 3-5 minutes per minifigure. [FigTracker](/search) does all this analysis instantly, pulling real-time Bricklink data and giving you a suggested price in seconds.',
  },
  {
    id: 'block-31',
    type: 'heading',
    level: 3,
    text: 'Step 3: Factor in Specifics',
  },
  {
    id: 'block-32',
    type: 'paragraph',
    text: 'Adjust your price based on:',
  },
  {
    id: 'block-33',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Completeness:** Missing accessories? Deduct 10-30%',
      '**Condition:** Bite marks, cracks, fading? Deduct 5-20%',
      '**Timing:** Selling during peak season (holidays, movie releases)? Can charge 10-15% more',
      '**Platform:** eBay typically gets 10-20% less than Bricklink due to casual buyers',
    ],
  },
  {
    id: 'block-34',
    type: 'heading',
    level: 3,
    text: 'Step 4: Compare to Current Listings',
  },
  {
    id: 'block-35',
    type: 'paragraph',
    text: 'Look at what\'s currently listed to understand competition. If everyone is asking $20 but recent sales show $15, expect buyers to wait for a $15 listing.',
  },
  {
    id: 'block-36',
    type: 'heading',
    level: 3,
    text: 'Step 5: Price Strategically',
  },
  {
    id: 'block-37',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Quick sale:** Price 5-10% below quantity-weighted average',
      '**Fair market value:** Match the quantity-weighted average',
      '**Patient seller:** Price at simple average or slightly above',
      '**Premium positioning:** If yours is pristine condition, price at top of recent range',
    ],
  },
  {
    id: 'block-38',
    type: 'heading',
    level: 2,
    text: 'Common Pricing Mistakes',
  },
  {
    id: 'block-39',
    type: 'heading',
    level: 3,
    text: '1. Using Asking Prices Instead of Sales',
  },
  {
    id: 'block-40',
    type: 'paragraph',
    text: 'New sellers see a minifig listed at $40 and think "mine is worth $40!" But if recent sales show $25, that\'s the real market value. Asking prices are often wishful thinking.',
  },
  {
    id: 'block-41',
    type: 'heading',
    level: 3,
    text: '2. Ignoring Condition Reality',
  },
  {
    id: 'block-42',
    type: 'paragraph',
    text: 'Your childhood minifigs are not "new" condition. Honest assessment of wear, missing accessories, and fading will help you price realistically and sell faster.',
  },
  {
    id: 'block-43',
    type: 'heading',
    level: 3,
    text: '3. Not Accounting for Fees',
  },
  {
    id: 'block-44',
    type: 'paragraph',
    text: 'eBay takes 13.25% + PayPal fees. Bricklink has different fee structures. Factor these into your pricing or you\'ll lose money.',
  },
  {
    id: 'block-45',
    type: 'heading',
    level: 3,
    text: '4. Pricing Rare Variants Incorrectly',
  },
  {
    id: 'block-46',
    type: 'paragraph',
    text: 'Some minifigs have multiple variants (different face prints, torso designs, accessories). Make absolutely sure you\'re looking at data for YOUR exact variant. A variant with a different accessory can be worth 10x more.',
  },
  {
    id: 'block-47',
    type: 'callout',
    calloutType: 'warning',
    content: '**Example:** Chrome Darth Vader (sw0209) is worth $3,000+. Regular Darth Vader variants are $5-20. One wrong character in the ID = massive pricing error.',
  },
  {
    id: 'block-48',
    type: 'heading',
    level: 2,
    text: 'When to Price Above Market Average',
  },
  {
    id: 'block-49',
    type: 'paragraph',
    text: 'There are legitimate reasons to price higher than the quantity-weighted average:',
  },
  {
    id: 'block-50',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Scarcity:** If there are only 2 other listings globally and high demand',
      '**Perfect condition:** Truly pristine, no flaws, with original packaging',
      '**Complete with rare accessories:** All weapons, capes, helmets in perfect shape',
      '**Trending character:** New movie or show release drives demand',
      '**Set retirement:** Recent LEGO set retirement increases minifig scarcity',
    ],
  },
  {
    id: 'block-51',
    type: 'paragraph',
    text: 'But be patient. Premium pricing means slower sales. If you need quick cash, price at or below average.',
  },
  {
    id: 'block-52',
    type: 'heading',
    level: 2,
    text: 'When to Price Below Market Average',
  },
  {
    id: 'block-53',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Quick liquidation:** Need cash now, willing to trade profit for speed',
      '**High competition:** 50+ current listings, buyers have options',
      '**Incomplete:** Missing accessories, capes, or weapons',
      '**Condition issues:** Visible wear, bite marks, fading, cracks',
      '**Bulk selling:** Moving 20+ of the same minifig (bulk discount)',
    ],
  },
  {
    id: 'block-54',
    type: 'heading',
    level: 2,
    text: 'Seasonal Pricing Trends',
  },
  {
    id: 'block-55',
    type: 'paragraph',
    text: 'LEGO prices fluctuate throughout the year:',
  },
  {
    id: 'block-56',
    type: 'heading',
    level: 3,
    text: 'Peak Selling Times (Price 10-15% Higher)',
  },
  {
    id: 'block-57',
    type: 'list',
    listType: 'unordered',
    items: [
      '**November-December:** Holiday shopping, gift buyers pay premium',
      '**May the 4th (Star Wars Day):** Star Wars minifigs surge',
      '**Movie/show releases:** Character popularity spikes demand',
      '**Comic-Con season (July-August):** Collectors active, conventions drive interest',
    ],
  },
  {
    id: 'block-58',
    type: 'heading',
    level: 3,
    text: 'Slower Selling Times (Price 5-10% Lower)',
  },
  {
    id: 'block-59',
    type: 'list',
    listType: 'unordered',
    items: [
      '**January-February:** Post-holiday lull, buyers spent out',
      '**Summer (June-August):** Families on vacation, less online shopping',
      '**Back-to-school (late August-September):** Discretionary spending decreases',
    ],
  },
  {
    id: 'block-59a',
    type: 'paragraph',
    text: 'Looking to buy sets during off-peak times? [Amazon often has deep discounts](https://www.amazon.com/s?k=LEGO&tag=figtracker-20) on LEGO during January clearance and back-to-school sales—perfect for sourcing inventory to resell.',
  },
  {
    id: 'block-60',
    type: 'heading',
    level: 2,
    text: 'How FigTracker Simplifies Pricing',
  },
  {
    id: 'block-61',
    type: 'paragraph',
    text: 'All this analysis takes time. For each minifigure, you\'re checking Bricklink, filtering by condition, calculating averages, comparing listings, and factoring in specifics.',
  },
  {
    id: 'block-62',
    type: 'paragraph',
    text: 'This is where **FigTracker** helps. We pull real-time Bricklink data and provide a single suggested price based on:',
  },
  {
    id: 'block-63',
    type: 'list',
    listType: 'unordered',
    items: [
      'Recent sales data (not inflated listing prices)',
      'Quantity-weighted average (what actually sells)',
      'Condition-specific pricing (new vs used)',
      'Current market trends',
    ],
  },
  {
    id: 'block-64',
    type: 'paragraph',
    text: 'Instead of spending 5 minutes per minifig calculating prices, you get an instant suggested price. **Currently free to use** with no subscription or paywall.',
  },
  {
    id: 'block-65',
    type: 'callout',
    calloutType: 'info',
    content: '**Best workflow:** Use FigTracker for quick pricing on most minifigs. For high-value pieces ($50+), cross-check on Bricklink to verify recent sales and understand price trends.',
  },
  {
    id: 'block-66',
    type: 'heading',
    level: 2,
    text: 'Pricing for Different Platforms',
  },
  {
    id: 'block-67',
    type: 'paragraph',
    text: 'Where you sell affects pricing strategy:',
  },
  {
    id: 'block-68',
    type: 'heading',
    level: 3,
    text: 'Bricklink',
  },
  {
    id: 'block-69',
    type: 'list',
    listType: 'unordered',
    items: [
      'Knowledgeable buyers who know exact values',
      'Price competitively or it won\'t sell',
      'Can charge fair market value (quantity-weighted average)',
      'Buyers expect accurate condition descriptions',
    ],
  },
  {
    id: 'block-70',
    type: 'heading',
    level: 3,
    text: 'eBay',
  },
  {
    id: 'block-71',
    type: 'list',
    listType: 'unordered',
    items: [
      'Mix of casual buyers and collectors',
      'Can sometimes get 10-20% above Bricklink if you have good photos and descriptions',
      'More negotiation and "best offer" requests',
      'Higher fees (13.25%) reduce your profit',
    ],
  },
  {
    id: 'block-72',
    type: 'heading',
    level: 3,
    text: 'Amazon',
  },
  {
    id: 'block-72a',
    type: 'list',
    listType: 'unordered',
    items: [
      'Massive buyer base, less LEGO-specific than Bricklink',
      'Best for sealed sets, not individual minifigs',
      'Fulfillment by Amazon (FBA) handles shipping but takes higher fees',
      'Price competitively against other Amazon sellers',
    ],
  },
  {
    id: 'block-72b',
    type: 'paragraph',
    text: 'If you\'re buying sets to part out, [Amazon\'s LEGO deals](https://www.amazon.com/s?k=LEGO&tag=figtracker-20) during sales events can be a great source of inventory at below-retail prices.',
  },
  {
    id: 'block-73',
    type: 'heading',
    level: 3,
    text: 'Facebook Marketplace / Local',
  },
  {
    id: 'block-73a',
    type: 'list',
    listType: 'unordered',
    items: [
      'Casual buyers, often parents buying for kids',
      'Less knowledge of true value (can work for or against you)',
      'Price 10-20% below Bricklink for quick local sales',
      'No shipping costs or fees',
    ],
  },
  {
    id: 'block-74',
    type: 'heading',
    level: 2,
    text: 'Frequently Asked Questions',
  },
  {
    id: 'block-75',
    type: 'heading',
    level: 3,
    text: '"Should I price all my minifigs the same?"',
  },
  {
    id: 'block-76',
    type: 'paragraph',
    text: 'No. Each minifigure has a different market value based on rarity, theme popularity, and recent sales. Even similar-looking minifigs can have 10x price differences.',
  },
  {
    id: 'block-77',
    type: 'heading',
    level: 3,
    text: '"How often do prices change?"',
  },
  {
    id: 'block-78',
    type: 'paragraph',
    text: 'Prices fluctuate constantly. New set releases, retirements, movie announcements, and seasonal demand all affect values. Check pricing monthly for active inventory.',
  },
  {
    id: 'block-79',
    type: 'heading',
    level: 3,
    text: '"What if there are no recent sales?"',
  },
  {
    id: 'block-80',
    type: 'paragraph',
    text: 'For extremely rare minifigs with limited sales data, look at current listings and price slightly below the lowest listing. Or list at your target price and wait for the right collector.',
  },
  {
    id: 'block-81',
    type: 'heading',
    level: 3,
    text: '"Can I trust FigTracker\'s prices?"',
  },
  {
    id: 'block-82',
    type: 'paragraph',
    text: 'Yes. FigTracker pulls real-time data directly from Bricklink\'s API. Our suggested prices are calculated from the same sales data you\'d manually analyze on Bricklink—we just process it instantly.',
  },
  {
    id: 'block-83',
    type: 'heading',
    level: 2,
    text: 'The Bottom Line',
  },
  {
    id: 'block-84',
    type: 'paragraph',
    text: 'Accurate pricing is the foundation of successful LEGO selling. Use recent sales data (not asking prices), factor in condition honestly, and understand your platform\'s buyer expectations.',
  },
  {
    id: 'block-85',
    type: 'paragraph',
    text: 'Whether you price manually on Bricklink or use FigTracker\'s instant suggestions, the goal is the same: **fair market value that moves inventory while maximizing profit.**',
  },
  {
    id: 'block-86',
    type: 'paragraph',
    text: '[Start pricing your collection on FigTracker](/search) — get instant Bricklink-based prices in seconds.',
  },
];

const translations = [
  {
    locale: 'en',
    title: 'How to Price LEGO Minifigures: Complete Guide for Sellers',
    description: 'Learn the fundamentals of pricing LEGO minifigures using Bricklink marketplace data. Understand quantity-weighted averages, simple averages, and how to factor in condition.',
    metaTitle: 'How to Price LEGO Minifigures: Complete Bricklink Pricing Guide',
    metaDescription: 'Master LEGO minifigure pricing with this comprehensive guide. Learn to use Bricklink data, factor in condition, avoid common mistakes, and price strategically for maximum profit.',
    metaKeywords: ['LEGO minifigure pricing', 'Bricklink price guide', 'how to price LEGO', 'minifig value guide', 'LEGO selling tips', 'Bricklink quantity-weighted average', 'LEGO condition grading'],
  },
  {
    locale: 'es',
    title: 'Cómo Valorar Minifiguras LEGO: Guía Completa para Vendedores',
    description: 'Aprende los fundamentos de valorar minifiguras LEGO usando datos del mercado de Bricklink. Entiende promedios ponderados por cantidad, promedios simples y cómo considerar la condición.',
    metaTitle: 'Cómo Valorar Minifiguras LEGO: Guía Completa de Precios Bricklink',
    metaDescription: 'Domina la valoración de minifiguras LEGO con esta guía completa. Aprende a usar datos de Bricklink, considerar la condición, evitar errores comunes y fijar precios estratégicamente.',
    metaKeywords: ['valorar minifiguras LEGO', 'guía de precios Bricklink', 'cómo valorar LEGO', 'guía de valor minifig', 'consejos venta LEGO'],
  },
  {
    locale: 'de',
    title: 'LEGO Minifiguren bewerten: Vollständiger Leitfaden für Verkäufer',
    description: 'Lernen Sie die Grundlagen der Preisgestaltung für LEGO Minifiguren mit Bricklink-Marktdaten. Verstehen Sie mengengewichtete Durchschnitte, einfache Durchschnitte und wie man den Zustand berücksichtigt.',
    metaTitle: 'LEGO Minifiguren bewerten: Vollständiger Bricklink-Preisleitfaden',
    metaDescription: 'Meistern Sie die Preisgestaltung von LEGO Minifiguren mit diesem umfassenden Leitfaden. Lernen Sie Bricklink-Daten zu nutzen, den Zustand zu berücksichtigen und strategisch zu bewerten.',
    metaKeywords: ['LEGO Minifiguren Preisgestaltung', 'Bricklink Preisführer', 'LEGO bewerten', 'Minifig Wertführer', 'LEGO Verkaufstipps'],
  },
  {
    locale: 'fr',
    title: 'Comment évaluer les Minifigurines LEGO : Guide Complet pour Vendeurs',
    description: 'Apprenez les fondamentaux de l\'évaluation des minifigurines LEGO en utilisant les données du marché Bricklink. Comprenez les moyennes pondérées par quantité, les moyennes simples et comment tenir compte de l\'état.',
    metaTitle: 'Comment évaluer les Minifigurines LEGO : Guide Complet Bricklink',
    metaDescription: 'Maîtrisez l\'évaluation des minifigurines LEGO avec ce guide complet. Apprenez à utiliser les données Bricklink, tenir compte de l\'état et fixer des prix stratégiques.',
    metaKeywords: ['évaluation minifigurines LEGO', 'guide prix Bricklink', 'comment évaluer LEGO', 'guide valeur minifig', 'conseils vente LEGO'],
  },
];

async function createArticle() {
  console.log('Creating "How to Price LEGO Minifigures" article...\n');

  // Get any user as author
  const adminUser = await prisma.user.findFirst();

  if (!adminUser) {
    throw new Error('No users found in database');
  }

  console.log('Using author:', adminUser.email || adminUser.id);

  // Check if article already exists
  const existing = await prisma.article.findUnique({
    where: { slug }
  });

  if (existing) {
    console.log('❌ Article already exists with slug:', slug);
    console.log('   Delete it first or use a different slug');
    await prisma.$disconnect();
    process.exit(1);
  }

  // Create article (with translations as JSON string for backward compatibility)
  const article = await prisma.article.create({
    data: {
      slug,
      status: 'published',
      featured: true,
      publishedAt: new Date(),
      contentBlocks: JSON.stringify(contentBlocksEN),
      translations: JSON.stringify(translations),
      readTimeMinutes: 12,
      category: 'Guide',
    },
  });

  console.log('✅ Article created:', article.id);

  console.log('\n✅ Article "How to Price LEGO Minifigures" created successfully!');
  console.log(`📝 View at: https://figtracker.ericksu.com/articles/${slug}`);

  await prisma.$disconnect();
}

createArticle().catch(console.error);
