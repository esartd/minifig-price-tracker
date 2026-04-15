import { CollectionItem, PersonalCollectionItem } from '@/types';
import { prisma } from './prisma';

class DatabaseService {
  // Transform DB row to CollectionItem type
  private transformFromDB(item: any): CollectionItem & { userId: string } {
    return {
      id: item.id,
      userId: item.userId,
      minifigure_no: item.minifigure_no,
      minifigure_name: item.minifigure_name,
      quantity: item.quantity,
      condition: item.condition as 'new' | 'used',
      image_url: item.image_url,
      pricing: item.pricing_six_month_avg ? {
        sixMonthAverage: item.pricing_six_month_avg,
        currentAverage: item.pricing_current_avg,
        currentLowest: item.pricing_current_lowest,
        suggestedPrice: item.pricing_suggested_price
      } : undefined,
      date_added: item.date_added.toISOString(),
      last_updated: item.last_updated.toISOString()
    };
  }

  // Transform DB row to PersonalCollectionItem type
  private transformPersonalFromDB(item: any): PersonalCollectionItem {
    return {
      id: item.id,
      userId: item.userId,
      minifigure_no: item.minifigure_no,
      minifigure_name: item.minifigure_name,
      quantity: item.quantity,
      condition: item.condition as 'new' | 'used',
      image_url: item.image_url,
      pricing: item.pricing_six_month_avg ? {
        sixMonthAverage: item.pricing_six_month_avg,
        currentAverage: item.pricing_current_avg,
        currentLowest: item.pricing_current_lowest,
        suggestedPrice: item.pricing_suggested_price
      } : undefined,
      notes: item.notes || undefined,
      acquisition_date: item.acquisition_date?.toISOString(),
      acquisition_notes: item.acquisition_notes || undefined,
      display_location: item.display_location || undefined,
      date_added: item.date_added.toISOString(),
      last_updated: item.last_updated.toISOString()
    };
  }

  async getAllItems(userId: string): Promise<(CollectionItem & { userId: string })[]> {
    const items = await prisma.collectionItem.findMany({
      where: { userId },
      orderBy: { date_added: 'desc' }
    });

    // CRITICAL: Always read fresh pricing from PriceCache (6-hour compliance)
    // CollectionItem pricing fields are stale - only PriceCache is kept fresh
    const itemsWithFreshPricing = await Promise.all(
      items.map(async (item) => {
        const freshPrice = await prisma.priceCache.findUnique({
          where: {
            minifigure_no_condition: {
              minifigure_no: item.minifigure_no,
              condition: item.condition
            }
          }
        });

        // Use fresh pricing if available and not expired (<6 hours old)
        if (freshPrice && freshPrice.expires_at > new Date()) {
          return {
            ...item,
            pricing_six_month_avg: freshPrice.six_month_avg,
            pricing_current_avg: freshPrice.current_avg,
            pricing_current_lowest: freshPrice.current_lowest,
            pricing_suggested_price: freshPrice.suggested_price
          };
        }

        return item; // Keep existing if no fresh cache (shouldn't happen)
      })
    );

    return itemsWithFreshPricing.map((item: any) => this.transformFromDB(item));
  }

  async getItemById(id: string): Promise<(CollectionItem & { userId: string }) | null> {
    const item = await prisma.collectionItem.findUnique({
      where: { id }
    });
    return item ? this.transformFromDB(item) : null;
  }

  async addItem(item: Omit<CollectionItem, 'id' | 'date_added' | 'last_updated'> & { userId: string }): Promise<CollectionItem> {
    const created = await prisma.collectionItem.create({
      data: {
        userId: item.userId,
        minifigure_no: item.minifigure_no,
        minifigure_name: item.minifigure_name,
        quantity: item.quantity,
        condition: item.condition,
        image_url: item.image_url,
        pricing_six_month_avg: item.pricing?.sixMonthAverage,
        pricing_current_avg: item.pricing?.currentAverage,
        pricing_current_lowest: item.pricing?.currentLowest,
        pricing_suggested_price: item.pricing?.suggestedPrice,
      }
    });
    return this.transformFromDB(created);
  }

  async updateItem(id: string, updates: Partial<CollectionItem>): Promise<CollectionItem | null> {
    const data: any = {};

    if (updates.quantity !== undefined) data.quantity = updates.quantity;
    if (updates.condition !== undefined) data.condition = updates.condition;
    if (updates.image_url !== undefined) data.image_url = updates.image_url;

    if (updates.pricing) {
      data.pricing_six_month_avg = updates.pricing.sixMonthAverage;
      data.pricing_current_avg = updates.pricing.currentAverage;
      data.pricing_current_lowest = updates.pricing.currentLowest;
      data.pricing_suggested_price = updates.pricing.suggestedPrice;
    }

    try {
      const updated = await prisma.collectionItem.update({
        where: { id },
        data
      });
      return this.transformFromDB(updated);
    } catch {
      return null;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      await prisma.collectionItem.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getItemByMinifigNumber(minifigure_no: string): Promise<CollectionItem | null> {
    const item = await prisma.collectionItem.findFirst({
      where: { minifigure_no }
    });
    return item ? this.transformFromDB(item) : null;
  }

  async getItemByMinifigNumberAndCondition(
    userId: string,
    minifigure_no: string,
    condition: 'new' | 'used'
  ): Promise<CollectionItem | null> {
    const item = await prisma.collectionItem.findUnique({
      where: {
        userId_minifigure_no_condition: {
          userId,
          minifigure_no,
          condition
        }
      }
    });
    return item ? this.transformFromDB(item) : null;
  }

  // =============== Personal Collection Methods ===============

  async getAllPersonalItems(userId: string): Promise<PersonalCollectionItem[]> {
    const items = await prisma.personalCollectionItem.findMany({
      where: { userId },
      orderBy: { date_added: 'desc' }
    });

    // Merge fresh pricing from PriceCache (same as inventory)
    const itemsWithFreshPricing = await Promise.all(
      items.map(async (item) => {
        const freshPrice = await prisma.priceCache.findUnique({
          where: {
            minifigure_no_condition: {
              minifigure_no: item.minifigure_no,
              condition: item.condition
            }
          }
        });

        if (freshPrice && freshPrice.expires_at > new Date()) {
          return {
            ...item,
            pricing_six_month_avg: freshPrice.six_month_avg,
            pricing_current_avg: freshPrice.current_avg,
            pricing_current_lowest: freshPrice.current_lowest,
            pricing_suggested_price: freshPrice.suggested_price
          };
        }

        return item;
      })
    );

    return itemsWithFreshPricing.map((item: any) => this.transformPersonalFromDB(item));
  }

  async getPersonalItemById(id: string): Promise<PersonalCollectionItem | null> {
    const item = await prisma.personalCollectionItem.findUnique({
      where: { id }
    });
    return item ? this.transformPersonalFromDB(item) : null;
  }

  async addPersonalItem(item: Omit<PersonalCollectionItem, 'id' | 'date_added' | 'last_updated'>): Promise<PersonalCollectionItem> {
    const created = await prisma.personalCollectionItem.create({
      data: {
        userId: item.userId,
        minifigure_no: item.minifigure_no,
        minifigure_name: item.minifigure_name,
        quantity: item.quantity,
        condition: item.condition,
        image_url: item.image_url,
        pricing_six_month_avg: item.pricing?.sixMonthAverage,
        pricing_current_avg: item.pricing?.currentAverage,
        pricing_current_lowest: item.pricing?.currentLowest,
        pricing_suggested_price: item.pricing?.suggestedPrice,
        notes: item.notes,
        acquisition_date: item.acquisition_date ? new Date(item.acquisition_date) : null,
        acquisition_notes: item.acquisition_notes,
        display_location: item.display_location
      }
    });
    return this.transformPersonalFromDB(created);
  }

  async updatePersonalItem(id: string, updates: Partial<PersonalCollectionItem>): Promise<PersonalCollectionItem | null> {
    const data: any = {};

    if (updates.quantity !== undefined) data.quantity = updates.quantity;
    if (updates.condition !== undefined) data.condition = updates.condition;
    if (updates.image_url !== undefined) data.image_url = updates.image_url;
    if (updates.notes !== undefined) data.notes = updates.notes;
    if (updates.acquisition_date !== undefined) data.acquisition_date = updates.acquisition_date ? new Date(updates.acquisition_date) : null;
    if (updates.acquisition_notes !== undefined) data.acquisition_notes = updates.acquisition_notes;
    if (updates.display_location !== undefined) data.display_location = updates.display_location;

    if (updates.pricing) {
      data.pricing_six_month_avg = updates.pricing.sixMonthAverage;
      data.pricing_current_avg = updates.pricing.currentAverage;
      data.pricing_current_lowest = updates.pricing.currentLowest;
      data.pricing_suggested_price = updates.pricing.suggestedPrice;
    }

    try {
      const updated = await prisma.personalCollectionItem.update({
        where: { id },
        data
      });
      return this.transformPersonalFromDB(updated);
    } catch {
      return null;
    }
  }

  async deletePersonalItem(id: string): Promise<boolean> {
    try {
      await prisma.personalCollectionItem.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getPersonalItemByMinifigNumber(
    userId: string,
    minifigure_no: string,
    condition: string
  ): Promise<PersonalCollectionItem | null> {
    const item = await prisma.personalCollectionItem.findUnique({
      where: {
        userId_minifigure_no_condition: {
          userId,
          minifigure_no,
          condition
        }
      }
    });
    return item ? this.transformPersonalFromDB(item) : null;
  }

  // =============== Movement Methods ===============

  async moveToPersonalCollection(
    inventoryItemId: string,
    quantityToMove: number
  ): Promise<{ personal: PersonalCollectionItem; inventory?: CollectionItem & { userId: string } }> {
    const inventoryItem = await prisma.collectionItem.findUnique({
      where: { id: inventoryItemId }
    });

    if (!inventoryItem) {
      throw new Error('Inventory item not found');
    }

    if (quantityToMove > inventoryItem.quantity) {
      throw new Error('Cannot move more than available quantity');
    }

    // Check if personal collection item already exists
    const existingPersonal = await prisma.personalCollectionItem.findUnique({
      where: {
        userId_minifigure_no_condition: {
          userId: inventoryItem.userId,
          minifigure_no: inventoryItem.minifigure_no,
          condition: inventoryItem.condition
        }
      }
    });

    let personal: PersonalCollectionItem;

    if (existingPersonal) {
      // Update existing personal collection item
      const updated = await prisma.personalCollectionItem.update({
        where: { id: existingPersonal.id },
        data: {
          quantity: existingPersonal.quantity + quantityToMove
        }
      });
      personal = this.transformPersonalFromDB(updated);
    } else {
      // Create new personal collection item
      const created = await prisma.personalCollectionItem.create({
        data: {
          userId: inventoryItem.userId,
          minifigure_no: inventoryItem.minifigure_no,
          minifigure_name: inventoryItem.minifigure_name,
          condition: inventoryItem.condition,
          image_url: inventoryItem.image_url,
          quantity: quantityToMove,
          pricing_six_month_avg: inventoryItem.pricing_six_month_avg,
          pricing_current_avg: inventoryItem.pricing_current_avg,
          pricing_current_lowest: inventoryItem.pricing_current_lowest,
          pricing_suggested_price: inventoryItem.pricing_suggested_price
        }
      });
      personal = this.transformPersonalFromDB(created);
    }

    // Update or delete inventory item
    if (quantityToMove === inventoryItem.quantity) {
      // Delete inventory item completely
      await prisma.collectionItem.delete({
        where: { id: inventoryItemId }
      });
      return { personal };
    } else {
      // Reduce inventory quantity
      const updated = await prisma.collectionItem.update({
        where: { id: inventoryItemId },
        data: {
          quantity: inventoryItem.quantity - quantityToMove
        }
      });
      return { personal, inventory: this.transformFromDB(updated) };
    }
  }

  async moveToInventory(
    personalItemId: string,
    quantityToMove: number
  ): Promise<{ inventory: CollectionItem & { userId: string }; personal?: PersonalCollectionItem }> {
    const personalItem = await prisma.personalCollectionItem.findUnique({
      where: { id: personalItemId }
    });

    if (!personalItem) {
      throw new Error('Personal collection item not found');
    }

    if (quantityToMove > personalItem.quantity) {
      throw new Error('Cannot move more than available quantity');
    }

    // Check if inventory item already exists
    const existingInventory = await prisma.collectionItem.findUnique({
      where: {
        userId_minifigure_no_condition: {
          userId: personalItem.userId,
          minifigure_no: personalItem.minifigure_no,
          condition: personalItem.condition
        }
      }
    });

    let inventory: CollectionItem & { userId: string };

    if (existingInventory) {
      // Update existing inventory item
      const updated = await prisma.collectionItem.update({
        where: { id: existingInventory.id },
        data: {
          quantity: existingInventory.quantity + quantityToMove
        }
      });
      inventory = this.transformFromDB(updated);
    } else {
      // Create new inventory item
      const created = await prisma.collectionItem.create({
        data: {
          userId: personalItem.userId,
          minifigure_no: personalItem.minifigure_no,
          minifigure_name: personalItem.minifigure_name,
          condition: personalItem.condition,
          image_url: personalItem.image_url,
          quantity: quantityToMove,
          pricing_six_month_avg: personalItem.pricing_six_month_avg,
          pricing_current_avg: personalItem.pricing_current_avg,
          pricing_current_lowest: personalItem.pricing_current_lowest,
          pricing_suggested_price: personalItem.pricing_suggested_price
        }
      });
      inventory = this.transformFromDB(created);
    }

    // Update or delete personal collection item
    if (quantityToMove === personalItem.quantity) {
      // Delete personal item completely
      await prisma.personalCollectionItem.delete({
        where: { id: personalItemId }
      });
      return { inventory };
    } else {
      // Reduce personal collection quantity
      const updated = await prisma.personalCollectionItem.update({
        where: { id: personalItemId },
        data: {
          quantity: personalItem.quantity - quantityToMove
        }
      });
      return { inventory, personal: this.transformPersonalFromDB(updated) };
    }
  }
}

export const database = new DatabaseService();
