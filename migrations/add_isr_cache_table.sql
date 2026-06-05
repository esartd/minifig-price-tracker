-- ISR Cache Table for Next.js Page Caching
-- Stores server-side rendered pages to avoid re-fetching BrickLink API data

CREATE TABLE IF NOT EXISTS IsrCache (
    `key` VARCHAR(500) NOT NULL PRIMARY KEY,
    `value` LONGTEXT NOT NULL,
    `last_modified` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NULL,
    `tags` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_expires_at (expires_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
