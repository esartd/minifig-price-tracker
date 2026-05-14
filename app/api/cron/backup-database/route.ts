import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Verify cron secret to prevent unauthorized backups
function verifyCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('❌ CRON_SECRET not configured');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  // Verify this is a legitimate cron request
  if (!verifyCronRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupDir = path.join(process.cwd(), 'database-backups');

  try {
    console.log('🔒 Starting automated database backup...');

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Backup critical user data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        preferredCurrency: true,
        preferredCountryCode: true,
        preferredRegion: true,
        currencySymbol: true,
        locale: true,
      }
    });

    const collectionItems = await prisma.collectionItem.findMany();
    const personalItems = await prisma.personalCollectionItem.findMany();
    const listings = await prisma.listing.findMany();

    // Write backup files
    fs.writeFileSync(
      path.join(backupDir, `users-${timestamp}.json`),
      JSON.stringify(users, null, 2)
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

    // Create summary
    const summary = {
      timestamp,
      backup_date: new Date().toISOString(),
      tables: {
        users: users.length,
        collectionItems: collectionItems.length,
        personalItems: personalItems.length,
        listings: listings.length,
      },
      total_user_items: collectionItems.length + personalItems.length,
    };

    fs.writeFileSync(
      path.join(backupDir, `BACKUP-SUMMARY-${timestamp}.json`),
      JSON.stringify(summary, null, 2)
    );

    // Commit and push to GitHub (this runs in production on Vercel)
    if (process.env.VERCEL && process.env.GITHUB_TOKEN) {
      try {
        console.log('📤 Pushing backup to GitHub...');

        // Configure git
        await execAsync('git config user.email "backup-bot@figtracker.com"');
        await execAsync('git config user.name "FigTracker Backup Bot"');

        // Add backup files
        await execAsync(`git add ${backupDir}/*`);

        // Commit with timestamp
        await execAsync(`git commit -m "Automated backup: ${timestamp} - ${summary.total_user_items} user items"`);

        // Push to GitHub
        await execAsync(`git push https://${process.env.GITHUB_TOKEN}@github.com/esartd/minifig-price-tracker.git HEAD:backups`);

        console.log('✅ Backup pushed to GitHub');
      } catch (gitError) {
        console.error('⚠️  Git push failed (backup still saved locally):', gitError);
      }
    }

    console.log('✅ Backup complete!');
    console.log(`   Users: ${users.length}`);
    console.log(`   Total Items: ${summary.total_user_items}`);

    return NextResponse.json({
      success: true,
      summary,
      message: 'Database backup completed successfully'
    });

  } catch (error) {
    console.error('❌ Backup failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Backup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
