/**
 * Dual Database Setup
 *
 * NEON: User data (accounts, collections, listings)
 * SUPABASE: Public data (catalog, cache, API tracker)
 *
 * This splits bandwidth usage to avoid hitting Neon's 5GB/month limit
 */

import { PrismaClient as PrismaClientNeon } from '../node_modules/.prisma/client-neon';
import { PrismaClient as PrismaClientSupabase } from '../node_modules/.prisma/client-supabase';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientNeon | undefined;
  // eslint-disable-next-line no-var
  var prismaPublic: PrismaClientSupabase | undefined;
}

// Neon Database - User Data
export const prisma =
  global.prisma ||
  new PrismaClientNeon({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Supabase Database - Public Data
export const prismaPublic =
  global.prismaPublic ||
  new PrismaClientSupabase({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
  global.prismaPublic = prismaPublic;
}

// Helper to check which database to use
export function isDatabaseSplit() {
  return !!process.env.SUPABASE_DATABASE_URL;
}

console.log('✅ Dual database setup loaded');
console.log('   - Neon (User data):', process.env.DATABASE_URL?.includes('neon.tech') ? 'Connected' : 'NOT FOUND');
console.log('   - Supabase (Public data):', process.env.SUPABASE_DATABASE_URL?.includes('supabase.co') ? 'Connected' : 'NOT FOUND');
