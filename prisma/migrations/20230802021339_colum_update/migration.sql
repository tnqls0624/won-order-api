-- AlterTable
ALTER TABLE `menu` MODIFY `content` VARCHAR(191) NULL,
    MODIFY `is_active` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `menu_category` MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `setting` MODIFY `wifi_ssid` VARCHAR(191) NULL,
    MODIFY `wifi_pw` VARCHAR(191) NULL,
    MODIFY `market_content` VARCHAR(191) NULL,
    MODIFY `start_business_hours` VARCHAR(191) NULL,
    MODIFY `end_business_hours` VARCHAR(191) NULL,
    MODIFY `start_break_time` VARCHAR(191) NULL,
    MODIFY `end_break_time` VARCHAR(191) NULL,
    MODIFY `comment` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `remove_at` DATETIME(3) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL;
