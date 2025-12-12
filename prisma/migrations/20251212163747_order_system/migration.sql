/*
  Warnings:

  - You are about to drop the column `Chef_ID` on the `ChefConnection` table. All the data in the column will be lost.
  - You are about to drop the column `Order_Taker_ID` on the `WaiterConnection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chefId]` on the table `ChefConnection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderTakerId]` on the table `WaiterConnection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chefId` to the `ChefConnection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderTakerId` to the `WaiterConnection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PICKED', 'READY', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "ChefConnection" DROP CONSTRAINT "ChefConnection_Chef_ID_fkey";

-- DropForeignKey
ALTER TABLE "WaiterConnection" DROP CONSTRAINT "WaiterConnection_Order_Taker_ID_fkey";

-- DropIndex
DROP INDEX "ChefConnection_Chef_ID_key";

-- DropIndex
DROP INDEX "WaiterConnection_Order_Taker_ID_key";

-- AlterTable
ALTER TABLE "ChefConnection" DROP COLUMN "Chef_ID",
ADD COLUMN     "chefId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WaiterConnection" DROP COLUMN "Order_Taker_ID",
ADD COLUMN     "orderTakerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderTakerId" INTEGER NOT NULL,
    "chefId" INTEGER,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChefConnection_chefId_key" ON "ChefConnection"("chefId");

-- CreateIndex
CREATE UNIQUE INDEX "WaiterConnection_orderTakerId_key" ON "WaiterConnection"("orderTakerId");

-- AddForeignKey
ALTER TABLE "WaiterConnection" ADD CONSTRAINT "WaiterConnection_orderTakerId_fkey" FOREIGN KEY ("orderTakerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefConnection" ADD CONSTRAINT "ChefConnection_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderTakerId_fkey" FOREIGN KEY ("orderTakerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
