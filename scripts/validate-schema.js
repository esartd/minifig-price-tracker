#!/usr/bin/env node

/**
 * Schema Validation Script
 * Prevents accidental deployment with SQLite provider to production
 *
 * This runs automatically:
 * - Before building (npm run build)
 * - Before pushing to git (pre-push hook)
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Check if this is a production build
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

// Extract provider from schema
const providerMatch = schema.match(/provider\s*=\s*"(\w+)"/);
const provider = providerMatch ? providerMatch[1] : null;

console.log('🔍 Validating Prisma schema...');
console.log(`   Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`   Provider: ${provider}`);

// Production checks
if (isProduction) {
  if (provider !== 'postgresql') {
    console.error('\n❌ SCHEMA VALIDATION FAILED!');
    console.error('   Production builds MUST use PostgreSQL provider.');
    console.error('   Current provider:', provider);
    console.error('\n   To fix:');
    console.error('   1. Run: git restore prisma/schema.prisma');
    console.error('   2. Verify provider is "postgresql"');
    console.error('   3. Try building again\n');
    process.exit(1);
  }

  // Check for @db.Text on description field (required for PostgreSQL)
  if (!schema.includes('description          String   @db.Text')) {
    console.error('\n⚠️  WARNING: Missing @db.Text on description field');
    console.error('   PostgreSQL should use @db.Text for long text fields.');
    console.error('   Current schema may cause issues.\n');
    // Warning only, don't fail build
  }
}

// Development checks
if (!isProduction && provider !== 'sqlite') {
  console.log('\n⚠️  NOTE: Development detected with PostgreSQL provider');
  console.log('   This is OK if you have a local PostgreSQL database.');
  console.log('   If you want to use SQLite locally, run:');
  console.log('   - Change provider to "sqlite" in prisma/schema.prisma');
  console.log('   - Remove @db.Text from description field\n');
}

console.log('✅ Schema validation passed!\n');
