// Free template-based listing generator (no AI, no API costs)

interface ListingPreferences {
  // Facebook & Vinted
  offersShipping?: boolean;
  offersLocalPickup?: boolean;
  offersBundleDiscount?: boolean;
  acceptsCash?: boolean;
  acceptsVenmo?: boolean;
  acceptsPayPal?: boolean;

  // eBay
  acceptsOffers?: boolean;
  fastShipping?: boolean;
  carefulPackaging?: boolean;
  messageWithQuestions?: boolean;

  // All platforms
  smokeFreeHome?: boolean;
  shipsWithTracking?: boolean;
}

interface ListingData {
  // Common fields
  theme: string;
  suggestedPrice: number;
  currentAvg: number;
  currentLowest: number;
  condition: string;
  quantity: number;
  preferences?: ListingPreferences;
  itemType?: 'minifig' | 'set';

  // Minifig fields
  minifigName?: string;
  minifigNo?: string;
  accessories?: string;
  knownFlaws?: string;

  // Set fields
  setName?: string;
  setNo?: string;
  categoryName?: string;
  boxCondition?: string;
  completeness?: string;
  buildingStatus?: string;
  instructionsIncluded?: boolean;
  minifigsIncluded?: boolean;
  setNotes?: string;
}

// Extract clean character name from full minifig name
function extractCharacterName(fullName: string): string {
  // Handle names with parentheses like "Boba Fett (Cloud City - Printed Arms & Legs)"
  // We want just "Boba Fett"

  // First check if there's a parenthesis - if so, take everything before it
  const parenIndex = fullName.indexOf('(');
  if (parenIndex > -1) {
    return fullName.substring(0, parenIndex).trim();
  }

  // If no parenthesis, check for comma
  const commaIndex = fullName.indexOf(',');
  if (commaIndex > -1) {
    return fullName.substring(0, commaIndex).trim();
  }

  // Otherwise return the whole name
  return fullName.trim();
}

// Extract theme from minifig name
export function extractTheme(name: string): string {
  const match = name.match(/^([^-]+)/);
  return match ? match[1].trim() : 'LEGO';
}

// Format condition for display based on platform
function formatCondition(condition: string, platform: string): string {
  const facebookConditions: Record<string, string> = {
    'new': 'New',
    'like_new': 'Like new',
    'good': 'Good',
    'fair': 'Fair'
  };

  const ebayConditions: Record<string, string> = {
    'new': 'New',
    'like_new': 'Like New',
    'very_good': 'Very Good',
    'good': 'Good',
    'acceptable': 'Acceptable'
  };

  const bricklinkConditions: Record<string, string> = {
    'new': 'New',
    'like_new': 'Used - Like New',
    'very_good': 'Used - Very Good',
    'good': 'Used - Good',
    'acceptable': 'Used - Acceptable'
  };

  const vintedConditions: Record<string, string> = {
    'new': 'New with tags',
    'like_new': 'Very good',
    'good': 'Good',
    'fair': 'Satisfactory'
  };

  if (platform === 'facebook') return facebookConditions[condition] || condition;
  if (platform === 'ebay') return ebayConditions[condition] || condition;
  if (platform === 'bricklink') return bricklinkConditions[condition] || condition;
  if (platform === 'vinted') return vintedConditions[condition] || condition;

  return condition;
}

// Generate eBay listing
function generateEbayListing(data: ListingData): { title: string; description: string } {
  const characterName = extractCharacterName(data.minifigName!);
  const formattedCondition = formatCondition(data.condition, 'ebay');
  const prefs = data.preferences || {};

  // eBay title: Character + ID + Theme + Condition (SEO optimized)
  const title = `LEGO ${data.theme} ${characterName} (${data.minifigNo}) Genuine Minifigure - ${formattedCondition} Condition`;

  // eBay description: Professional, detailed
  let description = `100% authentic LEGO minifigure from a trusted collector.

Character: ${characterName}
Item Number: ${data.minifigNo}
Theme: ${data.theme}
Condition: ${formattedCondition}`;

  if (data.knownFlaws) {
    description += ` - ${data.knownFlaws}`;
  }

  if (data.accessories) {
    const accessoriesList = data.accessories.split(',').map(a => `• ${a.trim()}`).join('\n');
    description += `\n\nIncludes:\n${accessoriesList}`;
  }

  if (data.quantity > 1) {
    description += `\n\nQuantity Available: ${data.quantity}`;
  }

  // Build dynamic shipping/home info
  const shippingInfo: string[] = [];
  if (prefs.fastShipping) shippingInfo.push('Ships fast and securely in protective packaging.');
  if (prefs.smokeFreeHome) shippingInfo.push('From a smoke-free home.');
  if (prefs.messageWithQuestions) shippingInfo.push('Feel free to message with any questions!');

  if (shippingInfo.length > 0) {
    description += `\n\n${shippingInfo.join('\n')}`;
  }

  // Build checkmarks section
  const checkmarks: string[] = ['✓ Authentic LEGO'];
  if (prefs.fastShipping) checkmarks.push('✓ Fast shipping');
  if (prefs.carefulPackaging) checkmarks.push('✓ Carefully packaged');

  if (checkmarks.length > 0) {
    description += `\n\n${checkmarks.join('\n')}`;
  }

  if (prefs.acceptsOffers) {
    description += `\n\nOffers accepted - click "Make Offer" to negotiate!`;
  }

  return { title, description };
}

// Generate Facebook Marketplace listing
function generateFacebookListing(data: ListingData): { title: string; description: string } {
  const characterName = extractCharacterName(data.minifigName!);
  const formattedCondition = formatCondition(data.condition, 'facebook');
  const prefs = data.preferences || {};

  // Facebook title: Casual, under 100 chars
  const title = `LEGO ${data.theme} ${characterName} Minifigure - ${formattedCondition}`;

  // Facebook description: Casual, friendly
  let description = `Authentic LEGO ${characterName} minifigure (${data.minifigNo!})

Condition: ${formattedCondition}`;

  if (data.knownFlaws) {
    description += ` - ${data.knownFlaws}`;
  }

  if (data.accessories) {
    description += `\nComes with: ${data.accessories}`;
  }

  if (data.quantity > 1) {
    description += `\n\n${data.quantity} available`;
  }

  // Build dynamic preferences section
  const deliveryOptions: string[] = [];
  if (prefs.offersLocalPickup) deliveryOptions.push('Local pickup');
  if (prefs.offersShipping) deliveryOptions.push('I can ship');

  if (deliveryOptions.length > 0) {
    description += `\n\n${deliveryOptions.join(' or ')}!`;
  }

  if (prefs.offersBundleDiscount) {
    description += `\nBundle discounts available if you're buying multiple 😊`;
  }

  // Build payment/home info section
  const extraInfo: string[] = [];
  if (prefs.smokeFreeHome) extraInfo.push('From smoke-free home');

  const paymentMethods: string[] = [];
  if (prefs.acceptsCash) paymentMethods.push('Cash');
  if (prefs.acceptsVenmo) paymentMethods.push('Venmo');
  if (prefs.acceptsPayPal) paymentMethods.push('PayPal');

  if (paymentMethods.length > 0) {
    extraInfo.push(`${paymentMethods.join(' or ')} accepted`);
  }

  if (extraInfo.length > 0) {
    description += `\n\n${extraInfo.join('\n')}`;
  }

  return { title, description };
}

// Generate BrickLink listing
function generateBricklinkListing(data: ListingData): { title: string; description: string } {
  const formattedCondition = formatCondition(data.condition, 'bricklink');
  const prefs = data.preferences || {};

  // BrickLink title: Technical, precise with ID
  const title = `${data.minifigNo} - ${extractCharacterName(data.minifigName!)} - ${formattedCondition}`;

  // BrickLink description: Technical, accurate
  let description = `Item: ${data.minifigNo}
Theme: ${data.theme}
Condition: ${formattedCondition}`;

  if (data.knownFlaws) {
    description += `\n\nCondition Notes:\n${data.knownFlaws}`;
  }

  if (data.accessories) {
    description += `\n\nIncludes:\n${data.accessories.split(',').map(a => `- ${a.trim()}`).join('\n')}`;
  }

  if (data.quantity > 1) {
    description += `\n\nQuantity: ${data.quantity}`;
  }

  description += `\n\nAuthentic LEGO minifigure from private collection.`;

  // Build shipping/packaging info
  const shippingInfo: string[] = [];
  if (prefs.carefulPackaging) shippingInfo.push('Carefully packaged');
  if (prefs.shipsWithTracking) shippingInfo.push('shipped with tracking');

  if (shippingInfo.length > 0) {
    description += `\n${shippingInfo.join(' and ')}.`;
  }

  if (prefs.smokeFreeHome) {
    description += `\nFrom smoke-free home.`;
  }

  if (prefs.messageWithQuestions) {
    description += `\n\nContact with questions before purchasing.`;
  }

  return { title, description };
}

// Generate Vinted listing
function generateVintedListing(data: ListingData): { title: string; description: string } {
  const characterName = extractCharacterName(data.minifigName!);
  const formattedCondition = formatCondition(data.condition, 'vinted');
  const prefs = data.preferences || {};

  // Vinted title: Casual, under 100 chars
  const title = `LEGO ${data.theme} ${characterName} Minifigure`;

  // Vinted description: Very casual, friendly
  let description = `Authentic LEGO ${characterName} minifigure 🧱

Item number: ${data.minifigNo}
Condition: ${formattedCondition}`;

  if (data.knownFlaws) {
    description += ` - ${data.knownFlaws}`;
  }

  if (data.accessories) {
    description += `\n\nIncludes: ${data.accessories}`;
  }

  if (data.quantity > 1) {
    description += `\n\n${data.quantity} available!`;
  }

  if (prefs.offersBundleDiscount) {
    description += `\n\nBuying multiple? I offer bundle discounts! 💰`;
  }

  if (prefs.smokeFreeHome) {
    description += `\n\nFrom a smoke-free, pet-free home.`;
  }

  description += `\n\nFeel free to message if you have any questions! 😊`;

  return { title, description };
}

// Main function to generate listing based on platform
export function generateListing(
  platform: 'facebook' | 'ebay' | 'bricklink' | 'vinted',
  data: ListingData
): { title: string; description: string } {
  // Handle sets with basic template for now
  if (data.itemType === 'set' && data.setName && data.setNo) {
    return generateSetListing(platform, data);
  }

  // Original minifig templates
  switch (platform) {
    case 'facebook':
      return generateFacebookListing(data);
    case 'ebay':
      return generateEbayListing(data);
    case 'bricklink':
      return generateBricklinkListing(data);
    case 'vinted':
      return generateVintedListing(data);
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}

// Simple set listing generator
function generateSetListing(
  platform: string,
  data: ListingData
): { title: string; description: string } {
  const prefs = data.preferences || {};

  let title = `LEGO ${data.theme} ${data.setNo} - ${data.setName}`;
  if (title.length > 100) {
    title = `LEGO ${data.setNo} ${data.setName!.substring(0, 70)}...`;
  }

  const formattedCondition = formatCondition(data.condition, platform);
  let description = `LEGO ${data.theme} Set ${data.setNo} - ${data.setName}\n\nCondition: ${formattedCondition}`;

  // Poly bags, foil packs, and paper bags ship in a sealed plastic/paper bag, not a box - use the right word
  // Matches the detection convention used in lib/boxes-data.ts (category for polybags, name for foil packs),
  // plus "paper bag" which is a separate BrickLink naming convention not covered there
  const categoryL = (data.categoryName || '').toLowerCase();
  const setNameL = (data.setName || '').toLowerCase();
  const isPolybag = categoryL.includes('polybag') || setNameL.includes('polybag') || setNameL.includes('foil pack') || setNameL.includes('paper bag');
  const packagingLabel = isPolybag ? 'Bag' : 'Box';

  // Box/bag condition
  if (data.boxCondition) {
    const boxText: Record<string, string> = isPolybag ? {
      'sealed': 'Bag sealed (never opened)',
      'opened_new': 'Bag opened (set unbuilt)',
      'with_box': 'Bag included',
      'no_box': 'No original bag'
    } : {
      'sealed': 'Box sealed (never opened)',
      'opened_new': 'Box opened (set unbuilt)',
      'with_box': 'Box included',
      'no_box': 'No original box'
    };
    description += `\n${packagingLabel}: ${boxText[data.boxCondition] || data.boxCondition}`;
  }

  // Smart redundancy elimination:
  // - Sealed box implies bags are sealed AND 100% complete
  // - Any other box state could have variations, so show all details
  // - This handles edge cases like "new but opened to remove minifigs"
  const shouldHideRedundantFields = data.boxCondition === 'sealed';

  // Building status - hide if box is sealed (only show "never built" if condition is actually "new")
  if (data.buildingStatus && !shouldHideRedundantFields) {
    const buildText: Record<string, string> = {
      'unbuilt': data.condition === 'new' ? 'Bags sealed, never built' : 'Unassembled',
      'unbuilt_bags_opened': 'Bags opened, never built',
      'partially_built': 'Partially built',
      'fully_built': 'Fully assembled',
      'disassembled': 'Built then disassembled'
    };
    description += `\nBuilding Status: ${buildText[data.buildingStatus] || data.buildingStatus}`;
  }

  // Completeness - hide if box is sealed
  if (data.completeness && !shouldHideRedundantFields) {
    const completeText: Record<string, string> = {
      'complete': '100% complete',
      'complete_verified': '100% complete (verified piece count)',
      'appears_complete': 'Appears complete',
      'missing_minor': 'Missing minor pieces',
      'missing_major': 'Missing some pieces'
    };
    description += `\nCompleteness: ${completeText[data.completeness] || data.completeness}`;
  }

  // Instructions and minifigs
  if (data.instructionsIncluded !== undefined) {
    description += `\nInstructions: ${data.instructionsIncluded ? 'Included' : 'Not included'}`;
  }
  if (data.minifigsIncluded !== undefined) {
    description += `\nMinifigures: ${data.minifigsIncluded ? 'All included' : 'Not included'}`;
  }

  if (data.setNotes) {
    description += `\n\nNotes: ${data.setNotes}`;
  }

  if (data.quantity > 1) {
    description += `\n\n${data.quantity} available`;
  }

  // Delivery options
  const deliveryOptions: string[] = [];
  if (prefs.offersLocalPickup) deliveryOptions.push('Local pickup available');
  if (prefs.offersShipping) deliveryOptions.push('Shipping available');
  if (deliveryOptions.length > 0) {
    description += `\n\n${deliveryOptions.join('\n')}`;
  }

  if (prefs.offersBundleDiscount) {
    description += `\nBundle discounts available`;
  }

  // Extra info
  const extraInfo: string[] = [];
  if (prefs.smokeFreeHome) extraInfo.push('From smoke-free home');
  const paymentMethods: string[] = [];
  if (prefs.acceptsCash) paymentMethods.push('Cash');
  if (prefs.acceptsVenmo) paymentMethods.push('Venmo');
  if (prefs.acceptsPayPal) paymentMethods.push('PayPal');
  if (paymentMethods.length > 0) {
    extraInfo.push(`Payment: ${paymentMethods.join(', ')}`);
  }
  if (extraInfo.length > 0) {
    description += `\n\n${extraInfo.join('\n')}`;
  }

  return { title, description };
}
