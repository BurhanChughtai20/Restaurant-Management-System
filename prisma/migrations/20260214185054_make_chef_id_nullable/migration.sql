-- AlterTable
ALTER TABLE "chef_connection" ALTER COLUMN "chefId" DROP NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT false;
