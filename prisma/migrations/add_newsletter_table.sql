-- Add newsletter subscribers table
-- Run this on your production database

CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "subscribedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP,
    "unsubscribedAt" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_email_idx" ON "NewsletterSubscriber"("email");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_confirmed_idx" ON "NewsletterSubscriber"("confirmed");
