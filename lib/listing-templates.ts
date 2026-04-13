// Free template-based listing generator (no AI, no API costs)

interface ListingPreferences {
  // Facebook
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
  minifigName: string;
  minifigNo: string;
  theme: string;
  suggestedPrice: number;
  currentAvg: number;
  currentLowest: number;
  condition: string;
  accessories?: string;
  knownFlaws?: string;
  quantity: number;
  preferences?: ListingPreferences;
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

  if (platform === 'facebook') return facebookConditions[condition] || condition;
  if (platform === 'ebay') return ebayConditions[condition] || condition;
  if (platform === 'bricklink') return bricklinkConditions[condition] || condition;

  return condition;
}

// Generate eBay listing
function generateEbayListing(data: ListingData): { title: string; description: string } {
  const characterName = extractCharacterName(data.minifigName);
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
  const characterName = extractCharacterName(data.minifigName);
  const formattedCondition = formatCondition(data.condition, 'facebook');
  const prefs = data.preferences || {};

  // Facebook title: Casual, under 100 chars
  const title = `LEGO ${data.theme} ${characterName} Minifigure - ${formattedCondition}`;

  // Facebook description: Casual, friendly
  let description = `Authentic LEGO ${characterName} minifigure (${data.minifigNo})

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
  const title = `${data.minifigNo} - ${extractCharacterName(data.minifigName)} - ${formattedCondition}`;

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

// Main function to generate listing based on platform
export function generateListing(
  platform: 'facebook' | 'ebay' | 'bricklink',
  data: ListingData
): { title: string; description: string } {
  switch (platform) {
    case 'facebook':
      return generateFacebookListing(data);
    case 'ebay':
      return generateEbayListing(data);
    case 'bricklink':
      return generateBricklinkListing(data);
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}
