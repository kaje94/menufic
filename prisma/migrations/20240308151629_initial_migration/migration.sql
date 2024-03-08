-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL,
    "imageId" TEXT,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id","userId")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "availableTime" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "restaurantId" TEXT,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id","userId")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "menuId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id","userId")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "categoryId" TEXT,
    "imageId" TEXT,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id","userId")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "blurHash" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "restaurantId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_id_key" ON "Restaurant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_imageId_key" ON "Restaurant"("imageId");

-- CreateIndex
CREATE INDEX "Restaurant_isPublished_idx" ON "Restaurant"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_id_key" ON "Menu"("id");

-- CreateIndex
CREATE INDEX "Menu_restaurantId_idx" ON "Menu"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

-- CreateIndex
CREATE INDEX "Category_menuId_idx" ON "Category"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_id_key" ON "MenuItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_imageId_key" ON "MenuItem"("imageId");

-- CreateIndex
CREATE INDEX "MenuItem_categoryId_idx" ON "MenuItem"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");

-- CreateIndex
CREATE INDEX "Image_restaurantId_idx" ON "Image"("restaurantId");
