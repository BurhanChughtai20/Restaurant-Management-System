/*
  Warnings:

  - Added the required column `expiresAt` to the `chef_connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `chef_connection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chef_connection" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "chef_connection_restaurantId_idx" ON "chef_connection"("restaurantId");

-- AddForeignKey
ALTER TABLE "chef_connection" ADD CONSTRAINT "chef_connection_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
