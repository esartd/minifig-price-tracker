-- PREVIEW: Migration to add Article CMS models
-- DO NOT RUN THIS ON PRODUCTION YET
-- This is for review only

-- Add 'role' column to User table
ALTER TABLE "User" ADD COLUMN "role" TEXT DEFAULT 'user';

-- Create Article table
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "contentBlocks" JSONB NOT NULL,
    "readTimeMinutes" INTEGER,
    "category" TEXT,
    CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create ArticleTranslation table
CREATE TABLE "ArticleTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    CONSTRAINT "ArticleTranslation_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArticleTranslation_articleId_locale_key" UNIQUE ("articleId", "locale")
);

-- Create ArticleImage table
CREATE TABLE "ArticleImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT,
    "filename" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleImage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ArticleImage_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX "Article_status_idx" ON "Article"("status");
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");
CREATE INDEX "Article_slug_idx" ON "Article"("slug");
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");

CREATE INDEX "ArticleTranslation_locale_idx" ON "ArticleTranslation"("locale");

CREATE INDEX "ArticleImage_articleId_idx" ON "ArticleImage"("articleId");
CREATE INDEX "ArticleImage_uploadedBy_idx" ON "ArticleImage"("uploadedBy");

-- Update admin user role (replace with your actual user ID)
-- You'll need to run this manually with the correct user ID:
-- UPDATE "User" SET "role" = 'admin' WHERE "email" = 'erickkosysu@gmail.com';
