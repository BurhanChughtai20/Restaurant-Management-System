/*
  Warnings:

  - A unique constraint covering the columns `[sessionToken]` on the table `WaiterConnection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionToken` to the `WaiterConnection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Chef';

-- AlterTable
ALTER TABLE "WaiterConnection" ADD COLUMN     "fromTime" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ADD COLUMN     "toTime" TEXT,
ALTER COLUMN "socketId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WaiterConnection_sessionToken_key" ON "WaiterConnection"("sessionToken");
