-- AlterTable
ALTER TABLE `adminuser` ADD COLUMN `role` ENUM('owner', 'admin') NOT NULL DEFAULT 'admin';

-- CreateTable
CREATE TABLE `AdminAuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `actorUserId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdminAuditLog_actorUserId_idx`(`actorUserId`),
    INDEX `AdminAuditLog_entity_entityId_idx`(`entity`, `entityId`),
    INDEX `AdminAuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AdminAuditLog` ADD CONSTRAINT `AdminAuditLog_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `AdminUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
