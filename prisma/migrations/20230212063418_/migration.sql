-- CreateTable
CREATE TABLE `Restaurant` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `contactNo` VARCHAR(191) NOT NULL,
    `openingTimes` VARCHAR(191) NOT NULL,
    `isPublished` BOOLEAN NOT NULL,
    `imageId` VARCHAR(191) NULL,

    UNIQUE INDEX `Restaurant_id_key`(`id`),
    UNIQUE INDEX `Restaurant_imageId_key`(`imageId`),
    INDEX `Restaurant_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `availableTime` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `restaurantId` VARCHAR(191) NULL,

    UNIQUE INDEX `Menu_id_key`(`id`),
    INDEX `Menu_restaurantId_idx`(`restaurantId`),
    PRIMARY KEY (`id`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `menuId` VARCHAR(191) NULL,

    UNIQUE INDEX `Category_id_key`(`id`),
    INDEX `Category_menuId_idx`(`menuId`),
    PRIMARY KEY (`id`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItem` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `categoryId` VARCHAR(191) NULL,
    `imageId` VARCHAR(191) NULL,

    UNIQUE INDEX `MenuItem_id_key`(`id`),
    UNIQUE INDEX `MenuItem_imageId_key`(`imageId`),
    INDEX `MenuItem_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `blurHash` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NULL,

    UNIQUE INDEX `Image_id_key`(`id`),
    INDEX `Image_restaurantId_idx`(`restaurantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
