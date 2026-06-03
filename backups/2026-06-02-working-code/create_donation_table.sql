-- Create Donation table for PayPal donation tracking
-- Run this in Supabase SQL Editor if migration gets stuck

CREATE TABLE IF NOT EXISTS "Donation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "paypalTxnId" TEXT NOT NULL UNIQUE,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "donorEmail" TEXT NOT NULL,
  "donorName" TEXT,
  "displayName" TEXT,
  "showOnLeaderboard" BOOLEAN NOT NULL DEFAULT false,
  "season" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'completed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Donation_season_idx" ON "Donation"("season");
CREATE INDEX IF NOT EXISTS "Donation_showOnLeaderboard_season_idx" ON "Donation"("showOnLeaderboard", "season");

-- Verify table was created
SELECT table_name FROM information_schema.tables WHERE table_name = 'Donation';
