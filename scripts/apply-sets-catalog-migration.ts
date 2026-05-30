#!/usr/bin/env ts-node
/**
 * Apply SetsCatalog table migration to production database
 * Run this ONCE to create the table
 */

import { PrismaClient } from '@prisma/client-hostinger';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || process.env.HOSTINGER_DATABASE_URL
});

async function main() {
  console.log('🔧 Applying SetsCatalog table migration...\n');

  const migrationPath = path.join(process.cwd(), 'migrations/add_sets_catalog_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  try {
    // Execute the migration SQL
    await prisma.$executeRawUnsafe(sql);

    console.log('✅ Migration applied successfully!');
    console.log('   Created table: SetsCatalog');
    console.log('   Indexes: category_name, search_name, year_released, description_status\n');

  } catch (error: any) {
    if (error.message.includes('Table') && error.message.includes('already exists')) {
      console.log('ℹ️  Table already exists, skipping migration');
    } else {
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
