import crypto from 'crypto';
import { Minifigure, PriceGuide, PricingData } from '@/types';
import { bricklinkScraper } from './bricklink-scraper';

export class BricklinkAPI {
  private consumerKey: string;
  private consumerSecret: string;
  private tokenValue: string;
  private tokenSecret: string;
  private baseURL = 'https://api.bricklink.com/api/store/v1';

  constructor() {
    // Load from environment variables
    this.consumerKey = process.env.BRICKLINK_CONSUMER_KEY || '';
    this.consumerSecret = process.env.BRICKLINK_CONSUMER_SECRET || '';
    this.tokenValue = process.env.BRICKLINK_TOKEN_VALUE || '';
    this.tokenSecret = process.env.BRICKLINK_TOKEN_SECRET || '';
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
      console.error('Error fetching minifigure:', error);
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

  async calculatePricingData(itemNo: string, condition: 'new' | 'used'): Promise<PricingData> {
    const conditionCode = condition === 'new' ? 'N' : 'U';

    // Get data from both API and Puppeteer scraping
    const [priceGuide, scrapedData] = await Promise.all([
      this.getPriceGuide(itemNo, conditionCode),
      bricklinkScraper.scrapePriceGuide(itemNo, conditionCode)
    ]);

    if (!priceGuide) {
      return {
        sixMonthAverage: 0,
        currentAverage: 0,
        currentLowest: 0,
        suggestedPrice: 0,
      };
    }

    // Prefer scraped data from website (includes historical "Last 6 Months Sales")
    // Fall back to API data if scraping fails
    let sixMonthAverage = parseFloat(priceGuide.qty_avg_price); // API fallback
    let currentAverage = parseFloat(priceGuide.avg_price); // API fallback
    let currentLowest = parseFloat(priceGuide.min_price); // API fallback

    if (scrapedData) {
      // Use scraped "Last 6 Months Sales" avg (actual sold prices)
      if (scrapedData.lastSixMonthsAvg > 0) {
        sixMonthAverage = scrapedData.lastSixMonthsAvg;
      }
      // Use scraped current listings data
      if (scrapedData.currentItemsAvg > 0) {
        currentAverage = scrapedData.currentItemsAvg;
      }
      if (scrapedData.currentItemsMin > 0) {
        currentLowest = scrapedData.currentItemsMin;
      }
    }

    // Calculate suggested price as the average of all three values
    const suggestedPrice = (sixMonthAverage + currentAverage + currentLowest) / 3;

    return {
      sixMonthAverage: parseFloat(sixMonthAverage.toFixed(2)),
      currentAverage: parseFloat(currentAverage.toFixed(2)),
      currentLowest: parseFloat(currentLowest.toFixed(2)),
      suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
    };
  }
}

export const bricklinkAPI = new BricklinkAPI();
