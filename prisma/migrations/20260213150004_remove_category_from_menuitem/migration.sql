/*
  Warnings:

  - You are about to drop the column `categoryId` on the `menu_item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "menu_item_restaurantId_categoryId_idx";

-- AlterTable
ALTER TABLE "menu_item" DROP COLUMN "categoryId";

-- CreateIndex
CREATE INDEX "menu_item_restaurantId_idx" ON "menu_item"("restaurantId");
