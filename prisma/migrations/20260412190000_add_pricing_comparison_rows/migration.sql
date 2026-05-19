-- Add pricing comparison table rows

-- CreateTable
CREATE TABLE `AdminPricingComparisonRow` (
  `id` VARCHAR(191) NOT NULL,
  `feature` VARCHAR(191) NOT NULL,
  `values` JSON NOT NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `AdminPricingComparisonRow_sortOrder_idx`(`sortOrder`),
  INDEX `AdminPricingComparisonRow_createdAt_idx`(`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
