/**
 * Restore database from backup files
 *
 * Usage: npx tsx scripts/restore-backup.ts <timestamp>
 * Example: npx tsx scripts/restore-backup.ts 2026-04-18T20-00-00
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function restoreBackup() {
  const timestamp = process.argv[2];

  if (!timestamp) {
    console.error('❌ Error: Please provide a backup timestamp');
    console.error('Usage: npx tsx scripts/restore-backup.ts <timestamp>');
    console.error('Example: npx tsx scripts/restore-backup.ts 2026-04-18T20-00-00');
    process.exit(1);
  }

  const backupDir = path.join(process.cwd(), 'database-backups');

  console.log('\n⚠️  DATABASE RESTORE');
  console.log('='.repeat(70));
  console.log(`📁 Backup location: ${backupDir}`);
  console.log(`🕐 Restoring from: ${timestamp}`);
  console.log('\n⚠️  WARNING: This will DELETE existing data and replace with backup!');
  console.log('='.repeat(70));

  // Read backup summary to verify
  const summaryPath = path.join(backupDir, `BACKUP-SUMMARY-${timestamp}.json`);
  if (!fs.existsSync(summaryPath)) {
    console.error(`❌ Backup not found: ${summaryPath}`);
    console.error('\n📂 Available backups:');
    const files = fs.readdirSync(backupDir).filter(f => f.startsWith('BACKUP-SUMMARY'));
    files.forEach(f => console.log(`   ${f.replace('BACKUP-SUMMARY-', '').replace('.json', '')}`));
    process.exit(1);
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  console.log('\n📊 Backup Summary:');
  console.log(`   Users: ${summary.tables.users}`);
  console.log(`   Collection Items: ${summary.tables.collectionItems}`);
  console.log(`   Personal Items: ${summary.tables.personalItems}`);
  console.log(`   Listings: ${summary.tables.listings}`);
  console.log(`   Total User Data: ${summary.total_user_items} items`);

  // Confirmation prompt (in production, you'd want actual user input)
  console.log('\n⚠️  Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    console.log('🗑️  Deleting existing data...');

    // Delete in correct order (respecting foreign keys)
    await prisma.listing.deleteMany();
    await prisma.personalCollectionItem.deleteMany();
    await prisma.collectionItem.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    // Don't delete users yet, we'll update them

    console.log('✅ Existing data cleared');

    // Restore Users
    console.log('\n📥 Restoring Users...');
    const usersPath = path.join(backupDir, `users-${timestamp}.json`);
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

    for (const user of users) {
      // Restore user (keep existing password hash)
      await prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          image: user.image,
          password: user.password, // Keep existing hash
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          preferredCurrency: user.preferredCurrency,
          preferredCountryCode: user.preferredCountryCode,
          preferredRegion: user.preferredRegion,
          currencySymbol: user.currencySymbol,
          locale: user.locale,
        },
        update: {
          name: user.name,
          email: user.email,
          image: user.image,
          preferredCurrency: user.preferredCurrency,
          preferredCountryCode: user.preferredCountryCode,
          preferredRegion: user.preferredRegion,
          currencySymbol: user.currencySymbol,
          locale: user.locale,
        }
      });
    }
    console.log(`✅ Restored ${users.length} users`);

    // Restore CollectionItems (Inventory)
    console.log('📥 Restoring Collection Items...');
    const collectionPath = path.join(backupDir, `collection-items-${timestamp}.json`);
    const collectionItems = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'));

    for (const item of collectionItems) {
      await prisma.collectionItem.create({
        data: {
          id: item.id,
          userId: item.userId,
          minifigure_no: item.minifigure_no,
          minifigure_name: item.minifigure_name,
          quantity: item.quantity,
          condition: item.condition,
          image_url: item.image_url,
          pricing_six_month_avg: item.pricing_six_month_avg,
          pricing_current_avg: item.pricing_current_avg,
          pricing_current_lowest: item.pricing_current_lowest,
          pricing_suggested_price: item.pricing_suggested_price,
          date_added: new Date(item.date_added),
          last_updated: new Date(item.last_updated),
        }
      });
    }
    console.log(`✅ Restored ${collectionItems.length} collection items`);

    // Restore PersonalCollectionItems (Collection)
    console.log('📥 Restoring Personal Collection Items...');
    const personalPath = path.join(backupDir, `personal-items-${timestamp}.json`);
    const personalItems = JSON.parse(fs.readFileSync(personalPath, 'utf-8'));

    for (const item of personalItems) {
      await prisma.personalCollectionItem.create({
        data: {
          id: item.id,
          userId: item.userId,
          minifigure_no: item.minifigure_no,
          minifigure_name: item.minifigure_name,
          quantity: item.quantity,
          condition: item.condition,
          image_url: item.image_url,
          pricing_six_month_avg: item.pricing_six_month_avg,
          pricing_current_avg: item.pricing_current_avg,
          pricing_current_lowest: item.pricing_current_lowest,
          pricing_suggested_price: item.pricing_suggested_price,
          notes: item.notes,
          acquisition_date: item.acquisition_date ? new Date(item.acquisition_date) : null,
          acquisition_notes: item.acquisition_notes,
          display_location: item.display_location,
          date_added: new Date(item.date_added),
          last_updated: new Date(item.last_updated),
        }
      });
    }
    console.log(`✅ Restored ${personalItems.length} personal items`);

    // Restore Listings
    console.log('📥 Restoring Listings...');
    const listingsPath = path.join(backupDir, `listings-${timestamp}.json`);
    const listings = JSON.parse(fs.readFileSync(listingsPath, 'utf-8'));

    for (const listing of listings) {
      await prisma.listing.create({
        data: {
          id: listing.id,
          userId: listing.userId,
          collectionItemId: listing.collectionItemId,
          title: listing.title,
          description: listing.description,
          platform: listing.platform,
          condition_detail: listing.condition_detail,
          accessories: listing.accessories,
          known_flaws: listing.known_flaws,
          quantity_to_list: listing.quantity_to_list,
          list_price: listing.list_price,
          status: listing.status,
          created_at: new Date(listing.created_at),
          updated_at: new Date(listing.updated_at),
          sold_at: listing.sold_at ? new Date(listing.sold_at) : null,
        }
      });
    }
    console.log(`✅ Restored ${listings.length} listings`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ DATABASE RESTORE COMPLETE!');
    console.log('='.repeat(70));
    console.log(`\n✅ Restored ${summary.total_user_items} user items from backup`);
    console.log(`✅ All ${users.length} users and their collections have been restored\n`);

  } catch (error) {
    console.error('\n❌ RESTORE FAILED:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreBackup();
