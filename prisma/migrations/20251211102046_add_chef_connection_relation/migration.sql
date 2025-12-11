-- CreateTable
CREATE TABLE "ChefConnection" (
    "id" SERIAL NOT NULL,
    "Chef_ID" INTEGER NOT NULL,
    "socketId" TEXT,
    "sessionToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fromTime" TEXT,
    "toTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChefConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChefConnection_Chef_ID_key" ON "ChefConnection"("Chef_ID");

-- CreateIndex
CREATE UNIQUE INDEX "ChefConnection_socketId_key" ON "ChefConnection"("socketId");

-- CreateIndex
CREATE UNIQUE INDEX "ChefConnection_sessionToken_key" ON "ChefConnection"("sessionToken");

-- AddForeignKey
ALTER TABLE "ChefConnection" ADD CONSTRAINT "ChefConnection_Chef_ID_fkey" FOREIGN KEY ("Chef_ID") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
