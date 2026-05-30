import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('📦 Exporting your collection data...\n');

    const items = await prisma.collectionItem.findMany();

    if (items.length === 0) {
      console.log('No items found to export.');
      return;
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      itemCount: items.length,
      items: items.map((item: any) => ({
        minifigure_no: item.minifigure_no,
        minifigure_name: item.minifigure_name,
        quantity: item.quantity,
        condition: item.condition,
        image_url: item.image_url,
        pricing_six_month_avg: item.pricing_six_month_avg,
        pricing_current_avg: item.pricing_current_avg,
        pricing_current_lowest: item.pricing_current_lowest,
        pricing_suggested_price: item.pricing_suggested_price,
        date_added: item.date_added,
      })),
    };

    fs.writeFileSync(
      'collection-backup.json',
      JSON.stringify(exportData, null, 2)
    );

    console.log(`✅ Exported ${items.length} items to collection-backup.json\n`);
    console.log('Your data is safe! Run the database setup now.\n');
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
