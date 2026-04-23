import crypto from 'crypto';
import { Minifigure, PriceGuide, PricingData, SetInfo } from '@/types';
import { prisma, prismaPublic } from './prisma';
import { getCurrencyByCountryCode } from './currency-config';

// Manual name enhancements for minifigs with poor Bricklink API names
// These are searchable, accurate names that help users find what they're looking for
const NAME_ENHANCEMENTS: Record<string, string> = {
  'sw1173': 'Grogu / The Child / Baby Yoda - Holiday Outfit',
  // Add more as we discover problematic names
};

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
  }

  private isLocalhost(): boolean {
    // Only block on actual localhost - NOT on production even if NODE_ENV is development
    const url = process.env.NEXTAUTH_URL || process.env.AUTH_URL || process.env.VERCEL_URL || '';
    const isActuallyLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

    // Also check if we're in Vercel production (VERCEL_ENV === 'production')
    const isVercelProduction = process.env.VERCEL_ENV === 'production';

    // Only block if actually localhost, never block on Vercel production
    return isActuallyLocalhost && !isVercelProduction;
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
    let tracker = await prismaPublic.apiCallTracker.findUnique({
      where: { date: today }
    });

    // Create new tracker if doesn't exist
    if (!tracker) {
      tracker = await prismaPublic.apiCallTracker.create({
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
    await prismaPublic.apiCallTracker.update({
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
    // BLOCK all API calls on localhost to preserve production limits
    const isLocal = this.isLocalhost();
    console.log(`Bricklink API call check: isLocalhost=${isLocal}, NODE_ENV=${process.env.NODE_ENV}, NEXTAUTH_URL=${process.env.NEXTAUTH_URL}`);

    if (isLocal) {
      console.warn('🚫 Bricklink API blocked on localhost - use production for real data');
      return null;
    }

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

    const data = await response.json();

    if (!response.ok) {
      // Log the error response body from Bricklink
      console.error(`[makeRequest] Bricklink API ${response.status} error for ${endpoint}:`, JSON.stringify(data));
      (this as any).lastError = {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        body: data
      };
      throw new Error(`Bricklink API error: ${response.statusText}`);
    }

    // Log the raw response for debugging
    console.log(`[makeRequest] Raw Bricklink response for ${endpoint}:`, JSON.stringify(data));

    // BrickLink returns 200 OK even for errors, check meta field
    if (data.meta && data.meta.code && data.meta.code !== 200) {
      const errorDetails = {
        endpoint,
        code: data.meta.code,
        message: data.meta.message,
        description: data.meta.description
      };
      console.error(`BrickLink API error:`, JSON.stringify(errorDetails));
      // Store last error for debugging
      (this as any).lastError = errorDetails;
      return null;
    }

    // Log if data is empty/null
    if (!data.data) {
      console.warn(`BrickLink API returned no data for ${endpoint}`, {
        meta: data.meta,
        hasData: !!data.data
      });
      (this as any).lastError = { endpoint, reason: 'No data.data field', meta: data.meta };
      return null;
    }

    // Clear last error on success
    (this as any).lastError = null;
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
      // STEP 1: Check cache first (no API call)
      const cached = await prismaPublic.minifigCache.findUnique({
        where: { minifigure_no: itemNo }
      });

      // If cached and not expired, return immediately (saves API call)
      if (cached && cached.expires_at > new Date()) {
        return {
          no: cached.minifigure_no,
          name: cached.name,
          category_id: cached.category_id,
          image_url: cached.image_url
        };
      }

      // STEP 2: Cache miss or expired - fetch from API
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

      // Use enhanced name if available, otherwise use API name
      const enhancedName = NAME_ENHANCEMENTS[data.no] || data.name;

      const minifig: Minifigure = {
        no: data.no,
        name: enhancedName,
        category_id: data.category_id,
        image_url: imageUrl,
      };

      // STEP 3: Store in cache (6 hour expiration per BrickLink API Terms Section 1)
      // "Display item Content or product information and/or images which is more than
      // six hours older than such information is on the Website"
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 6);

      await prismaPublic.minifigCache.upsert({
        where: { minifigure_no: data.no },
        update: {
          name: enhancedName,
          category_id: data.category_id,
          image_url: imageUrl,
          cached_at: new Date(),
          expires_at: expiresAt
        },
        create: {
          minifigure_no: data.no,
          name: enhancedName,
          category_id: data.category_id,
          image_url: imageUrl,
          expires_at: expiresAt
        }
      });

      return minifig;
    } catch (error) {
      // Item doesn't exist or API error
      return null;
    }
  }

  async getPriceGuide(
    itemNo: string,
    condition: 'N' | 'U' = 'N',
    countryCode: string = 'US',
    region: string = 'north_america',
    currencyCode?: string
  ): Promise<PriceGuide | null> {
    try {
      // BrickLink API parameters:
      // - country_code: FILTERS sellers to only that country (very restrictive)
      // - currency_code: CONVERTS prices to that currency (all sellers, just different display)
      // For pricing, we want ALL sellers with currency conversion, NOT filtered by country
      let url = `/items/MINIFIG/${itemNo}/price?new_or_used=${condition}`;
      if (currencyCode) {
        url += `&currency_code=${currencyCode}`;
      }
      // Don't use country_code - it filters sellers which gives zeros for rare items

      console.log(`[getPriceGuide] Requesting: ${url}`);

      const data = await this.makeRequest(url);

      if (!data) {
        console.log(`[getPriceGuide] No data returned for ${itemNo} in ${countryCode}`);
        return null;
      }

      console.log(`[getPriceGuide] Response for ${itemNo}:`, {
        currency_code: data.currency_code,
        min_price: data.min_price,
        avg_price: data.avg_price,
        qty_avg_price: data.qty_avg_price,
        unit_quantity: data.unit_quantity,
        total_quantity: data.total_quantity
      });

      return data;
    } catch (error) {
      console.error(`[getPriceGuide] Error fetching ${itemNo} in ${countryCode}:`, error);
      return null;
    }
  }

  async getSetsContainingMinifig(itemNo: string): Promise<SetInfo[]> {
    // NOTE: This method is not used to preserve API rate limits
    // BrickLink API has 5,000 calls/day limit - showing sets on every page would exceed this
    // Consider implementing as a database-backed feature with periodic updates if needed
    return [];
  }

  async calculatePricingData(
    itemNo: string,
    condition: 'new' | 'used',
    countryCode: string = 'US',
    region: string = 'north_america'
  ): Promise<PricingData> {
    console.log(`[calculatePricingData] START: ${itemNo}, condition=${condition}, country=${countryCode}`);
    const conditionCode = condition === 'new' ? 'N' : 'U';

    // Note: countryCode is used for cache key (to separate USD from GBP prices)
    // but NOT passed to Bricklink API (which would filter sellers)
    const cacheRegion = '';

    // Check cache first
    const cached = await prisma.priceCache.findUnique({
      where: {
        item_no_item_type_condition_country_code_region: {
          item_no: itemNo,
          item_type: 'MINIFIG',
          condition: condition,
          country_code: countryCode,
          region: cacheRegion
        }
      }
    });

    // If cache exists and hasn't expired, return cached data
    if (cached && cached.expires_at > new Date()) {
      console.log(`[calculatePricingData] Cache HIT for ${itemNo}: $${cached.suggested_price}`);
      return {
        sixMonthAverage: cached.six_month_avg,
        currentAverage: cached.current_avg,
        currentLowest: cached.current_lowest,
        suggestedPrice: cached.suggested_price,
        currencyCode: cached.currency_code,
      };
    }

    console.log(`[calculatePricingData] Cache MISS for ${itemNo}, fetching from API...`);

    // Get currency code from country code
    const currencyConfig = getCurrencyByCountryCode(countryCode);
    const currencyCodeValue = currencyConfig?.code || 'USD';

    // Cache miss or expired - fetch fresh data from API with currency conversion
    const priceGuide = await this.getPriceGuide(itemNo, conditionCode, countryCode, region, currencyCodeValue);
    console.log(`[calculatePricingData] API response for ${itemNo}:`, priceGuide ? 'SUCCESS' : 'NULL');

    if (!priceGuide) {
      console.log(`No price guide returned for ${itemNo} in ${countryCode} - caching zeros for 1 hour`);
      // No data from API - cache zeros for 1 hour to avoid repeated failed API calls
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await prisma.priceCache.upsert({
        where: {
          item_no_item_type_condition_country_code_region: {
            item_no: itemNo,
            item_type: 'MINIFIG',
            condition: condition,
            country_code: countryCode,
            region: cacheRegion
          }
        },
        update: {
          six_month_avg: 0,
          current_avg: 0,
          current_lowest: 0,
          suggested_price: 0,
          cached_at: new Date(),
          expires_at: expiresAt,
          currency_code: currencyCodeValue,
        },
        create: {
          item_no: itemNo,
          item_type: 'MINIFIG',
          condition: condition,
          country_code: countryCode,
          region: cacheRegion,
          currency_code: currencyCodeValue,
          six_month_avg: 0,
          current_avg: 0,
          current_lowest: 0,
          suggested_price: 0,
          expires_at: expiresAt,
        }
      });

      return {
        sixMonthAverage: 0,
        currentAverage: 0,
        currentLowest: 0,
        suggestedPrice: 0,
        currencyCode: currencyCodeValue,
      };
    }

    // Use API data from current marketplace listings (Note: API does not provide historical sales data)
    const sixMonthAverage = parseFloat(priceGuide.qty_avg_price || '0'); // Quantity-weighted average of current listings
    const currentAverage = parseFloat(priceGuide.avg_price || '0'); // Simple average of current listings
    const currentLowest = parseFloat(priceGuide.min_price || '0'); // Lowest current listing

    // Calculate suggested price: weight Current Lowest 8x to approximate sold prices
    // Formula: (qty-weighted avg + simple avg + lowest*8) / 10 = 10% + 10% + 80%
    const suggestedPrice = (sixMonthAverage + currentAverage + (currentLowest * 8)) / 10;

    const pricingData = {
      sixMonthAverage: parseFloat(sixMonthAverage.toFixed(2)),
      currentAverage: parseFloat(currentAverage.toFixed(2)),
      currentLowest: parseFloat(currentLowest.toFixed(2)),
      suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
      currencyCode: currencyCodeValue,
    };

    // Store in cache - use shorter expiration for zero prices (1 hour vs 6 hours)
    // This allows re-checking for new sellers without hammering the API
    const expiresAt = new Date();
    if (pricingData.suggestedPrice === 0) {
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour for no-seller regions
      console.log(`No sellers found for ${itemNo} in ${countryCode}, caching zeros for 1 hour`);
    } else {
      expiresAt.setHours(expiresAt.getHours() + 6); // 6 hour per BrickLink API Terms
    }

    await prisma.priceCache.upsert({
      where: {
        item_no_item_type_condition_country_code_region: {
          item_no: itemNo,
          item_type: 'MINIFIG',
          condition: condition,
          country_code: countryCode,
          region: cacheRegion
        }
      },
      update: {
        six_month_avg: pricingData.sixMonthAverage,
        current_avg: pricingData.currentAverage,
        current_lowest: pricingData.currentLowest,
        suggested_price: pricingData.suggestedPrice,
        cached_at: new Date(),
        expires_at: expiresAt,
        currency_code: currencyCodeValue,
      },
      create: {
        item_no: itemNo,
        item_type: 'MINIFIG',
        condition: condition,
        country_code: countryCode,
        region: cacheRegion,
        currency_code: currencyCodeValue,
        six_month_avg: pricingData.sixMonthAverage,
        current_avg: pricingData.currentAverage,
        current_lowest: pricingData.currentLowest,
        suggested_price: pricingData.suggestedPrice,
        expires_at: expiresAt,
      }
    });

    return pricingData;
  }

  async getSetPriceGuide(
    boxNo: string,
    condition: 'N' | 'U' = 'N',
    countryCode: string = 'US',
    region: string = 'north_america',
    currencyCode?: string
  ): Promise<PriceGuide | null> {
    try {
      // Strip ALL suffixes (BrickLink uses "75192" not "75192-1", "40892" not "40892-1")
      const bricklinkNo = boxNo.replace(/-\d+$/, '');

      // BrickLink API: Don't use country_code (filters sellers), use currency_code (converts prices)
      // Use SET as item type (same format as MINIFIG for minifigures)
      let url = `/items/SET/${bricklinkNo}/price?new_or_used=${condition}`;
      if (currencyCode) {
        url += `&currency_code=${currencyCode}`;
      }

      console.log(`[getSetPriceGuide] Requesting: ${url}`);
      const data = await this.makeRequest(url);

      if (!data) {
        console.log(`[getSetPriceGuide] No data returned for set ${bricklinkNo}`);
        // Check if lastError was set by makeRequest
        if (!(this as any).lastError) {
          (this as any).lastError = {
            endpoint: url,
            reason: 'makeRequest returned null but did not set lastError',
            boxNo: bricklinkNo
          };
        }
        return null;
      }

      console.log(`[getSetPriceGuide] Response for ${bricklinkNo}:`, {
        currency_code: data.currency_code,
        min_price: data.min_price,
        total_quantity: data.total_quantity
      });

      return data;
    } catch (error) {
      console.error('[getSetPriceGuide] Error fetching set price guide:', error);
      return null;
    }
  }

  async calculateSetPricing(
    boxNo: string,
    condition: 'new' | 'used',
    countryCode: string = 'US',
    region: string = 'north_america'
  ): Promise<PricingData> {
    const conditionCode = condition === 'new' ? 'N' : 'U';

    // Standardize region to empty string since we only use country_code now
    const cacheRegion = '';

    // Check cache first
    const cached = await prisma.priceCache.findUnique({
      where: {
        item_no_item_type_condition_country_code_region: {
          item_no: boxNo,
          item_type: 'SET',
          condition: condition,
          country_code: countryCode,
          region: cacheRegion
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
        currencyCode: cached.currency_code,
      };
    }

    // Get currency code from country code
    const currencyConfig = getCurrencyByCountryCode(countryCode);
    const currencyCodeValue = currencyConfig?.code || 'USD';

    // Cache miss or expired - fetch fresh data from API with currency conversion
    const priceGuide = await this.getSetPriceGuide(boxNo, conditionCode, countryCode, region, currencyCodeValue);

    if (!priceGuide) {
      console.log(`No price guide returned for set ${boxNo} in ${countryCode} - caching zeros for 1 hour`);
      // No data from API - cache zeros for 1 hour to avoid repeated failed API calls
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await prisma.priceCache.upsert({
        where: {
          item_no_item_type_condition_country_code_region: {
            item_no: boxNo,
            item_type: 'SET',
            condition: condition,
            country_code: countryCode,
            region: cacheRegion
          }
        },
        update: {
          six_month_avg: 0,
          current_avg: 0,
          current_lowest: 0,
          suggested_price: 0,
          cached_at: new Date(),
          expires_at: expiresAt,
          currency_code: currencyCodeValue,
        },
        create: {
          item_no: boxNo,
          item_type: 'SET',
          condition: condition,
          country_code: countryCode,
          region: cacheRegion,
          currency_code: currencyCodeValue,
          six_month_avg: 0,
          current_avg: 0,
          current_lowest: 0,
          suggested_price: 0,
          expires_at: expiresAt,
        }
      });

      return {
        sixMonthAverage: 0,
        currentAverage: 0,
        currentLowest: 0,
        suggestedPrice: 0,
        currencyCode: currencyCodeValue,
      };
    }

    // Use API data from current marketplace listings (Note: API does not provide historical sales data)
    const sixMonthAverage = parseFloat(priceGuide.qty_avg_price || '0'); // Quantity-weighted average of current listings
    const currentAverage = parseFloat(priceGuide.avg_price || '0'); // Simple average of current listings
    const currentLowest = parseFloat(priceGuide.min_price || '0'); // Lowest current listing

    // Calculate suggested price: weight Current Lowest 8x to approximate sold prices
    // Formula: (qty-weighted avg + simple avg + lowest*8) / 10 = 10% + 10% + 80%
    const suggestedPrice = (sixMonthAverage + currentAverage + (currentLowest * 8)) / 10;

    const pricingData = {
      sixMonthAverage: parseFloat(sixMonthAverage.toFixed(2)),
      currentAverage: parseFloat(currentAverage.toFixed(2)),
      currentLowest: parseFloat(currentLowest.toFixed(2)),
      suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
      currencyCode: currencyCodeValue,
    };

    // Store in cache - use shorter expiration for zero prices (1 hour vs 6 hours)
    // This allows re-checking for new sellers without hammering the API
    const expiresAt = new Date();
    if (pricingData.suggestedPrice === 0) {
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour for no-seller regions
      console.log(`No sellers found for set ${boxNo} in ${countryCode}, caching zeros for 1 hour`);
    } else {
      expiresAt.setHours(expiresAt.getHours() + 6); // 6 hour per BrickLink API Terms
    }

    await prisma.priceCache.upsert({
      where: {
        item_no_item_type_condition_country_code_region: {
          item_no: boxNo,
          item_type: 'SET',
          condition: condition,
          country_code: countryCode,
          region: cacheRegion
        }
      },
      update: {
        six_month_avg: pricingData.sixMonthAverage,
        current_avg: pricingData.currentAverage,
        current_lowest: pricingData.currentLowest,
        suggested_price: pricingData.suggestedPrice,
        cached_at: new Date(),
        expires_at: expiresAt,
        currency_code: currencyCodeValue,
      },
      create: {
        item_no: boxNo,
        item_type: 'SET',
        condition: condition,
        country_code: countryCode,
        region: cacheRegion,
        currency_code: currencyCodeValue,
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
