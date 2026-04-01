import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Update all minifig image URLs from MN (cropped) to ML (large with padding)
 */
async function updateImagesToLarge() {
  try {
    console.log('🔍 Finding collection items with MN images...');

    // Update collection items
    const collectionItems = await prisma.collectionItem.findMany();

    console.log(`Found ${collectionItems.length} total collection items`);

    let updated = 0;
    for (const item of collectionItems) {
      if (!item.image_url) continue;

      // Check if it has MN in the URL
      if (item.image_url.includes('/ItemImage/MN/')) {
        let newImageUrl = item.image_url
          .replace('/ItemImage/MN/0/', '/ItemImage/ML/')
          .replace('/ItemImage/MN/', '/ItemImage/ML/');

        if (newImageUrl !== item.image_url) {
          await prisma.collectionItem.update({
            where: { id: item.id },
            data: { image_url: newImageUrl }
          });
          updated++;
          console.log(`✓ Updated ${item.minifigure_no}: ${item.minifigure_name}`);
        }
      }
    }

    console.log(`\n✅ Updated ${updated} collection items`);
    console.log('🎉 All images now use ML (Large) format with more whitespace!');
  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImagesToLarge();
