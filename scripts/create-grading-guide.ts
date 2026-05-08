import { PrismaClient } from '@prisma/client-hostinger';
import { ArticleBlock } from '../types/article';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

const slug = 'how-to-grade-lego-condition';

// English content
const contentBlocksEN: ArticleBlock[] = [
  {
    id: 'block-1',
    type: 'paragraph',
    text: 'Nothing kills a LEGO sale faster than a buyer dispute over condition. You list a minifigure as "good condition," the buyer receives it and claims it\'s "acceptable at best." Suddenly you\'re dealing with returns, negative feedback, and lost profit.',
  },
  {
    id: 'block-2',
    type: 'paragraph',
    text: 'The problem? Most LEGO sellers have no consistent system for grading condition. They eyeball it, use vague terms, and hope for the best. Buyers, on the other hand, expect specific standards—especially on platforms like Bricklink where condition directly affects price.',
  },
  {
    id: 'block-3',
    type: 'paragraph',
    text: 'This guide breaks down exactly how to grade LEGO condition like a professional seller. You\'ll learn the industry standards, what buyers actually care about, and how to avoid the most common grading mistakes that lead to disputes.',
  },
  {
    id: 'block-4',
    type: 'heading',
    level: 2,
    text: 'Why Accurate Condition Grading Matters',
  },
  {
    id: 'block-5',
    type: 'paragraph',
    text: 'Condition grading isn\'t just about avoiding disputes—it directly impacts your selling success:',
  },
  {
    id: 'block-6',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Price accuracy:** Used "like new" minifigs sell for 20-40% more than "good" condition',
      '**Buyer trust:** Consistent, honest grading builds reputation and repeat customers',
      '**Fewer returns:** Clear expectations mean fewer "not as described" complaints',
      '**Competitive advantage:** Most sellers overgrade—honest grading sets you apart',
      '**Legal protection:** Accurate descriptions protect you in disputes',
    ],
  },
  {
    id: 'block-7',
    type: 'callout',
    calloutType: 'warning',
    content: '**Common mistake:** Sellers often grade based on "it looks fine to me" instead of using objective standards. This leads to 80% of condition disputes.',
  },
  {
    id: 'block-8',
    type: 'heading',
    level: 2,
    text: 'The Standard LEGO Condition Grading Scale',
  },
  {
    id: 'block-9',
    type: 'paragraph',
    text: 'Bricklink and most serious LEGO marketplaces use this standardized scale. Learn it and stick to it:',
  },
  {
    id: 'block-10',
    type: 'heading',
    level: 3,
    text: 'New (N)',
  },
  {
    id: 'block-11',
    type: 'list',
    listType: 'unordered',
    items: [
      'Never assembled, never handled except for inventory',
      'Still in original sealed bags if applicable',
      'Absolutely no marks, scratches, dust, or wear',
      'No yellowing or discoloration whatsoever',
      'Perfect condition—looks factory fresh',
    ],
  },
  {
    id: 'block-12',
    type: 'callout',
    calloutType: 'warning',
    content: '**Critical:** If you opened the bag to check it, it\'s NOT new. If you built it once and disassembled it, it\'s NOT new. Be honest.',
  },
  {
    id: 'block-13',
    type: 'heading',
    level: 3,
    text: 'Like New (LN)',
  },
  {
    id: 'block-14',
    type: 'list',
    listType: 'unordered',
    items: [
      'May have been assembled once but appears flawless',
      'No visible wear, scratches, or marks under normal inspection',
      'No dust, dirt, or discoloration',
      'Functionally and visually indistinguishable from new',
      'All accessories included and perfect',
    ],
  },
  {
    id: 'block-15',
    type: 'paragraph',
    text: '**Example:** You built a set once for display in a dust-free case, then immediately disassembled it. No play wear, no handling marks.',
  },
  {
    id: 'block-16',
    type: 'heading',
    level: 3,
    text: 'Excellent (E)',
  },
  {
    id: 'block-17',
    type: 'list',
    listType: 'unordered',
    items: [
      'Minor signs of handling but still very good',
      'Might have extremely light surface scratches (barely visible)',
      'Slight dust or minor dirt (easily cleaned)',
      'No structural damage—no cracks, chips, or missing parts',
      'Colorfastness intact (no fading or yellowing)',
    ],
  },
  {
    id: 'block-18',
    type: 'paragraph',
    text: '**Example:** A minifig that was gently played with for a few weeks, then stored carefully. Maybe one tiny scratch on the torso if you look closely.',
  },
  {
    id: 'block-19',
    type: 'heading',
    level: 3,
    text: 'Good (G)',
  },
  {
    id: 'block-20',
    type: 'list',
    listType: 'unordered',
    items: [
      'Obvious signs of use but still functional and complete',
      'Visible scratches, scuffs, or minor wear',
      'Possible light fading or discoloration',
      'Minor dirt or dust (may need cleaning)',
      'No major damage—no cracks, breaks, or missing pieces',
    ],
  },
  {
    id: 'block-21',
    type: 'paragraph',
    text: '**Example:** Your childhood LEGO that was played with regularly but stored indoors. Noticeable scratches, maybe some fading on white pieces, but structurally sound.',
  },
  {
    id: 'block-22',
    type: 'callout',
    calloutType: 'info',
    content: '**Most used LEGO falls into "Good" condition.** Don\'t upgrade to "Excellent" just because "it\'s not that bad." Buyers expect objective standards.',
  },
  {
    id: 'block-23',
    type: 'heading',
    level: 3,
    text: 'Acceptable (A)',
  },
  {
    id: 'block-24',
    type: 'list',
    listType: 'unordered',
    items: [
      'Heavy play wear but still usable',
      'Significant scratches, bite marks, or scuffing',
      'Noticeable fading, yellowing, or discoloration',
      'Minor structural issues (small cracks, stress marks)',
      'Missing non-essential accessories (but major pieces present)',
    ],
  },
  {
    id: 'block-25',
    type: 'paragraph',
    text: '**Example:** Well-loved childhood LEGO with visible bite marks on minifig hands, yellowed white pieces, and scratches on printed elements. Still functions but clearly used.',
  },
  {
    id: 'block-26',
    type: 'heading',
    level: 3,
    text: 'For Parts (FP)',
  },
  {
    id: 'block-27',
    type: 'list',
    listType: 'unordered',
    items: [
      'Major damage: cracks, breaks, or structural failure',
      'Severe discoloration or fading',
      'Missing critical pieces or accessories',
      'Not suitable for normal display or play',
      'Best used for spare parts or custom builds',
    ],
  },
  {
    id: 'block-28',
    type: 'paragraph',
    text: '**Example:** A minifig with a cracked torso, missing legs, and severe yellowing. Only valuable for harvesting usable parts.',
  },
  {
    id: 'block-29',
    type: 'heading',
    level: 2,
    text: 'Grading Sealed LEGO Sets',
  },
  {
    id: 'block-30',
    type: 'paragraph',
    text: 'Sealed sets have their own grading nuances. Box condition matters because collectors pay premium for pristine packaging:',
  },
  {
    id: 'block-31',
    type: 'heading',
    level: 3,
    text: 'Mint Sealed',
  },
  {
    id: 'block-32',
    type: 'list',
    listType: 'unordered',
    items: [
      'Factory sealed, never opened',
      'Perfect box: no dents, tears, creases, or crushing',
      'No shelf wear, fading, or discoloration',
      'Looks like it just came off the LEGO factory line',
    ],
  },
  {
    id: 'block-33',
    type: 'heading',
    level: 3,
    text: 'Sealed - Light Shelf Wear',
  },
  {
    id: 'block-34',
    type: 'list',
    listType: 'unordered',
    items: [
      'Factory sealed, never opened',
      'Minor shelf wear: light edge wear, small creases, or tiny dents',
      'No major crushing or structural box damage',
      'Still displays well',
    ],
  },
  {
    id: 'block-35',
    type: 'heading',
    level: 3,
    text: 'Sealed - Heavy Shelf Wear',
  },
  {
    id: 'block-36',
    type: 'list',
    listType: 'unordered',
    items: [
      'Factory sealed, never opened',
      'Significant box damage: crushed corners, creases, tears, fading',
      'Box integrity compromised but seal intact',
      'Contents are new but packaging is rough',
    ],
  },
  {
    id: 'block-37',
    type: 'callout',
    calloutType: 'info',
    content: '**Key distinction:** Sealed means the factory tape/seal has never been broken. If you opened it and re-taped it, that\'s NOT sealed—that\'s "opened box, unassembled contents."',
  },
  {
    id: 'block-38',
    type: 'heading',
    level: 2,
    text: 'Grading Minifigures: What Actually Affects Value',
  },
  {
    id: 'block-39',
    type: 'paragraph',
    text: 'Minifigures are the most scrutinized LEGO items. Here\'s what buyers inspect and what actually tanks value:',
  },
  {
    id: 'block-40',
    type: 'heading',
    level: 3,
    text: '1. Torso Cracks (Major Value Hit)',
  },
  {
    id: 'block-41',
    type: 'paragraph',
    text: 'Cracked torsos are the #1 defect that kills minifig value. Look for cracks:',
  },
  {
    id: 'block-42',
    type: 'list',
    listType: 'unordered',
    items: [
      'Around neck joint (most common)',
      'Under arms where they attach',
      'Along sides from stress',
      'On back from over-rotation',
    ],
  },
  {
    id: 'block-43',
    type: 'paragraph',
    text: '**Impact:** A cracked torso drops a minifig from "Good" to "Acceptable" or "For Parts." Can reduce value 50-70%.',
  },
  {
    id: 'block-44',
    type: 'heading',
    level: 3,
    text: '2. Print Wear (Moderate Impact)',
  },
  {
    id: 'block-45',
    type: 'list',
    listType: 'unordered',
    items: [
      'Faded printing on torso or legs',
      'Scratched or worn face printing',
      'Missing details from handling',
      'Smudged or damaged decals',
    ],
  },
  {
    id: 'block-46',
    type: 'paragraph',
    text: '**Impact:** Minor wear drops from "Like New" to "Excellent." Significant wear means "Good" at best.',
  },
  {
    id: 'block-47',
    type: 'heading',
    level: 3,
    text: '3. Yellowing (Especially White/Tan Pieces)',
  },
  {
    id: 'block-48',
    type: 'paragraph',
    text: 'White and tan pieces yellow over time from UV exposure and chemical reactions in old ABS plastic.',
  },
  {
    id: 'block-49',
    type: 'list',
    listType: 'unordered',
    items: [
      'Slight yellowing: "Excellent" drops to "Good"',
      'Noticeable yellowing: "Good" at best',
      'Heavy yellowing: "Acceptable"',
    ],
  },
  {
    id: 'block-50',
    type: 'callout',
    calloutType: 'warning',
    content: '**Specific problem:** Old brown pieces (pre-2004) are notorious for becoming brittle and cracking. If you have old brown LEGO, check for cracks before grading.',
  },
  {
    id: 'block-51',
    type: 'heading',
    level: 3,
    text: '4. Bite Marks (Common Kid Damage)',
  },
  {
    id: 'block-52',
    type: 'paragraph',
    text: 'Teeth marks on minifig hands, arms, or accessories are extremely common.',
  },
  {
    id: 'block-53',
    type: 'list',
    listType: 'unordered',
    items: [
      'Light bite marks: "Good" condition',
      'Deep/multiple bite marks: "Acceptable"',
      'Structural damage from biting: "For Parts"',
    ],
  },
  {
    id: 'block-54',
    type: 'heading',
    level: 3,
    text: '5. Loose Joints',
  },
  {
    id: 'block-55',
    type: 'paragraph',
    text: 'Hip joints and arm connections wear out over time.',
  },
  {
    id: 'block-56',
    type: 'list',
    listType: 'unordered',
    items: [
      'Slightly loose but still holds poses: "Good"',
      'Very loose, falls apart easily: "Acceptable"',
      'Broken/unusable joints: "For Parts"',
    ],
  },
  {
    id: 'block-57',
    type: 'heading',
    level: 3,
    text: '6. Missing Accessories',
  },
  {
    id: 'block-58',
    type: 'paragraph',
    text: 'Completeness matters more than many sellers realize:',
  },
  {
    id: 'block-59',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Complete (all accessories):** Full value',
      '**Missing common accessory (generic weapon):** -10-20%',
      '**Missing unique accessory (custom cape, rare weapon):** -30-50%',
      '**Incomplete minifig (missing torso, legs, etc.):** "For Parts"',
    ],
  },
  {
    id: 'block-60',
    type: 'callout',
    calloutType: 'info',
    content: '**Pro tip:** Always specify exactly what\'s included. "Missing cape" is clearer than vague "incomplete" descriptions.',
  },
  {
    id: 'block-60a',
    type: 'paragraph',
    text: 'Once you\'ve graded your minifigures accurately, you need to price them appropriately. Check out our guide on [how to price LEGO minifigures](/articles/how-to-price-lego-minifigures) to understand how condition affects market value.',
  },
  {
    id: 'block-61',
    type: 'heading',
    level: 2,
    text: 'Grading Used Sets',
  },
  {
    id: 'block-62',
    type: 'paragraph',
    text: 'Complete used sets have additional considerations beyond minifigures:',
  },
  {
    id: 'block-63',
    type: 'heading',
    level: 3,
    text: 'Completeness',
  },
  {
    id: 'block-64',
    type: 'list',
    listType: 'unordered',
    items: [
      '**100% complete:** All pieces, all minifigs, all accessories, instructions, box',
      '**Complete (no box/instructions):** All build pieces and minifigs, no packaging',
      '**Incomplete:** Missing pieces—list exactly what\'s missing',
      '**Parts lot:** Majority of set but too much missing to build fully',
    ],
  },
  {
    id: 'block-65',
    type: 'heading',
    level: 3,
    text: 'Instructions',
  },
  {
    id: 'block-66',
    type: 'list',
    listType: 'unordered',
    items: [
      'Perfect instructions: no tears, creases, or marks',
      'Good instructions: minor wear, small creases',
      'Acceptable instructions: torn corners, heavy creases but usable',
      'Missing instructions: reduces set value 10-20% (buyers can download PDF but prefer physical)',
    ],
  },
  {
    id: 'block-67',
    type: 'heading',
    level: 3,
    text: 'Stickers',
  },
  {
    id: 'block-68',
    type: 'list',
    listType: 'unordered',
    items: [
      '**Perfectly applied:** Centered, no bubbles, no edge lifting',
      '**Well applied:** Minor imperfections but looks good',
      '**Poorly applied:** Off-center, bubbles, edge damage',
      '**Damaged stickers:** Scratched, peeling, or torn = significant value loss',
      '**Unapplied stickers:** Often preferred by collectors (easier to apply perfectly themselves)',
    ],
  },
  {
    id: 'block-69',
    type: 'callout',
    calloutType: 'warning',
    content: '**Warning:** Never try to "fix" poorly applied stickers by removing and reapplying. This usually damages both the sticker and the brick. Disclose the condition as-is.',
  },
  {
    id: 'block-69a',
    type: 'paragraph',
    text: 'Looking to source inventory for reselling? [Amazon often has clearance deals](https://www.amazon.com/s?k=LEGO&tag=figtracker-20) on retired sets with perfect boxes—ideal for sellers who want to flip sealed sets.',
  },
  {
    id: 'block-70',
    type: 'heading',
    level: 2,
    text: 'Common Grading Mistakes That Cause Disputes',
  },
  {
    id: 'block-71',
    type: 'heading',
    level: 3,
    text: '1. "Complete" But With Wrong Parts',
  },
  {
    id: 'block-72',
    type: 'paragraph',
    text: 'Listing a set as "complete" when you substituted similar-looking parts is dishonest and causes major disputes.',
  },
  {
    id: 'block-73',
    type: 'paragraph',
    text: '**Example:** Replacing a dark gray brick with light gray because "it looks close enough." Serious buyers notice and will call you out.',
  },
  {
    id: 'block-74',
    type: 'heading',
    level: 3,
    text: '2. Ignoring Smell',
  },
  {
    id: 'block-75',
    type: 'paragraph',
    text: 'Smoke smell, musty smell, or chemical odors are deal-breakers for many buyers.',
  },
  {
    id: 'block-76',
    type: 'list',
    listType: 'unordered',
    items: [
      'Always disclose if items come from a smoking household',
      'Mention if there\'s musty/basement smell',
      'Clean thoroughly before listing (dish soap + water)',
    ],
  },
  {
    id: 'block-77',
    type: 'heading',
    level: 3,
    text: '3. Overestimating "Like New"',
  },
  {
    id: 'block-78',
    type: 'paragraph',
    text: 'Most sellers overgrade by one level. What you call "Like New" is probably "Excellent." What you call "Excellent" is likely "Good."',
  },
  {
    id: 'block-79',
    type: 'callout',
    calloutType: 'info',
    content: '**Solution:** When in doubt, grade down one level. Buyers who receive better-than-expected condition leave glowing reviews. Buyers who receive worse-than-expected condition leave negative feedback.',
  },
  {
    id: 'block-80',
    type: 'heading',
    level: 3,
    text: '4. Not Mentioning Glued Pieces',
  },
  {
    id: 'block-81',
    type: 'paragraph',
    text: 'If you glued pieces together (even if "it holds better now"), you MUST disclose it. Glued LEGO is considered damaged, not improved.',
  },
  {
    id: 'block-82',
    type: 'heading',
    level: 3,
    text: '5. Hiding Cracks in Photos',
  },
  {
    id: 'block-83',
    type: 'paragraph',
    text: 'Photographing minifigs at angles that hide cracks is a fast track to disputes. Show all angles, including the back and underside.',
  },
  {
    id: 'block-84',
    type: 'heading',
    level: 2,
    text: 'How to Describe Condition in Listings',
  },
  {
    id: 'block-85',
    type: 'paragraph',
    text: 'Use specific, objective language instead of vague terms:',
  },
  {
    id: 'block-86',
    type: 'heading',
    level: 3,
    text: 'Bad (Vague) Descriptions',
  },
  {
    id: 'block-87',
    type: 'list',
    listType: 'unordered',
    items: [
      '"Pretty good condition"',
      '"Some wear"',
      '"Normal used condition"',
      '"Played with but nice"',
    ],
  },
  {
    id: 'block-88',
    type: 'heading',
    level: 3,
    text: 'Good (Specific) Descriptions',
  },
  {
    id: 'block-89',
    type: 'list',
    listType: 'unordered',
    items: [
      '"Good condition - minor scratches on torso, slight fading on white helmet"',
      '"Excellent condition - assembled once for display, no play wear"',
      '"Acceptable condition - heavy scratches, small torso crack on right side, missing cape"',
      '"Like New - opened to verify contents, never assembled, no wear"',
    ],
  },
  {
    id: 'block-90',
    type: 'callout',
    calloutType: 'info',
    content: '**Pro tip:** Take detailed photos showing any defects. A clear photo of a scratch builds trust more than claiming "perfect condition" when it\'s not.',
  },
  {
    id: 'block-90a',
    type: 'paragraph',
    text: 'New to selling on Bricklink? Read our complete guide on [selling LEGO on Bricklink](/articles/selling-lego-on-bricklink) to learn store setup, shipping best practices, and how to build seller reputation.',
  },
  {
    id: 'block-91',
    type: 'heading',
    level: 2,
    text: 'Using FigTracker for Condition-Specific Pricing',
  },
  {
    id: 'block-92',
    type: 'paragraph',
    text: 'Once you\'ve accurately graded your LEGO, you need to price it appropriately for that condition.',
  },
  {
    id: 'block-93',
    type: 'paragraph',
    text: '[FigTracker](/search) pulls real-time Bricklink pricing data separated by condition (new vs used), so you can instantly see what your minifigs or sets are worth at their actual condition level.',
  },
  {
    id: 'block-94',
    type: 'list',
    listType: 'unordered',
    items: [
      'Compare "Like New" vs "Good" pricing instantly',
      'See how condition affects market value',
      'Price competitively based on accurate grading',
      'Avoid overpricing or underpricing',
    ],
  },
  {
    id: 'block-95',
    type: 'paragraph',
    text: '**Currently free to use** with no subscription required.',
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
    text: '"Should I clean LEGO before grading?"',
  },
  {
    id: 'block-98',
    type: 'paragraph',
    text: 'Yes, but carefully. Wash with mild dish soap and lukewarm water, then air dry completely. This removes dust and reveals the true condition. Don\'t use harsh chemicals or scrub printed elements aggressively.',
  },
  {
    id: 'block-99',
    type: 'heading',
    level: 3,
    text: '"Can I fix yellowed pieces?"',
  },
  {
    id: 'block-100',
    type: 'paragraph',
    text: 'Hydrogen peroxide + UV light can reverse yellowing, but it\'s time-consuming and doesn\'t always work. Disclose if you\'ve treated pieces—some collectors prefer original unaltered LEGO.',
  },
  {
    id: 'block-101',
    type: 'heading',
    level: 3,
    text: '"How do I grade custom minifigs?"',
  },
  {
    id: 'block-102',
    type: 'paragraph',
    text: 'Use the same standards but clearly label them as "custom" or "not official LEGO." Buyers need to know they\'re not getting authentic LEGO printing/molds.',
  },
  {
    id: 'block-103',
    type: 'heading',
    level: 3,
    text: '"What if I\'m still unsure of the grade?"',
  },
  {
    id: 'block-104',
    type: 'paragraph',
    text: 'Grade conservatively (down one level). It\'s better to undersell condition and surprise buyers positively than oversell and deal with returns.',
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
    text: 'Accurate condition grading is the foundation of successful LEGO selling. It protects you from disputes, builds buyer trust, and ensures you price items fairly for their actual condition.',
  },
  {
    id: 'block-107',
    type: 'paragraph',
    text: 'Remember: when in doubt, grade down. Buyers love receiving better-than-expected condition. They hate receiving worse-than-described items.',
  },
  {
    id: 'block-108',
    type: 'paragraph',
    text: 'Ready to price your accurately-graded collection? [Use FigTracker\'s instant pricing tool](/search) to get condition-specific Bricklink pricing in seconds.',
  },
];

const translations = [
  {
    locale: 'en',
    title: 'How to Grade LEGO Condition for Selling: Complete Guide',
    description: 'Learn the professional standards for grading LEGO condition. Avoid disputes, price accurately, and build buyer trust with this comprehensive grading guide for sellers.',
    metaTitle: 'How to Grade LEGO Condition for Selling | Complete Grading Guide',
    metaDescription: 'Master LEGO condition grading with industry standards. Learn to grade minifigures, sets, and sealed boxes accurately. Avoid common mistakes that cause buyer disputes.',
    metaKeywords: ['LEGO condition grading', 'how to grade LEGO', 'LEGO minifigure condition', 'Bricklink grading standards', 'LEGO selling tips', 'used LEGO condition', 'LEGO cracked torso', 'LEGO yellowing'],
  },
  {
    locale: 'es',
    title: 'Cómo Evaluar la Condición de LEGO para Vender: Guía Completa',
    description: 'Aprende los estándares profesionales para evaluar la condición de LEGO. Evita disputas, fija precios precisos y genera confianza con esta guía completa para vendedores.',
    metaTitle: 'Cómo Evaluar la Condición de LEGO para Vender | Guía Completa',
    metaDescription: 'Domina la evaluación de condición LEGO con estándares de la industria. Aprende a evaluar minifiguras, sets y cajas selladas con precisión.',
    metaKeywords: ['evaluación condición LEGO', 'cómo evaluar LEGO', 'condición minifigura LEGO', 'estándares Bricklink', 'consejos venta LEGO'],
  },
  {
    locale: 'de',
    title: 'LEGO-Zustand bewerten für Verkauf: Vollständiger Leitfaden',
    description: 'Lernen Sie professionelle Standards zur Bewertung des LEGO-Zustands. Vermeiden Sie Streitigkeiten, bewerten Sie genau und bauen Sie Käufervertrauen auf.',
    metaTitle: 'LEGO-Zustand bewerten für Verkauf | Vollständiger Leitfaden',
    metaDescription: 'Meistern Sie die LEGO-Zustandsbewertung mit Industriestandards. Lernen Sie, Minifiguren, Sets und versiegelte Boxen genau zu bewerten.',
    metaKeywords: ['LEGO Zustandsbewertung', 'LEGO bewerten', 'Minifigur Zustand', 'Bricklink Standards', 'LEGO Verkaufstipps'],
  },
  {
    locale: 'fr',
    title: 'Comment Évaluer l\'État LEGO pour Vendre : Guide Complet',
    description: 'Apprenez les standards professionnels pour évaluer l\'état LEGO. Évitez les litiges, fixez des prix précis et gagnez la confiance des acheteurs.',
    metaTitle: 'Comment Évaluer l\'État LEGO pour Vendre | Guide Complet',
    metaDescription: 'Maîtrisez l\'évaluation de l\'état LEGO avec les standards de l\'industrie. Apprenez à évaluer les minifigurines, sets et boîtes scellées avec précision.',
    metaKeywords: ['évaluation état LEGO', 'comment évaluer LEGO', 'état minifigurine LEGO', 'standards Bricklink', 'conseils vente LEGO'],
  },
];

async function createArticle() {
  console.log('Creating "How to Grade LEGO Condition" article...\n');

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    console.log('❌ Article already exists');
    await prisma.$disconnect();
    process.exit(1);
  }

  const article = await prisma.article.create({
    data: {
      slug,
      status: 'published',
      featured: true,
      publishedAt: new Date(),
      contentBlocks: JSON.stringify(contentBlocksEN),
      translations: JSON.stringify(translations),
      readTimeMinutes: 14,
      category: 'Guide',
    },
  });

  console.log('✅ Article created:', article.id);
  console.log(`📝 View at: https://figtracker.ericksu.com/articles/${slug}`);

  await prisma.$disconnect();
}

createArticle().catch(console.error);
