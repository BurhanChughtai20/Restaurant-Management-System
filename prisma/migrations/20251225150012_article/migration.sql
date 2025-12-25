-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "restaurantName" VARCHAR(150) NOT NULL,
    "restaurantWebsite" VARCHAR(255),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publisherId" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Article_publisherId_idx" ON "Article"("publisherId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
