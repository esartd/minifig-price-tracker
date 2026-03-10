export interface Minifigure {
  no: string; // Bricklink item number (e.g., "sw0001a")
  name: string; // Minifigure name
  category_id: number;
  image_url?: string;
}

export interface PriceGuide {
  item: {
    no: string;
    type: string;
  };
  new_or_used: 'N' | 'U';
  currency_code: string;
  min_price: string;
  max_price: string;
  avg_price: string; // Current average price
  qty_avg_price: string; // Quantity weighted average
  unit_quantity: number;
  total_quantity: number;
  price_detail: Array<{
    quantity: number;
    unit_price: string;
    shipping_available: boolean;
  }>;
}

export interface PricingData {
  sixMonthAverage: number; // Average from last 6 months
  currentAverage: number; // Current market average
  currentLowest: number; // Current lowest price
  suggestedPrice: number; // Calculated suggested selling price
}

export interface CollectionItem {
  id: string; // UUID for database
  minifigure_no: string; // Bricklink item number
  minifigure_name: string;
  quantity: number;
  condition: 'new' | 'used';
  image_url?: string;
  pricing?: PricingData;
  date_added: string;
  last_updated: string;
}

export interface BricklinkConfig {
  consumerKey: string;
  consumerSecret: string;
  tokenValue: string;
  tokenSecret: string;
}
