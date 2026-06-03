/**
 * Backup all user data from Neon before migration to Hostinger
 */

import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

async function backupForMigration() {
  console.log('🔄 Backing up data from Neon...');

  try {
    const users = await prisma.user.findMany();
    const accounts = await prisma.account.findMany();
    const sessions = await prisma.session.findMany();
    const collectionItems = await prisma.collectionItem.findMany();
    const personalItems = await prisma.personalCollectionItem.findMany();
    const listings = await prisma.listing.findMany();
    const priceCache = await prisma.priceCache.findMany();

    console.log('📊 Data counts:');
    console.log('  Users:', users.length);
    console.log('  Accounts:', accounts.length);
    console.log('  Sessions:', sessions.length);
    console.log('  Collection Items:', collectionItems.length);
    console.log('  Personal Items:', personalItems.length);
    console.log('  Listings:', listings.length);
    console.log('  Price Cache:', priceCache.length);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'hostinger-migration-backup');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(backupDir, `users-${timestamp}.json`),
      JSON.stringify(users, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, `accounts-${timestamp}.json`),
      JSON.stringify(accounts, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, `sessions-${timestamp}.json`),
      JSON.stringify(sessions, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, `collection-items-${timestamp}.json`),
      JSON.stringify(collectionItems, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, `personal-items-${timestamp}.json`),
      JSON.stringify(personalItems, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, `listings-${timestamp}.json`),
      JSON.stringify(listings, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, `price-cache-${timestamp}.json`),
      JSON.stringify(priceCache, null, 2)
    );

    console.log('✅ Backup complete!');
    console.log('📁 Files saved to:', backupDir);
    console.log('🕒 Timestamp:', timestamp);
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backupForMigration().catch(console.error);
