// Free template-based listing generator (no AI, no API costs)

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
}

// Extract clean character name from full minifig name
function extractCharacterName(fullName: string): string {
  // Remove theme prefix (e.g., "Star Wars - Captain Rex..." → "Captain Rex...")
  let cleaned = fullName.replace(/^[^-]+-\s*/, '');

  // Take everything before first comma or parenthesis
  const commaIndex = cleaned.indexOf(',');
  const parenIndex = cleaned.indexOf('(');

  let endIndex = cleaned.length;
  if (commaIndex > -1 && parenIndex > -1) {
    endIndex = Math.min(commaIndex, parenIndex);
  } else if (commaIndex > -1) {
    endIndex = commaIndex;
  } else if (parenIndex > -1) {
    endIndex = parenIndex;
  }

  return cleaned.substring(0, endIndex).trim();
}

// Extract theme from minifig name
export function extractTheme(name: string): string {
  const match = name.match(/^([^-]+)/);
  return match ? match[1].trim() : 'LEGO';
}

// Format condition for display
function formatCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    'new': 'New',
    'like_new': 'Like New',
    'excellent': 'Excellent',
    'good': 'Good',
    'fair': 'Fair'
  };
  return conditionMap[condition] || condition;
}

// Generate eBay listing
function generateEbayListing(data: ListingData): { title: string; description: string } {
  const characterName = extractCharacterName(data.minifigName);
  const formattedCondition = formatCondition(data.condition);

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

  description += `\n\nPrice: $${data.suggestedPrice.toFixed(2)}`;

  if (data.quantity > 1) {
    description += `\nQuantity Available: ${data.quantity}`;
  }

  description += `\n\nShips fast and securely in protective packaging.
From a smoke-free home.
Feel free to message with any questions!

✓ Authentic LEGO
✓ Fast shipping
✓ Carefully packaged

Offers accepted - click "Make Offer" to negotiate!`;

  return { title, description };
}

// Generate Facebook Marketplace listing
function generateFacebookListing(data: ListingData): { title: string; description: string } {
  const characterName = extractCharacterName(data.minifigName);
  const formattedCondition = formatCondition(data.condition);

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

  description += `\n\nAsking $${data.suggestedPrice.toFixed(2)}`;

  if (data.quantity > 1) {
    description += `\n\n${data.quantity} available`;
  }

  description += `\n\nLocal pickup or I can ship!
Bundle discounts available if you're buying multiple 😊

From smoke-free home
Cash or Venmo accepted`;

  return { title, description };
}

// Generate BrickLink listing
function generateBricklinkListing(data: ListingData): { title: string; description: string } {
  const formattedCondition = formatCondition(data.condition);

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

  description += `\n\nPrice: $${data.suggestedPrice.toFixed(2)}

Authentic LEGO minifigure from private collection.
Carefully packaged and shipped with tracking.

Contact with questions before purchasing.`;

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
