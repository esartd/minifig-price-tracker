import { Minifigure } from '@/types';

export class RebrickableAPI {
  private apiKey: string;
  private baseURL = 'https://rebrickable.com/api/v3/lego';

  constructor() {
    this.apiKey = process.env.REBRICKABLE_API_KEY || '';
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `key ${this.apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Rebrickable API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async searchMinifigures(query: string): Promise<Minifigure[]> {
    try {
      // Search for minifigures by name
      const data = await this.makeRequest(`/minifigs/?search=${encodeURIComponent(query)}&page_size=50`);

      if (!data.results || data.results.length === 0) {
        return [];
      }

      // Transform Rebrickable data to our Minifigure format
      return data.results.map((item: any) => ({
        no: item.set_num.replace(/-1$/, ''), // Remove the -1 suffix (e.g., sw0002-1 -> sw0002)
        name: item.name,
        category_id: 65, // Default to Star Wars category
        image_url: item.set_img_url || `https://cdn.rebrickable.com/media/sets/${item.set_num}.jpg`,
      }));
    } catch (error) {
      console.error('Error searching minifigures:', error);
      return [];
    }
  }

  async getMinifigureByNumber(itemNo: string): Promise<Minifigure | null> {
    try {
      // Rebrickable uses format like sw0002-1, but we store as sw0002
      const setNum = itemNo.includes('-') ? itemNo : `${itemNo}-1`;
      const data = await this.makeRequest(`/minifigs/${setNum}/`);

      return {
        no: itemNo, // Keep our format without -1
        name: data.name,
        category_id: 65,
        image_url: data.set_img_url || `https://cdn.rebrickable.com/media/sets/${setNum}.jpg`,
      };
    } catch (error) {
      console.error('Error fetching minifigure:', error);
      return null;
    }
  }
}

export const rebrickableAPI = new RebrickableAPI();
