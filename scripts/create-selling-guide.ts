import { PrismaClient } from '@prisma/client';
import { ArticleBlock } from '../types/article';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

const slug = 'selling-lego-on-bricklink';

// English content
const contentBlocksEN: ArticleBlock[] = [
  {
    id: 'block-1',
    type: 'paragraph',
    text: 'Bricklink is the world\'s largest LEGO marketplace, connecting millions of buyers and sellers globally. Whether you\'re clearing out your childhood collection or building a serious LEGO business, Bricklink offers unmatched reach and dedicated LEGO enthusiasts as customers.',
  },
  {
    id: 'block-2',
    type: 'paragraph',
    text: 'But starting as a Bricklink seller can feel overwhelming. The platform has been around since 2000, with established sellers, complex inventory systems, and strict community standards. This guide walks you through everything you need to know to become a successful Bricklink seller.',
  },
  {
    id: 'block-3',
    type: 'heading',
    level: 2,
    text: 'Why Sell on Bricklink?',
  },
  {
    id: 'block-4',
    type: 'paragraph',
    text: 'Before diving into the how-to, here\'s why Bricklink is worth the learning curve:',
  },
  {
    id: 'block-5',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Targeted audience:** Every buyer on Bricklink is actively looking for LEGO. No competing with unrelated products like on eBay.',
      '**Fair pricing:** Knowledgeable buyers mean you can charge fair market value without explaining why a rare minifig costs $100.',
      '**Global reach:** Sell to 100+ countries without managing separate international listings.',
      '**Lower fees:** Typically 3-5% vs eBay\'s 13.25%+.',
      '**Repeat customers:** Build a reputation and get returning buyers who trust your store.',
      '**Inventory management:** Built-in tools for tracking what you have and what sold.',
    ],
  },
  {
    id: 'block-6',
    type: 'heading',
    level: 2,
    text: 'Setting Up Your Bricklink Store',
  },
  {
    id: 'block-7',
    type: 'heading',
    level: 3,
    text: 'Step 1: Create Your Account',
  },
  {
    id: 'block-8',
    type: 'paragraph',
    text: 'Go to [Bricklink.com](https://www.bricklink.com) and register. Choose a username that reflects your store identity—this becomes your store name and can\'t be changed easily.',
  },
  {
    id: 'block-9',
    type: 'callout',
    calloutType: 'info',
    content: '**Username tip:** Pick something professional and LEGO-related. Avoid numbers/special characters that make it hard to remember. Examples: "BrickVault", "MinifigMarket", "LegoDepotUSA"',
  },
  {
    id: 'block-10',
    type: 'heading',
    level: 3,
    text: 'Step 2: Open Your Store',
  },
  {
    id: 'block-11',
    type: 'paragraph',
    text: 'Navigate to "My Store" → "Open Store". You\'ll need to:',
  },
  {
    id: 'block-12',
    type: 'list',
    listType: 'unordered',
    items: [
      'Set your store location (country)',
      'Define shipping methods and costs',
      'Set minimum order requirements (if any)',
      'Write store terms and policies',
      'Configure payment methods (PayPal is most common)',
    ],
  },
  {
    id: 'block-13',
    type: 'heading',
    level: 3,
    text: 'Step 3: Configure Store Settings',
  },
  {
    id: 'block-14',
    type: 'paragraph',
    text: 'Critical settings to configure from day one:',
  },
  {
    id: 'block-15',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Shipping:** Define domestic and international rates. Be conservative—underestimating shipping costs kills profit.',
      '**Sales tax:** If required in your location, configure automatic tax collection.',
      '**Vacation mode:** Learn how to activate this when you can\'t fulfill orders.',
      '**Order minimums:** Many sellers set $5-10 minimums to avoid losing money on tiny orders.',
      '**Payment terms:** Net 7 days is standard (buyer has 7 days to pay).',
    ],
  },
  {
    id: 'block-16',
    type: 'callout',
    calloutType: 'warning',
    content: '**Shipping mistake:** New sellers often set flat rates that lose money on heavy orders. Use weight-based pricing or add "large order" surcharges.',
  },
  {
    id: 'block-17',
    type: 'heading',
    level: 2,
    text: 'Adding Inventory: The Right Way',
  },
  {
    id: 'block-18',
    type: 'paragraph',
    text: 'Listing inventory is where most new sellers struggle. Here\'s the efficient approach:',
  },
  {
    id: 'block-19',
    type: 'heading',
    level: 3,
    text: 'Step 1: Identify Your Items',
  },
  {
    id: 'block-20',
    type: 'paragraph',
    text: 'Every LEGO piece has a unique catalog number. Use Bricklink\'s catalog search or FigTracker to find the correct item ID. **Do not guess.** Wrong IDs lead to disputes and bad feedback.',
  },
  {
    id: 'block-21',
    type: 'heading',
    level: 3,
    text: 'Step 2: Assess Condition Honestly',
  },
  {
    id: 'block-22',
    type: 'paragraph',
    text: 'Bricklink buyers are meticulous. Here are the condition standards:',
  },
  {
    id: 'block-23',
    type: 'paragraph',
    text: '**New:**',
  },
  {
    id: 'block-24',
    type: 'list',
    listType: 'unordered',
    items: [
      'Never assembled, played with, or handled except for inventory',
      'Perfect condition, no marks or scratches',
      'Sealed in original bag if applicable',
    ],
  },
  {
    id: 'block-25',
    type: 'paragraph',
    text: '**Used - Like New:**',
  },
  {
    id: 'block-26',
    type: 'list',
    listType: 'unordered',
    items: [
      'May have been built once but appears flawless',
      'No visible wear, scratches, or marks',
      'Complete with all accessories',
    ],
  },
  {
    id: 'block-27',
    type: 'paragraph',
    text: '**Used - Good:**',
  },
  {
    id: 'block-28',
    type: 'list',
    listType: 'unordered',
    items: [
      'Minor wear (light scratches, slight fading)',
      'Complete and functional',
      'Most used LEGO falls here',
    ],
  },
  {
    id: 'block-29',
    type: 'paragraph',
    text: '**Used - Acceptable:**',
  },
  {
    id: 'block-30',
    type: 'list',
    listType: 'unordered',
    items: [
      'Noticeable wear (scratches, bite marks, significant fading)',
      'May have minor damage (small cracks, stress marks)',
      'Still usable but clearly played with',
    ],
  },
  {
    id: 'block-31',
    type: 'callout',
    calloutType: 'warning',
    content: '**Critical:** When in doubt, grade down. Buyers who receive better-than-expected condition leave positive feedback. Overstating condition leads to disputes and negative feedback.',
  },
  {
    id: 'block-32',
    type: 'heading',
    level: 3,
    text: 'Step 3: Price Your Items',
  },
  {
    id: 'block-33',
    type: 'paragraph',
    text: 'Check the Bricklink Price Guide for each item. Look at the 6-month average for your condition. Consider:',
  },
  {
    id: 'block-34',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Competitive pricing:** If 20 sellers have the same item, price at or below average to move inventory.',
      '**Scarcity:** If you\'re one of only 3 sellers globally, you can charge a premium.',
      '**Bundle strategy:** Some sellers price individual items slightly high but offer bulk discounts.',
    ],
  },
  {
    id: 'block-34a',
    type: 'callout',
    calloutType: 'info',
    content: '**Speed up pricing:** Instead of manually checking Bricklink\'s price guide for every item (2-3 minutes each), [use FigTracker](/search) to get instant Bricklink-based suggested prices in seconds. Essential when listing large inventories.',
  },
  {
    id: 'block-35',
    type: 'heading',
    level: 3,
    text: 'Step 4: Write Effective Listings',
  },
  {
    id: 'block-36',
    type: 'paragraph',
    text: 'Most listings don\'t need long descriptions. Bricklink buyers know what they\'re buying by the catalog number. But DO include:',
  },
  {
    id: 'block-37',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Completeness:** "Complete with all accessories" or "Missing cape"',
      '**Condition notes:** "Light scratches on torso" or "Pristine, never played with"',
      '**Variations:** If the item has multiple variants, confirm which one you have',
      '**Quantity:** How many you have in stock',
    ],
  },
  {
    id: 'block-38',
    type: 'heading',
    level: 2,
    text: 'Shipping Best Practices',
  },
  {
    id: 'block-39',
    type: 'paragraph',
    text: 'Shipping complaints are the #1 source of negative feedback. Here\'s how to avoid them:',
  },
  {
    id: 'block-40',
    type: 'heading',
    level: 3,
    text: 'Packaging Minifigures',
  },
  {
    id: 'block-41',
    type: 'list',
    listType: 'unordered',
    items: [
      'Use small ziplock bags for each minifig (separate body from accessories)',
      'Wrap in bubble wrap or place in bubble mailer',
      'Use rigid envelopes for small orders to prevent crushing',
      'For valuable minifigs ($50+), use small boxes with extra padding',
    ],
  },
  {
    id: 'block-42',
    type: 'heading',
    level: 3,
    text: 'Packaging Parts and Sets',
  },
  {
    id: 'block-43',
    type: 'list',
    listType: 'unordered',
    items: [
      'Small parts: ziplock bags by type/color',
      'Large pieces: bubble wrap individually',
      'Sets: disassemble and bag by step/section',
      'Use boxes, not envelopes, for anything over 50 pieces',
    ],
  },
  {
    id: 'block-44',
    type: 'heading',
    level: 3,
    text: 'Shipping Speed',
  },
  {
    id: 'block-45',
    type: 'paragraph',
    text: 'Bricklink norm is 3-5 business days from payment to shipment. Faster is better for your reputation. If you\'ll be delayed, message the buyer proactively.',
  },
  {
    id: 'block-46',
    type: 'callout',
    calloutType: 'info',
    content: '**Pro tip:** Print shipping labels at home. USPS.com, Pirate Ship, or PayPal shipping save time and often cost less than retail counter prices.',
  },
  {
    id: 'block-47',
    type: 'heading',
    level: 2,
    text: 'Customer Service That Builds Reputation',
  },
  {
    id: 'block-48',
    type: 'paragraph',
    text: 'Your feedback score is everything on Bricklink. Here\'s how to earn positive reviews:',
  },
  {
    id: 'block-49',
    type: 'heading',
    level: 3,
    text: 'Respond Quickly',
  },
  {
    id: 'block-50',
    type: 'paragraph',
    text: 'Answer messages within 24 hours. Even "I\'ll check and get back to you tomorrow" is better than silence.',
  },
  {
    id: 'block-51',
    type: 'heading',
    level: 3,
    text: 'Handle Disputes Gracefully',
  },
  {
    id: 'block-52',
    type: 'paragraph',
    text: 'Mistakes happen. If a buyer says an item is wrong or damaged:',
  },
  {
    id: 'block-53',
    type: 'list',
    listType: 'unordered',
    items: [
      'Apologize immediately (even if you think they\'re wrong)',
      'Offer a partial refund, replacement, or full refund + return shipping',
      'Never argue publicly—resolve via messages, not feedback replies',
      'A $5 refund is cheaper than negative feedback that scares away future buyers',
    ],
  },
  {
    id: 'block-54',
    type: 'heading',
    level: 3,
    text: 'Go Beyond Expectations',
  },
  {
    id: 'block-55',
    type: 'list',
    listType: 'unordered',
    items: [
      'Throw in a free low-value item ("Thanks for your order!" bonus)',
      'Ship faster than promised',
      'Include a handwritten thank-you note (especially for large orders)',
      'Overpack rather than underpack—better safe than damaged',
    ],
  },
  {
    id: 'block-56',
    type: 'heading',
    level: 2,
    text: 'Competitive Pricing Strategies',
  },
  {
    id: 'block-57',
    type: 'paragraph',
    text: 'Pricing determines how fast inventory moves and your profit margins:',
  },
  {
    id: 'block-58',
    type: 'heading',
    level: 3,
    text: 'Strategy 1: Undercut Competitors',
  },
  {
    id: 'block-59',
    type: 'paragraph',
    text: 'Price 5-10% below average to move inventory quickly. Works well for:',
  },
  {
    id: 'block-60',
    type: 'list',
    listType: 'unordered',
    items: [
      'Common items with high competition',
      'Building your feedback score as a new seller',
      'Clearing out bulk inventory fast',
    ],
  },
  {
    id: 'block-61',
    type: 'heading',
    level: 3,
    text: 'Strategy 2: Match Market Average',
  },
  {
    id: 'block-62',
    type: 'paragraph',
    text: 'Price at the 6-month quantity-weighted average. Balanced approach for steady sales without leaving money on the table.',
  },
  {
    id: 'block-63',
    type: 'heading',
    level: 3,
    text: 'Strategy 3: Premium Positioning',
  },
  {
    id: 'block-64',
    type: 'paragraph',
    text: 'Price 10-20% above average but offer:',
  },
  {
    id: 'block-65',
    type: 'list',
    listType: 'unordered',
    items: [
      'Guaranteed perfect condition',
      'Fast shipping (1-2 business days)',
      'Premium packaging',
      'Large inventory (buyers can complete their order with one seller)',
    ],
  },
  {
    id: 'block-66',
    type: 'heading',
    level: 3,
    text: 'Strategy 4: Volume Discounts',
  },
  {
    id: 'block-67',
    type: 'paragraph',
    text: 'Price individual items at market rate but offer:',
  },
  {
    id: 'block-68',
    type: 'list',
    listType: 'unordered',
    items: [
      '"Buy 10+ items, get 10% off"',
      '"Orders over $50 ship free"',
      'Automatic bulk discounts in your store settings',
    ],
  },
  {
    id: 'block-69',
    type: 'callout',
    calloutType: 'info',
    content: '**Time-saver:** FigTracker gives you instant Bricklink-based pricing. Instead of manually checking price guides for every item, get suggested prices in seconds.',
  },
  {
    id: 'block-70',
    type: 'heading',
    level: 2,
    text: 'Common Mistakes New Sellers Make',
  },
  {
    id: 'block-71',
    type: 'heading',
    level: 3,
    text: '1. Overgrading Condition',
  },
  {
    id: 'block-72',
    type: 'paragraph',
    text: 'Listing "Like New" when it\'s actually "Good" leads to disputes. Be honest or grade conservatively.',
  },
  {
    id: 'block-73',
    type: 'heading',
    level: 3,
    text: '2. Underestimating Shipping Costs',
  },
  {
    id: 'block-74',
    type: 'paragraph',
    text: 'International shipping is expensive. If you charge $5 but it costs $15 to ship, you lose $10. Use Bricklink\'s shipping calculator or set conservative rates.',
  },
  {
    id: 'block-75',
    type: 'heading',
    level: 3,
    text: '3. Ignoring Messages',
  },
  {
    id: 'block-76',
    type: 'paragraph',
    text: 'Buyers expect responses within 24 hours. Slow communication = lost sales and bad feedback.',
  },
  {
    id: 'block-77',
    type: 'heading',
    level: 3,
    text: '4. Wrong Catalog Numbers',
  },
  {
    id: 'block-78',
    type: 'paragraph',
    text: 'Listing the wrong item (even similar ones) frustrates buyers. Double-check IDs before listing.',
  },
  {
    id: 'block-79',
    type: 'heading',
    level: 3,
    text: '5. No Minimum Order',
  },
  {
    id: 'block-80',
    type: 'paragraph',
    text: 'Without minimums, you\'ll spend 30 minutes packaging and shipping a $0.50 order. Set a $5-10 minimum or charge small-order fees.',
  },
  {
    id: 'block-81',
    type: 'heading',
    level: 2,
    text: 'Growing Your Bricklink Business',
  },
  {
    id: 'block-82',
    type: 'paragraph',
    text: 'Once you\'ve mastered the basics, here\'s how to scale:',
  },
  {
    id: 'block-83',
    type: 'heading',
    level: 3,
    text: 'Increase Inventory',
  },
  {
    id: 'block-84',
    type: 'list',
    listType: 'unordered',
    items: [
      'Buy bulk lots on eBay, Facebook Marketplace, garage sales',
      'Part out LEGO sets (buy retired sets, sell individual pieces for profit)',
      'Source from clearance sales (Target, Walmart end-of-season)',
      '[Amazon clearance and Lightning Deals](https://www.amazon.com/s?k=LEGO&tag=figtracker-20) - watch for price drops on retired sets',
    ],
  },
  {
    id: 'block-84a',
    type: 'paragraph',
    text: 'Want to know which minifigures are worth sourcing? Check out our guide on [the most valuable LEGO minifigures](/articles/most-valuable-lego-minifigures-2026) to identify high-profit pieces.',
  },
  {
    id: 'block-85',
    type: 'heading',
    level: 3,
    text: 'Optimize Listings',
  },
  {
    id: 'block-86',
    type: 'list',
    listType: 'unordered',
    items: [
      'Review pricing monthly—adjust for market changes',
      'Relist old inventory with updated descriptions',
      'Add photos for high-value items (not required but helps)',
    ],
  },
  {
    id: 'block-87',
    type: 'heading',
    level: 3,
    text: 'Build Reputation',
  },
  {
    id: 'block-88',
    type: 'list',
    listType: 'unordered',
    items: [
      'Target 100+ positive feedback within your first year',
      'Maintain 99%+ positive feedback rating',
      'Fast shipping and accurate descriptions earn repeat customers',
    ],
  },
  {
    id: 'block-89',
    type: 'heading',
    level: 3,
    text: 'Automate Where Possible',
  },
  {
    id: 'block-90',
    type: 'list',
    listType: 'unordered',
    items: [
      'Use Bricklink\'s bulk upload tools for large inventories',
      'Set up automatic order confirmations and shipping notifications',
      'Use tools like BrickStore or BrickStock for offline inventory management',
      'Use FigTracker for instant pricing instead of manual price guide lookups',
    ],
  },
  {
    id: 'block-91',
    type: 'heading',
    level: 2,
    text: 'When to Use FigTracker as a Bricklink Seller',
  },
  {
    id: 'block-92',
    type: 'paragraph',
    text: 'If you\'re listing inventory, you need accurate pricing. FigTracker pulls real-time Bricklink sales data and provides instant suggested prices.',
  },
  {
    id: 'block-93',
    type: 'paragraph',
    text: '**Best workflow:**',
  },
  {
    id: 'block-94',
    type: 'list',
    listType: 'ordered',
    items: [
      'Identify your minifigure ID',
      'Search it on FigTracker to get instant Bricklink-based pricing',
      'Adjust for condition, competition, or your pricing strategy',
      'List on Bricklink',
    ],
  },
  {
    id: 'block-95',
    type: 'paragraph',
    text: 'Instead of opening Bricklink price guides for every single item (which takes 2-3 minutes each), FigTracker gives you accurate prices in seconds. **Currently free to use.**',
  },
  {
    id: 'block-96',
    type: 'heading',
    level: 2,
    text: 'Frequently Asked Questions',
  },
  {
    id: 'block-97',
    type: 'heading',
    level: 3,
    text: '"How much can I make selling on Bricklink?"',
  },
  {
    id: 'block-98',
    type: 'paragraph',
    text: 'Varies widely. Casual sellers clearing collections might make $500-2,000. Serious part-time sellers can make $1,000-5,000/month. Full-time professional sellers earn $5,000-20,000+/month. It depends on your inventory, time investment, and sourcing strategy.',
  },
  {
    id: 'block-99',
    type: 'heading',
    level: 3,
    text: '"Do I need a business license?"',
  },
  {
    id: 'block-100',
    type: 'paragraph',
    text: 'Depends on your location and sales volume. In the US, casual hobby sales don\'t require a license, but if you\'re generating significant income, consult a tax professional. Some states require sales tax collection.',
  },
  {
    id: 'block-101',
    type: 'heading',
    level: 3,
    text: '"What are Bricklink\'s fees?"',
  },
  {
    id: 'block-102',
    type: 'paragraph',
    text: 'Bricklink charges 3% on sales for Basic stores, 5% for Featured stores. Payment processing (PayPal) adds ~3%. Total fees are usually 6-8%, much lower than eBay\'s 13-15%.',
  },
  {
    id: 'block-103',
    type: 'heading',
    level: 3,
    text: '"How long does it take to make my first sale?"',
  },
  {
    id: 'block-104',
    type: 'paragraph',
    text: 'With competitive pricing and desirable inventory, you can make your first sale within days. New stores with no feedback may take 1-2 weeks as buyers build trust. Undercutting competitors slightly helps move inventory faster initially.',
  },
  {
    id: 'block-105',
    type: 'heading',
    level: 2,
    text: 'The Bottom Line',
  },
  {
    id: 'block-106',
    type: 'paragraph',
    text: 'Selling on Bricklink is the best way to reach serious LEGO buyers worldwide. The platform rewards accuracy, fair pricing, and good customer service with repeat business and positive feedback.',
  },
  {
    id: 'block-107',
    type: 'paragraph',
    text: 'Start small, build your reputation, and scale as you learn the market. Whether you\'re a casual seller or building a LEGO business, Bricklink provides the infrastructure and audience to succeed.',
  },
  {
    id: 'block-108',
    type: 'paragraph',
    text: '[Price your inventory with FigTracker](/search) — get instant Bricklink-based pricing to speed up your listings.',
  },
];

const translations = [
  {
    locale: 'en',
    title: 'Selling LEGO on Bricklink: Complete Guide for New Sellers',
    description: 'Complete guide to becoming a successful Bricklink seller. From creating your store to shipping best practices and customer service tips.',
    metaTitle: 'How to Sell LEGO on Bricklink: Complete Seller Guide 2026',
    metaDescription: 'Master selling on Bricklink with this comprehensive guide. Learn store setup, inventory management, pricing strategies, shipping, and building your seller reputation.',
    metaKeywords: ['selling on Bricklink', 'Bricklink seller guide', 'how to sell LEGO', 'Bricklink store setup', 'LEGO reselling', 'Bricklink shipping', 'LEGO business'],
  },
  {
    locale: 'es',
    title: 'Vender LEGO en Bricklink: Guía Completa para Nuevos Vendedores',
    description: 'Guía completa para convertirse en un vendedor exitoso de Bricklink. Desde crear tu tienda hasta mejores prácticas de envío y consejos de servicio al cliente.',
    metaTitle: 'Cómo Vender LEGO en Bricklink: Guía Completa de Vendedor 2026',
    metaDescription: 'Domina las ventas en Bricklink con esta guía completa. Aprende configuración de tienda, gestión de inventario, estrategias de precios, envío y construcción de reputación.',
    metaKeywords: ['vender en Bricklink', 'guía vendedor Bricklink', 'cómo vender LEGO', 'configurar tienda Bricklink', 'reventa LEGO'],
  },
  {
    locale: 'de',
    title: 'LEGO auf Bricklink verkaufen: Vollständiger Leitfaden für neue Verkäufer',
    description: 'Vollständiger Leitfaden, um ein erfolgreicher Bricklink-Verkäufer zu werden. Von der Erstellung Ihres Shops bis zu Best Practices für den Versand und Kundenservice-Tipps.',
    metaTitle: 'LEGO auf Bricklink verkaufen: Vollständiger Verkäuferleitfaden 2026',
    metaDescription: 'Meistern Sie den Verkauf auf Bricklink mit diesem umfassenden Leitfaden. Lernen Sie Shop-Einrichtung, Bestandsverwaltung, Preisstrategien, Versand und Reputationsaufbau.',
    metaKeywords: ['auf Bricklink verkaufen', 'Bricklink Verkäuferleitfaden', 'LEGO verkaufen', 'Bricklink Shop einrichten', 'LEGO Wiederverkauf'],
  },
  {
    locale: 'fr',
    title: 'Vendre des LEGO sur Bricklink : Guide Complet pour Nouveaux Vendeurs',
    description: 'Guide complet pour devenir un vendeur Bricklink réussi. De la création de votre boutique aux meilleures pratiques d\'expédition et conseils de service client.',
    metaTitle: 'Comment Vendre des LEGO sur Bricklink : Guide Vendeur Complet 2026',
    metaDescription: 'Maîtrisez la vente sur Bricklink avec ce guide complet. Apprenez la configuration de boutique, gestion d\'inventaire, stratégies de prix, expédition et construction de réputation.',
    metaKeywords: ['vendre sur Bricklink', 'guide vendeur Bricklink', 'comment vendre LEGO', 'configuration boutique Bricklink', 'revente LEGO'],
  },
];

async function createArticle() {
  console.log('Creating "Selling LEGO on Bricklink" article...\n');

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
      readTimeMinutes: 15,
      category: 'Guide',
    },
  });

  console.log('✅ Article created:', article.id);

  console.log('\n✅ Article "Selling LEGO on Bricklink" created successfully!');
  console.log(`📝 View at: https://figtracker.ericksu.com/articles/${slug}`);

  await prisma.$disconnect();
}

createArticle().catch(console.error);
