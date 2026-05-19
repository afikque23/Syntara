-- Add notIncluded list to pricing

ALTER TABLE `AdminPricing` ADD COLUMN `notIncluded` JSON NULL;
