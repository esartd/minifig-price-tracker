-- CreateTable
CREATE TABLE `SetContents` (
    `id` VARCHAR(191) NOT NULL,
    `set_no` VARCHAR(191) NOT NULL,
    `minifig_no` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `fetched_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SetContents_set_no_idx`(`set_no`),
    INDEX `SetContents_minifig_no_idx`(`minifig_no`),
    INDEX `SetContents_fetched_at_idx`(`fetched_at`),
    UNIQUE INDEX `SetContents_set_no_minifig_no_key`(`set_no`, `minifig_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SetContentsFetched` (
    `set_no` VARCHAR(191) NOT NULL,
    `minifig_count` INTEGER NOT NULL,
    `fetched_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fetched_via` VARCHAR(191) NOT NULL,

    INDEX `SetContentsFetched_fetched_at_idx`(`fetched_at`),
    INDEX `SetContentsFetched_fetched_via_idx`(`fetched_via`),
    PRIMARY KEY (`set_no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
