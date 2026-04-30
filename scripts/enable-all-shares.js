require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('.prisma/client-hostinger');
const { randomBytes } = require('crypto');

const prisma = new PrismaClient();

async function enableAllShares() {
  console.log('🔄 Enabling all share links...\n');

  try {
    const user = await prisma.user.findFirst({
      where: { email: 'erickkosysu@gmail.com' }
    });

    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }

    const updates = {};

    // Collection Private - generate token if missing
    if (!user.shareTokenCollectionPrivate) {
      updates.shareTokenCollectionPrivate = randomBytes(16).toString('hex');
      console.log('✅ Generated Collection Private token');
    }
    updates.shareEnabledCollectionPrivate = true;

    // Sets Collection Public - generate token if missing
    if (!user.shareTokenSetsCollection) {
      updates.shareTokenSetsCollection = randomBytes(16).toString('hex');
      console.log('✅ Generated Sets Collection Public token');
    }
    updates.shareEnabledSetsCollection = true;

    // Sets Collection Private - generate token if missing
    if (!user.shareTokenSetsCollectionPrivate) {
      updates.shareTokenSetsCollectionPrivate = randomBytes(16).toString('hex');
      console.log('✅ Generated Sets Collection Private token');
    }
    updates.shareEnabledSetsCollectionPrivate = true;

    // Apply updates
    await prisma.user.update({
      where: { id: user.id },
      data: updates
    });

    console.log('\n✨ All share links enabled!\n');

    // Show all links
    const updatedUser = await prisma.user.findFirst({
      where: { email: 'erickkosysu@gmail.com' },
      select: {
        shareTokenInventory: true,
        shareTokenInventoryPrivate: true,
        shareTokenCollection: true,
        shareTokenCollectionPrivate: true,
        shareTokenSetsInventory: true,
        shareTokenSetsInventoryPrivate: true,
        shareTokenSetsCollection: true,
        shareTokenSetsCollectionPrivate: true,
      }
    });

    console.log('ALL SHARE LINKS:');
    console.log('================\n');
    console.log('INVENTORY:');
    console.log('  Public:  https://figtracker.ericksu.com/share/' + updatedUser.shareTokenInventory + '?type=inventory');
    console.log('  Private: https://figtracker.ericksu.com/share/' + updatedUser.shareTokenInventoryPrivate + '?type=inventory\n');

    console.log('COLLECTION:');
    console.log('  Public:  https://figtracker.ericksu.com/share/' + updatedUser.shareTokenCollection + '?type=collection');
    console.log('  Private: https://figtracker.ericksu.com/share/' + updatedUser.shareTokenCollectionPrivate + '?type=collection\n');

    console.log('SETS INVENTORY:');
    console.log('  Public:  https://figtracker.ericksu.com/share/' + updatedUser.shareTokenSetsInventory + '?type=sets-inventory');
    console.log('  Private: https://figtracker.ericksu.com/share/' + updatedUser.shareTokenSetsInventoryPrivate + '?type=sets-inventory\n');

    console.log('SETS COLLECTION:');
    console.log('  Public:  https://figtracker.ericksu.com/share/' + updatedUser.shareTokenSetsCollection + '?type=sets-collection');
    console.log('  Private: https://figtracker.ericksu.com/share/' + updatedUser.shareTokenSetsCollectionPrivate + '?type=sets-collection\n');

  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

enableAllShares();
