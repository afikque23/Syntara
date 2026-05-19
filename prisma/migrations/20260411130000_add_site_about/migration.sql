-- CreateTable
CREATE TABLE `SiteAbout` (
  `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
  `data` JSON NOT NULL,
  `published` BOOLEAN NOT NULL DEFAULT true,
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `SiteAbout_published_idx` ON `SiteAbout`(`published`);
