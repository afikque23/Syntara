-- Add tagline + highlight fields to AdminService
ALTER TABLE `AdminService` ADD COLUMN `tagline` VARCHAR(191) NULL;
ALTER TABLE `AdminService` ADD COLUMN `highlight` VARCHAR(191) NULL;
