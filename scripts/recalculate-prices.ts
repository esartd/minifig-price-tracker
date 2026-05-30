// One-time script to recalculate all inventory prices with new formula
// Run with: npx tsx scripts/recalculate-prices.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recalculatePrices() {
  console.log('🔄 Starting price recalculation with new formula...\n');

  // Get all items with pricing data
  const items = await prisma.collectionItem.findMany({
    where: {
      NOT: {
        pricing_six_month_avg: null,
        pricing_current_avg: null,
        pricing_current_lowest: null
      }
    }
  });

  console.log(`Found ${items.length} items with pricing data\n`);

  let updated = 0;

  for (const item of items) {
    const qtyAvg = item.pricing_six_month_avg || 0;
    const simpleAvg = item.pricing_current_avg || 0;
    const lowest = item.pricing_current_lowest || 0;

    // Old formula: (qty + simple + 2×lowest) / 4
    const oldPrice = (qtyAvg + simpleAvg + (lowest * 2)) / 4;

    // New formula: (qty + simple + 3×lowest) / 5
    const newPrice = (qtyAvg + simpleAvg + (lowest * 3)) / 5;

    const roundedNew = parseFloat(newPrice.toFixed(2));

    // Only update if price actually changed
    if (roundedNew !== item.pricing_suggested_price) {
      await prisma.collectionItem.update({
        where: { id: item.id },
        data: { pricing_suggested_price: roundedNew }
      });

      console.log(
        `✓ ${item.minifigure_no} (${item.minifigure_name.substring(0, 40)}...)`
      );
      console.log(`  Old: $${oldPrice.toFixed(2)} → New: $${roundedNew} (${((newPrice - oldPrice) / oldPrice * 100).toFixed(1)}% change)\n`);
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} out of ${items.length} items`);
  console.log('💡 Items with no change kept their current prices\n');

  await prisma.$disconnect();
}

recalculatePrices()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
