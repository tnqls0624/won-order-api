/*
  Warnings:

  - You are about to drop the column `group_id` on the `admin` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.

*/
-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `admin_group_id_fkey`;

-- DropIndex
DROP INDEX `admin_admin_id_key` ON `admin`;

-- DropIndex
DROP INDEX `group_name_key` ON `group`;

-- DropIndex
DROP INDEX `table_table_num_key` ON `table`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `group_id`,
    MODIFY `type` ENUM('MASTER', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE';

-- CreateTable
CREATE TABLE `admin_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `group_id` INTEGER NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('SMS', 'PASSWORD') NOT NULL DEFAULT 'SMS',
    `phone` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_group` ADD CONSTRAINT `admin_group_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_group` ADD CONSTRAINT `admin_group_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
