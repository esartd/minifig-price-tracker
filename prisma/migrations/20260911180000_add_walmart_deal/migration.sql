-- Walmart deals, replacing a dead Amazon integration.
--
-- AmazonDeal has been frozen at five rows since 13 May 2026 and cannot be
-- refreshed: Amazon retired PA-API 5.0 on 15 May 2026, and its replacement
-- requires 10 qualifying sales per 30 days, which this site does not have.
-- Walmart is reachable today through the Impact affiliate catalog.
--
-- Additive: a new table, nothing existing reads it, so it is safe to apply
-- before the code that uses it ships.
--
-- listPrice is NULL-able on purpose. Most Walmart items are not discounted,
-- and defaulting it to currentPrice would make every undiscounted set render
-- as "0% off" instead of simply having no badge.

CREATE TABLE `WalmartDeal` (
  `id`              VARCHAR(191) NOT NULL,
  `boxNo`           VARCHAR(191) NOT NULL,
  `walmartItemId`   VARCHAR(191) NOT NULL,
  `title`           TEXT         NOT NULL,
  `currentPrice`    DOUBLE       NOT NULL,
  `listPrice`       DOUBLE       NULL,
  `discountPercent` INT          NOT NULL DEFAULT 0,
  `inStock`         BOOLEAN      NOT NULL DEFAULT true,
  `currency`        VARCHAR(191) NOT NULL DEFAULT 'USD',
  `productUrl`      TEXT         NOT NULL,
  `imageUrl`        TEXT         NULL,
  `lastUpdated`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `WalmartDeal_boxNo_key`(`boxNo`),
  INDEX `WalmartDeal_discountPercent_idx`(`discountPercent`),
  INDEX `WalmartDeal_lastUpdated_idx`(`lastUpdated`),
  INDEX `WalmartDeal_inStock_discountPercent_idx`(`inStock`, `discountPercent`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
