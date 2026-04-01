import { CollectionItem } from '@/types';
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

  async getAllItems(userId: string): Promise<(CollectionItem & { userId: string })[]> {
    const items = await prisma.collectionItem.findMany({
      where: { userId },
      orderBy: { date_added: 'desc' }
    });
    return items.map((item: any) => this.transformFromDB(item));
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
}

export const database = new DatabaseService();
