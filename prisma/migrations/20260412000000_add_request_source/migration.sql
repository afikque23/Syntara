-- AlterTable
ALTER TABLE `AdminRequest` ADD COLUMN `source` ENUM('public', 'admin') NOT NULL DEFAULT 'public';
