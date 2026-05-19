-- Add previewFeatures list to AdminService (used for bullet preview card)
ALTER TABLE `AdminService` ADD COLUMN `previewFeatures` JSON NULL;
