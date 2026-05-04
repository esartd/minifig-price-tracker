/**
 * Amazon Product Advertising API (PA-API) 5.0 Direct REST Implementation
 * No SDK dependencies - pure REST API calls with AWS Signature V4
 */

import crypto from 'crypto';

const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID || '';
const SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY || '';
const PARTNER_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'ericksu0c-20';
const HOST = 'webservices.amazon.com';
const REGION = 'us-east-1';
const SERVICE = 'ProductAdvertisingAPI';

export interface AmazonPricing {
  asin: string;
  title: string | null;
  currentPrice: number | null;
  listPrice: number | null;
  discountPercent: number | null;
  isPrime: boolean;
  isAvailable: boolean;
  currency: string;
  productUrl: string;
  imageUrl: string | null;
  lastUpdated: Date;
}

/**
 * Generate AWS Signature V4 for PA-API request
 */
function generateSignature(method: string, path: string, queryString: string, payload: string, timestamp: string, date: string): string {
  const canonicalRequest = [
    method,
    path,
    queryString,
    `content-type:application/json; charset=utf-8\nhost:${HOST}\nx-amz-date:${timestamp}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems`,
    'content-type;host;x-amz-date;x-amz-target',
    crypto.createHash('sha256').update(payload).digest('hex')
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${date}/${REGION}/${SERVICE}/aws4_request`,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const kDate = crypto.createHmac('sha256', `AWS4${SECRET_KEY}`).update(date).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(REGION).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(SERVICE).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  return crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
}

/**
 * Make PA-API GetItems request
 */
async function callPaApi(asins: string[]): Promise<any> {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.slice(0, 8);

  const payload = JSON.stringify({
    ItemIds: asins,
    Resources: [
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.SavingBasis',
      'Offers.Listings.Availability.Message',
      'Offers.Listings.DeliveryInfo.IsPrimeEligible',
      'Images.Primary.Large'
    ],
    PartnerTag: PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com'
  });

  const signature = generateSignature('POST', '/paapi5/getitems', '', payload, timestamp, date);
  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${date}/${REGION}/${SERVICE}/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-target, Signature=${signature}`;

  const response = await fetch(`https://${HOST}/paapi5/getitems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Host': HOST,
      'X-Amz-Date': timestamp,
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
      'Authorization': authorization
    },
    body: payload
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PA-API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch pricing data for a single ASIN
 */
export async function fetchAmazonPrice(asin: string): Promise<AmazonPricing | null> {
  try {
    const data = await callPaApi([asin]);

    if (!data?.ItemsResult?.Items?.[0]) {
      console.warn(`No data returned for ASIN: ${asin}`);
      return null;
    }

    const item = data.ItemsResult.Items[0];
    const listing = item.Offers?.Listings?.[0];

    const currentPrice = listing?.Price?.Amount || null;
    const listPrice = listing?.SavingBasis?.Amount || currentPrice;
    const currency = listing?.Price?.Currency || 'USD';
    const isPrime = listing?.DeliveryInfo?.IsPrimeEligible || false;
    const isAvailable = listing?.Availability?.Message === 'In Stock';
    const title = item.ItemInfo?.Title?.DisplayValue || null;
    const imageUrl = item.Images?.Primary?.Large?.URL || null;
    const productUrl = item.DetailPageURL || `https://www.amazon.com/dp/${asin}`;

    let discountPercent = null;
    if (currentPrice && listPrice && listPrice > currentPrice) {
      discountPercent = Math.round(((listPrice - currentPrice) / listPrice) * 100);
    }

    return {
      asin,
      title,
      currentPrice,
      listPrice,
      discountPercent,
      isPrime,
      isAvailable,
      currency,
      productUrl,
      imageUrl,
      lastUpdated: new Date()
    };
  } catch (error: any) {
    console.error(`Error fetching price for ASIN ${asin}:`, error.message);
    return null;
  }
}

/**
 * Fetch pricing data for multiple ASINs (batch - up to 10)
 */
export async function fetchAmazonPricesBatch(asins: string[]): Promise<Map<string, AmazonPricing>> {
  const results = new Map<string, AmazonPricing>();

  for (let i = 0; i < asins.length; i += 10) {
    const batch = asins.slice(i, i + 10);

    try {
      const data = await callPaApi(batch);

      if (data?.ItemsResult?.Items) {
        for (const item of data.ItemsResult.Items) {
          const asin = item.ASIN;
          if (!asin) continue;

          const listing = item.Offers?.Listings?.[0];
          const currentPrice = listing?.Price?.Amount || null;
          const listPrice = listing?.SavingBasis?.Amount || currentPrice;
          const currency = listing?.Price?.Currency || 'USD';
          const isPrime = listing?.DeliveryInfo?.IsPrimeEligible || false;
          const isAvailable = listing?.Availability?.Message === 'In Stock';
          const title = item.ItemInfo?.Title?.DisplayValue || null;
          const imageUrl = item.Images?.Primary?.Large?.URL || null;
          const productUrl = item.DetailPageURL || `https://www.amazon.com/dp/${asin}`;

          let discountPercent = null;
          if (currentPrice && listPrice && listPrice > currentPrice) {
            discountPercent = Math.round(((listPrice - currentPrice) / listPrice) * 100);
          }

          results.set(asin, {
            asin,
            title,
            currentPrice,
            listPrice,
            discountPercent,
            isPrime,
            isAvailable,
            currency,
            productUrl,
            imageUrl,
            lastUpdated: new Date()
          });
        }
      }

      // Rate limit: 1 req/sec
      if (i + 10 < asins.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error: any) {
      console.error(`Error fetching batch prices:`, error.message);
    }
  }

  return results;
}

/**
 * Format price for display
 */
export function formatPrice(price: number | null, currency: string = 'USD'): string {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(price);
}

/**
 * Check if PA-API is configured
 */
export function isAmazonPricingConfigured(): boolean {
  return !!(ACCESS_KEY && SECRET_KEY && PARTNER_TAG);
}
