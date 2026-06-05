#!/usr/bin/env ts-node
/**
 * Apply ISR Cache Table Migration
 *
 * Creates the IsrCache table for Next.js page caching.
 * This prevents re-fetching BrickLink API data on every page view.
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.production' });

async function applyMigration() {
  console.log('🚀 Applying ISR Cache Table Migration');
  console.log('=====================================\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  // Parse connection string
  const match = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    console.error('❌ Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [, user, password, host, port, database] = match;

  console.log(`📊 Connecting to: ${host}:${port}/${database}`);

  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database,
  });

  try {
    // Read migration SQL
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_isr_cache_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('\n📝 Executing migration SQL...\n');

    // Execute migration
    await connection.query(sql);

    console.log('✅ IsrCache table created successfully!\n');

    // Verify table exists
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'IsrCache'",
      [database]
    );

    const tableExists = (rows as any)[0].count > 0;

    if (tableExists) {
      console.log('✅ Verification: IsrCache table exists');

      // Show table structure
      const [columns] = await connection.query('DESCRIBE IsrCache');
      console.log('\n📋 Table Structure:');
      console.table(columns);
    } else {
      console.error('❌ Verification failed: Table not found');
      process.exit(1);
    }

    console.log('\n🎉 Migration Complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Regenerate Prisma client: npx prisma generate --schema=prisma/schema-hostinger.prisma');
    console.log('   2. Build locally: npm run build');
    console.log('   3. Deploy to VPS');
    console.log('   4. Restart PM2: pm2 restart figtracker\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

applyMigration().catch(console.error);
