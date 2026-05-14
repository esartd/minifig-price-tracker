#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 [postinstall] Starting Prisma client cleanup and regeneration...');

const clientPath = path.join(__dirname, '..', 'node_modules', '@prisma', 'client-hostinger');

// Check if corrupted client exists
if (fs.existsSync(clientPath)) {
  console.log('🗑️  [postinstall] Removing existing Prisma client...');
  try {
    fs.rmSync(clientPath, { recursive: true, force: true });
    console.log('✅ [postinstall] Prisma client removed successfully');
  } catch (error) {
    console.error('⚠️  [postinstall] Failed to remove Prisma client:', error.message);
  }
} else {
  console.log('✨ [postinstall] No existing Prisma client found (fresh install)');
}

// Regenerate Prisma client
console.log('🔨 [postinstall] Generating fresh Prisma client...');
try {
  execSync('npx prisma generate --schema=prisma/schema-hostinger.prisma', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ [postinstall] Prisma client generated successfully');

  // Log generated binaries (rhel is correct for Vercel)
  const engines = fs.readdirSync(clientPath).filter(f => f.endsWith('.node'));
  console.log('📦 [postinstall] Generated engine binaries:', engines);
  console.log('✅ [postinstall] Prisma client ready for deployment!');
} catch (error) {
  console.error('❌ [postinstall] Failed to generate Prisma client:', error.message);
  process.exit(1);
}
