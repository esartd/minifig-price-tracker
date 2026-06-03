require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('.prisma/client-hostinger');

const prisma = new PrismaClient();

async function migrateOldTokens() {
  console.log('🔄 Migrating old share tokens to new public/private system...\n');

  try {
    // Get all users with existing share tokens
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { shareTokenInventory: { not: null } },
          { shareTokenCollection: { not: null } },
          { shareTokenSetsInventory: { not: null } },
          { shareTokenSetsCollection: { not: null } }
        ]
      },
      select: {
        id: true,
        email: true,
        shareTokenInventory: true,
        shareEnabledInventory: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
      }
    });

    console.log(`Found ${users.length} users with existing share tokens\n`);

    for (const user of users) {
      console.log(`\nMigrating tokens for user: ${user.email}`);
      const updates = {};

      // Migrate inventory token - always to public (with pricing)
      if (user.shareTokenInventory) {
        updates.shareTokenInventory = user.shareTokenInventory;
        updates.shareEnabledInventory = user.shareEnabledInventory;
        console.log('  ✅ Migrated inventory token to PUBLIC');
      }

      // Migrate collection token - always to public (with pricing)
      if (user.shareTokenCollection) {
        updates.shareTokenCollection = user.shareTokenCollection;
        updates.shareEnabledCollection = user.shareEnabledCollection;
        console.log('  ✅ Migrated collection token to PUBLIC');
      }

      // Migrate sets-inventory token - always to public (with pricing)
      if (user.shareTokenSetsInventory) {
        updates.shareTokenSetsInventory = user.shareTokenSetsInventory;
        updates.shareEnabledSetsInventory = user.shareEnabledSetsInventory;
        console.log('  ✅ Migrated sets-inventory token to PUBLIC');
      }

      // Migrate sets-collection token - always to public (with pricing)
      if (user.shareTokenSetsCollection) {
        updates.shareTokenSetsCollection = user.shareTokenSetsCollection;
        updates.shareEnabledSetsCollection = user.shareEnabledSetsCollection;
        console.log('  ✅ Migrated sets-collection token to PUBLIC');
      }

      // Apply updates
      if (Object.keys(updates).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updates
        });
      }
    }

    console.log('\n✨ Migration completed successfully!');
    console.log('\nNote: All old tokens migrated to PUBLIC links (with pricing).');
    console.log('Users can create separate PRIVATE links (no pricing) using the new toggle.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateOldTokens();
