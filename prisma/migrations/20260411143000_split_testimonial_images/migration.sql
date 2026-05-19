-- Split testimonial proof images into a dedicated table

-- Remove proofImage from comment testimonials
ALTER TABLE `AdminTestimonial` DROP COLUMN `proofImage`;

-- CreateTable
CREATE TABLE `AdminTestimonialImage` (
  `id` VARCHAR(191) NOT NULL,
  `imageUrl` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `AdminTestimonialImage_createdAt_idx`(`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
