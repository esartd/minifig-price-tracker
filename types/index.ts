export interface Minifigure {
  no: string; // Bricklink item number (e.g., "sw0001a")
  name: string; // Minifigure name
  category_id: number;
  image_url?: string;
  sets?: SetInfo[]; // Optional: Sets this minifigure appears in
}

export interface SetInfo {
  no: string; // Set number (e.g., "75192-1")
  name: string; // Set name
  quantity: number; // How many of this minifig in the set
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
  sixMonthAverage: number; // Quantity-weighted average of current listings (stored as sixMonthAverage for backward compatibility)
  currentAverage: number; // Simple average of current listings
  currentLowest: number; // Lowest current listing price
  suggestedPrice: number; // Calculated suggested selling price
  currencyCode?: string; // Currency code the prices are in (e.g., 'USD', 'KRW', 'EUR')
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

export interface PersonalCollectionItem {
  id: string;
  userId: string;
  minifigure_no: string;
  minifigure_name: string;
  quantity: number;
  condition: 'new' | 'used';
  image_url?: string;
  pricing?: PricingData;
  notes?: string;
  acquisition_date?: string;
  acquisition_notes?: string;
  display_location?: string;
  date_added: string;
  last_updated: string;
}

export interface MoveToCollectionRequest {
  quantity: number;
}

export interface MoveToInventoryRequest {
  quantity: number;
}

export interface BricklinkConfig {
  consumerKey: string;
  consumerSecret: string;
  tokenValue: string;
  tokenSecret: string;
}
