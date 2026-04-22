-- CreateTable
CREATE TABLE "SetInventoryItem" (
    "id" TEXT NOT NULL,
    "box_no" TEXT NOT NULL,
    "set_name" TEXT NOT NULL,
    "category_name" TEXT,
    "quantity" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "image_url" TEXT,
    "pricing_six_month_avg" DOUBLE PRECISION,
    "pricing_current_avg" DOUBLE PRECISION,
    "pricing_current_lowest" DOUBLE PRECISION,
    "pricing_suggested_price" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetInventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetPersonalCollectionItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "box_no" TEXT NOT NULL,
    "set_name" TEXT NOT NULL,
    "category_name" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" TEXT NOT NULL DEFAULT 'new',
    "image_url" TEXT,
    "pricing_six_month_avg" DOUBLE PRECISION,
    "pricing_current_avg" DOUBLE PRECISION,
    "pricing_current_lowest" DOUBLE PRECISION,
    "pricing_suggested_price" DOUBLE PRECISION,
    "notes" TEXT,
    "acquisition_date" TIMESTAMP(3),
    "acquisition_notes" TEXT,
    "display_location" TEXT,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetPersonalCollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SetInventoryItem_box_no_idx" ON "SetInventoryItem"("box_no");

-- CreateIndex
CREATE INDEX "SetInventoryItem_userId_idx" ON "SetInventoryItem"("userId");

-- CreateIndex
CREATE INDEX "SetInventoryItem_userId_condition_idx" ON "SetInventoryItem"("userId", "condition");

-- CreateIndex
CREATE INDEX "SetInventoryItem_category_name_idx" ON "SetInventoryItem"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "SetInventoryItem_userId_box_no_condition_key" ON "SetInventoryItem"("userId", "box_no", "condition");

-- CreateIndex
CREATE INDEX "SetPersonalCollectionItem_userId_idx" ON "SetPersonalCollectionItem"("userId");

-- CreateIndex
CREATE INDEX "SetPersonalCollectionItem_userId_condition_idx" ON "SetPersonalCollectionItem"("userId", "condition");

-- CreateIndex
CREATE INDEX "SetPersonalCollectionItem_category_name_idx" ON "SetPersonalCollectionItem"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "SetPersonalCollectionItem_userId_box_no_condition_key" ON "SetPersonalCollectionItem"("userId", "box_no", "condition");

-- AddForeignKey
ALTER TABLE "SetInventoryItem" ADD CONSTRAINT "SetInventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetPersonalCollectionItem" ADD CONSTRAINT "SetPersonalCollectionItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
