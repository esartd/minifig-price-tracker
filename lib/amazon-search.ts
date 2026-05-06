/**
 * Amazon Product Search for LEGO Sets
 *
 * Uses Amazon PA-API SearchItems operation to find ASINs for LEGO sets
 */

import crypto from 'crypto';

const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID || '';
const SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY || '';
const PARTNER_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'ericksu0c-20';
const HOST = 'webservices.amazon.com';
const REGION = 'us-east-1';
const SERVICE = 'ProductAdvertisingAPI';

export interface AmazonSearchResult {
  asin: string;
  title: string;
  matchConfidence: 'high' | 'medium' | 'low';
}

/**
 * Generate AWS Signature V4 for PA-API request
 */
function generateSignature(
  method: string,
  path: string,
  queryString: string,
  payload: string,
  timestamp: string,
  date: string
): string {
  const canonicalRequest = [
    method,
    path,
    queryString,
    `content-type:application/json; charset=utf-8\nhost:${HOST}\nx-amz-date:${timestamp}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems`,
    'content-type;host;x-amz-date;x-amz-target',
    crypto.createHash('sha256').update(payload).digest('hex'),
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${date}/${REGION}/${SERVICE}/aws4_request`,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  const kDate = crypto.createHmac('sha256', `AWS4${SECRET_KEY}`).update(date).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(REGION).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(SERVICE).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  return crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
}

/**
 * Make PA-API SearchItems request
 */
async function callSearchApi(keywords: string): Promise<any> {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.slice(0, 8);

  const payload = JSON.stringify({
    Keywords: keywords,
    SearchIndex: 'Toys',
    ItemCount: 5, // Get top 5 results to validate
    Resources: [
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.SavingBasis',
    ],
    PartnerTag: PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com',
  });

  const signature = generateSignature('POST', '/paapi5/searchitems', '', payload, timestamp, date);
  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${date}/${REGION}/${SERVICE}/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-target, Signature=${signature}`;

  const response = await fetch(`https://${HOST}/paapi5/searchitems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Host: HOST,
      'X-Amz-Date': timestamp,
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      Authorization: authorization,
    },
    body: payload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PA-API SearchItems error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Search Amazon for a LEGO set by set number and name
 *
 * @param setNumber - LEGO set number (e.g., "75192" or "75192-1")
 * @param setName - Set name for better matching
 * @returns ASIN if found, null otherwise
 */
export async function searchAmazonForSet(
  setNumber: string,
  setName: string
): Promise<string | null> {
  try {
    // Strip "-1" suffix if present (e.g., "75192-1" → "75192")
    const cleanSetNumber = setNumber.replace(/-1$/, '');

    // Build search query: "LEGO {setNumber} {setName}"
    const keywords = `LEGO ${cleanSetNumber} ${setName}`;

    console.log(`[Amazon Search] Searching for: "${keywords}"`);

    const data = await callSearchApi(keywords);

    if (!data?.SearchResult?.Items || data.SearchResult.Items.length === 0) {
      console.log(`[Amazon Search] No results for set ${setNumber}`);
      return null;
    }

    // Find best match by checking if title contains "LEGO" and set number
    for (const item of data.SearchResult.Items) {
      const title = item.ItemInfo?.Title?.DisplayValue || '';
      const asin = item.ASIN;

      if (!asin || !title) continue;

      const titleLower = title.toLowerCase();
      const hasLego = titleLower.includes('lego');
      const hasSetNumber = titleLower.includes(cleanSetNumber.toLowerCase());

      // High confidence: Title contains both "LEGO" and set number
      if (hasLego && hasSetNumber) {
        console.log(`[Amazon Search] Found ASIN ${asin} for set ${setNumber}: "${title}"`);
        return asin;
      }
    }

    // Fallback: Return first result if it at least contains "LEGO"
    const firstItem = data.SearchResult.Items[0];
    const firstTitle = firstItem.ItemInfo?.Title?.DisplayValue || '';
    if (firstTitle.toLowerCase().includes('lego')) {
      console.log(
        `[Amazon Search] Fallback ASIN ${firstItem.ASIN} for set ${setNumber}: "${firstTitle}"`
      );
      return firstItem.ASIN;
    }

    console.log(`[Amazon Search] No valid match found for set ${setNumber}`);
    return null;
  } catch (error: any) {
    console.error(`[Amazon Search] Error searching for set ${setNumber}:`, error.message);
    return null;
  }
}

/**
 * Check if Amazon search is properly configured
 */
export function isAmazonSearchConfigured(): boolean {
  return !!(ACCESS_KEY && SECRET_KEY && PARTNER_TAG);
}
