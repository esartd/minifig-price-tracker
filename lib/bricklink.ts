import crypto from 'crypto';
import { Minifigure, PriceGuide, PricingData, SetInfo } from '@/types';
import { prisma } from './prisma';

export class BricklinkAPI {
  private consumerKey: string;
  private consumerSecret: string;
  private tokenValue: string;
  private tokenSecret: string;
  private baseURL = 'https://api.bricklink.com/api/store/v1';
  private static readonly MAX_CALLS_PER_DAY = 5000; // BrickLink ToS: 5,000 calls/day limit
  private static readonly MIN_DELAY_MS = 3000; // 3 seconds between calls
  private static lastRequestTime = 0;

  constructor() {
    // Load from environment variables
    this.consumerKey = process.env.BRICKLINK_CONSUMER_KEY || '';
    this.consumerSecret = process.env.BRICKLINK_CONSUMER_SECRET || '';
    this.tokenValue = process.env.BRICKLINK_TOKEN_VALUE || '';
    this.tokenSecret = process.env.BRICKLINK_TOKEN_SECRET || '';

    // DEBUG: Log first 8 characters of token to verify which one is loaded
    console.log('🔑 BrickLink credentials loaded:', {
      consumerKey: this.consumerKey.substring(0, 8) + '...',
      tokenValue: this.tokenValue.substring(0, 8) + '...',
      tokenSecret: this.tokenSecret.substring(0, 8) + '...'
    });
  }

  /**
   * Rate limiter - ENFORCES BrickLink API Terms of Service
   * - Maximum 5,000 calls per day
   * - Minimum 3 seconds between requests
   * - Prevents accidental blocking
   */
  private async enforceRateLimit(): Promise<void> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get today's call count from database
    let tracker = await prisma.apiCallTracker.findUnique({
      where: { date: today }
    });

    // Create new tracker if doesn't exist
    if (!tracker) {
      tracker = await prisma.apiCallTracker.create({
        data: {
          date: today,
          call_count: 0
        }
      });
    }

    // HARD LIMIT: Prevent exceeding 5,000 calls/day
    if (tracker.call_count >= BricklinkAPI.MAX_CALLS_PER_DAY) {
      throw new Error(
        `🚫 BrickLink API daily limit reached (${BricklinkAPI.MAX_CALLS_PER_DAY} calls/day). ` +
        `Resets at midnight. This protects you from being blocked.`
      );
    }

    // Enforce minimum delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - BricklinkAPI.lastRequestTime;
    if (timeSinceLastRequest < BricklinkAPI.MIN_DELAY_MS) {
      const delayNeeded = BricklinkAPI.MIN_DELAY_MS - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }

    // Update tracker
    await prisma.apiCallTracker.update({
      where: { date: today },
      data: {
        call_count: tracker.call_count + 1,
        last_call_at: new Date()
      }
    });

    BricklinkAPI.lastRequestTime = Date.now();

    // Warn when approaching limit
    if (tracker.call_count >= BricklinkAPI.MAX_CALLS_PER_DAY * 0.9) {
      console.warn(
        `⚠️  WARNING: Approaching daily API limit (${tracker.call_count + 1}/${BricklinkAPI.MAX_CALLS_PER_DAY})`
      );
    }
  }

  private generateOAuthSignature(
    method: string,
    baseUrl: string,
    params: Record<string, string>
  ): string {
    // Create parameter string
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${this.encodeRFC3986(key)}=${this.encodeRFC3986(params[key])}`)
      .join('&');

    // Create signature base string using base URL without query params
    const signatureBaseString = [
      method.toUpperCase(),
      this.encodeRFC3986(baseUrl),
      this.encodeRFC3986(sortedParams),
    ].join('&');

    // Create signing key
    const signingKey = `${this.encodeRFC3986(this.consumerSecret)}&${this.encodeRFC3986(
      this.tokenSecret
    )}`;

    // Generate signature
    const hmac = crypto.createHmac('sha1', signingKey);
    hmac.update(signatureBaseString);
    return hmac.digest('base64');
  }

  private encodeRFC3986(value: string): string {
    return encodeURIComponent(value).replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
  }

  private async makeRequest(endpoint: string, method = 'GET'): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;

    // ENFORCE BrickLink API rate limits (5,000 calls/day, 3 second delays)
    await this.enforceRateLimit();

    // Parse URL to separate base URL and query parameters
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    const queryParams: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');

    const oauthParams: Record<string, string> = {
      oauth_consumer_key: this.consumerKey,
      oauth_token: this.tokenValue,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0',
    };

    // Combine OAuth params and query params for signature
    const allParams: Record<string, string> = { ...oauthParams, ...queryParams };
    const signature = this.generateOAuthSignature(method, baseUrl, allParams);
    oauthParams.oauth_signature = signature;

    // Build Authorization header
    const authHeader =
      'OAuth ' +
      Object.keys(oauthParams)
        .map((key) => `${key}="${this.encodeRFC3986(oauthParams[key])}"`)
        .join(', ');

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Bricklink API error: ${response.statusText}`);
    }

    const data = await response.json();

    // BrickLink returns 200 OK even for errors, check meta field
    if (data.meta && data.meta.code && data.meta.code !== 200) {
      console.error(`BrickLink API error: ${data.meta.message} - ${data.meta.description}`);
      return null;
    }

    return data.data;
  }

  async searchMinifigures(query: string): Promise<Minifigure[]> {
    // Search in the catalog for minifigures
    // Note: Bricklink API doesn't have direct search, so we'll need to get catalog and filter
    // For now, return mock data with a note to implement actual search
    return [];
  }

  async getMinifigureByNumber(itemNo: string): Promise<Minifigure | null> {
    try {
      const data = await this.makeRequest(`/items/MINIFIG/${itemNo}`);

      // If data is null/undefined, item doesn't exist
      if (!data) {
        return null;
      }

      // Bricklink stores images at: https://img.bricklink.com/ItemImage/MN/0/{item_no}.png
      let imageUrl = data.image_url || data.thumbnail_url || `https://img.bricklink.com/ItemImage/MN/0/${itemNo}.png`;

      // Add protocol if missing (Bricklink returns URLs starting with //)
      if (imageUrl.startsWith('//')) {
        imageUrl = `https:${imageUrl}`;
      }

      return {
        no: data.no,
        name: data.name,
        category_id: data.category_id,
        image_url: imageUrl,
      };
    } catch (error) {
      // Item doesn't exist or API error
      return null;
    }
  }

  async getPriceGuide(
    itemNo: string,
    condition: 'N' | 'U' = 'N'
  ): Promise<PriceGuide | null> {
    try {
      const data = await this.makeRequest(
        `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}&country_code=US&region=north_america`
      );
      return data;
    } catch (error) {
      console.error('Error fetching price guide:', error);
      return null;
    }
  }

  async getSetsContainingMinifig(itemNo: string): Promise<SetInfo[]> {
    // NOTE: This method is not currently used in the app
    // Left here for potential future use, but scraping is not recommended for production
    // BrickLink API's /subsets endpoint returns PARTS in a minifig, not SETS containing it
    return [];
  }

  async calculatePricingData(itemNo: string, condition: 'new' | 'used'): Promise<PricingData> {
    const conditionCode = condition === 'new' ? 'N' : 'U';

    // Check cache first
    const cached = await prisma.priceCache.findUnique({
      where: {
        minifigure_no_condition: {
          minifigure_no: itemNo,
          condition: condition
        }
      }
    });

    // If cache exists and hasn't expired, return cached data
    if (cached && cached.expires_at > new Date()) {
      return {
        sixMonthAverage: cached.six_month_avg,
        currentAverage: cached.current_avg,
        currentLowest: cached.current_lowest,
        suggestedPrice: cached.suggested_price,
      };
    }

    // Cache miss or expired - fetch fresh data from API only
    const priceGuide = await this.getPriceGuide(itemNo, conditionCode);

    if (!priceGuide) {
      return {
        sixMonthAverage: 0,
        currentAverage: 0,
        currentLowest: 0,
        suggestedPrice: 0,
      };
    }

    // Use API data from current marketplace listings (Note: API does not provide historical sales data)
    const sixMonthAverage = parseFloat(priceGuide.qty_avg_price || '0'); // Quantity-weighted average of current listings
    const currentAverage = parseFloat(priceGuide.avg_price || '0'); // Simple average of current listings
    const currentLowest = parseFloat(priceGuide.min_price || '0'); // Lowest current listing

    // Calculate suggested price: weight Current Lowest 3x since listing averages are typically high
    // Formula: (qty-weighted avg + simple avg + lowest*3) / 5 = 20% + 20% + 60%
    const suggestedPrice = (sixMonthAverage + currentAverage + (currentLowest * 3)) / 5;

    const pricingData = {
      sixMonthAverage: parseFloat(sixMonthAverage.toFixed(2)),
      currentAverage: parseFloat(currentAverage.toFixed(2)),
      currentLowest: parseFloat(currentLowest.toFixed(2)),
      suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
    };

    // Store in cache with 24 hour expiration (prices don't change rapidly)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.priceCache.upsert({
      where: {
        minifigure_no_condition: {
          minifigure_no: itemNo,
          condition: condition
        }
      },
      update: {
        six_month_avg: pricingData.sixMonthAverage,
        current_avg: pricingData.currentAverage,
        current_lowest: pricingData.currentLowest,
        suggested_price: pricingData.suggestedPrice,
        cached_at: new Date(),
        expires_at: expiresAt,
      },
      create: {
        minifigure_no: itemNo,
        condition: condition,
        six_month_avg: pricingData.sixMonthAverage,
        current_avg: pricingData.currentAverage,
        current_lowest: pricingData.currentLowest,
        suggested_price: pricingData.suggestedPrice,
        expires_at: expiresAt,
      }
    });

    return pricingData;
  }
}

export const bricklinkAPI = new BricklinkAPI();
