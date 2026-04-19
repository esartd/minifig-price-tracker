/**
 * Import backed up data from Neon into Hostinger MySQL
 */

import { PrismaClient } from '../node_modules/.prisma/client-hostinger';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.HOSTINGER_DATABASE_URL
    }
  }
});

async function importData() {
  console.log('📥 Importing data to Hostinger MySQL...');

  try {
    const backupDir = path.join(process.cwd(), 'hostinger-migration-backup');

    // Find the latest backup files
    const files = fs.readdirSync(backupDir);
    const latestTimestamp = files
      .filter(f => f.startsWith('users-'))
      .map(f => f.replace('users-', '').replace('.json', ''))
      .sort()
      .reverse()[0];

    console.log('📂 Using backup from:', latestTimestamp);

    // Load data
    const users = JSON.parse(
      fs.readFileSync(path.join(backupDir, `users-${latestTimestamp}.json`), 'utf-8')
    );
    const accounts = JSON.parse(
      fs.readFileSync(path.join(backupDir, `accounts-${latestTimestamp}.json`), 'utf-8')
    );
    const collectionItems = JSON.parse(
      fs.readFileSync(path.join(backupDir, `collection-items-${latestTimestamp}.json`), 'utf-8')
    );
    const personalItems = JSON.parse(
      fs.readFileSync(path.join(backupDir, `personal-items-${latestTimestamp}.json`), 'utf-8')
    );
    const listings = JSON.parse(
      fs.readFileSync(path.join(backupDir, `listings-${latestTimestamp}.json`), 'utf-8')
    );
    const priceCache = JSON.parse(
      fs.readFileSync(path.join(backupDir, `price-cache-${latestTimestamp}.json`), 'utf-8')
    );

    console.log('📊 Data to import:');
    console.log('  Users:', users.length);
    console.log('  Accounts:', accounts.length);
    console.log('  Collection Items:', collectionItems.length);
    console.log('  Personal Items:', personalItems.length);
    console.log('  Listings:', listings.length);
    console.log('  Price Cache:', priceCache.length);

    // Import users first (parent table)
    console.log('⏳ Importing users...');
    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          image: user.image,
          preferredCurrency: user.preferredCurrency,
          preferredCountryCode: user.preferredCountryCode,
          preferredRegion: user.preferredRegion,
          currencySymbol: user.currencySymbol,
          locale: user.locale,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          scanCredits: user.scanCredits || 0,
          stripeCustomerId: user.stripeCustomerId,
          stripeSubscriptionId: user.stripeSubscriptionId,
          subscriptionEndsAt: user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null,
          subscriptionPlan: user.subscriptionPlan,
          subscriptionStatus: user.subscriptionStatus,
        }
      });
    }
    console.log('✅ Users imported');

    // Import accounts
    if (accounts.length > 0) {
      console.log('⏳ Importing accounts...');
      for (const account of accounts) {
        await prisma.account.create({
          data: {
            userId: account.userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
            createdAt: new Date(account.createdAt),
            updatedAt: new Date(account.updatedAt),
          }
        });
      }
      console.log('✅ Accounts imported');
    }

    // Import collection items
    if (collectionItems.length > 0) {
      console.log('⏳ Importing collection items...');
      for (const item of collectionItems) {
        await prisma.collectionItem.create({
          data: {
            id: item.id,
            minifigure_no: item.minifigure_no,
            minifigure_name: item.minifigure_name,
            quantity: item.quantity,
            condition: item.condition,
            image_url: item.image_url,
            pricing_six_month_avg: item.pricing_six_month_avg,
            pricing_current_avg: item.pricing_current_avg,
            pricing_current_lowest: item.pricing_current_lowest,
            pricing_suggested_price: item.pricing_suggested_price,
            userId: item.userId,
            date_added: new Date(item.date_added),
            last_updated: new Date(item.last_updated),
          }
        });
      }
      console.log('✅ Collection items imported');
    }

    // Import personal collection items
    if (personalItems.length > 0) {
      console.log('⏳ Importing personal collection items...');
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
      console.log('✅ Personal collection items imported');
    }

    // Import listings
    if (listings.length > 0) {
      console.log('⏳ Importing listings...');
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
      console.log('✅ Listings imported');
    }

    // Import price cache
    if (priceCache.length > 0) {
      console.log('⏳ Importing price cache...');
      for (const cache of priceCache) {
        await prisma.priceCache.create({
          data: {
            id: cache.id,
            minifigure_no: cache.minifigure_no,
            condition: cache.condition,
            six_month_avg: cache.six_month_avg,
            current_avg: cache.current_avg,
            current_lowest: cache.current_lowest,
            suggested_price: cache.suggested_price,
            cached_at: cache.cached_at ? new Date(cache.cached_at) : new Date(),
            last_updated: cache.last_updated ? new Date(cache.last_updated) : new Date(),
          }
        });
      }
      console.log('✅ Price cache imported');
    }

    console.log('');
    console.log('🎉 Import complete!');
    console.log('✅ All data successfully migrated to Hostinger MySQL');
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importData().catch(console.error);
